/**
 * Minimal, careful App Store Connect API client (design D5 of add-ios-store-listing).
 *
 * - ES256 JWT signed with node:crypto from the user's .p8 — zero dependencies.
 * - Every request's path+method is checked against Apple's OpenAPI spec FIRST
 *   (~/Downloads/openapi.oas.json by default): if Apple doesn't document it,
 *   we refuse to call it.
 * - Read-only by default: `get` is safe; writes are explicit `post`/`patch`
 *   subcommands taking a JSON body file.
 * - NO retry logic, by design: an unexpected status prints the response and
 *   exits non-zero so nothing gets hammered.
 *
 * Credentials (env or flags): ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH.
 * Example:
 *   ASC_KEY_ID=ABC123 ASC_ISSUER_ID=uuid ASC_KEY_PATH=~/AuthKey.p8 \
 *     node scripts/asc-api.mjs get '/v1/apps?filter[bundleId]=be.pocito.thinkfast'
 */
import { createPrivateKey, createSign } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

const API_BASE = 'https://api.appstoreconnect.apple.com'
const SPEC_DEFAULT = resolve(homedir(), 'Downloads/openapi.oas.json')

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const KEY_ID = flag('key-id') ?? process.env.ASC_KEY_ID
const ISSUER_ID = flag('issuer') ?? process.env.ASC_ISSUER_ID
const KEY_PATH = (flag('key') ?? process.env.ASC_KEY_PATH ?? '').replace(/^~/, homedir())
const SPEC_PATH = flag('spec') ?? process.env.ASC_SPEC ?? SPEC_DEFAULT

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/** node's createSign emits DER; JWS needs the raw r||s (2 x 32 bytes for P-256). */
function derToJoseSignature(der) {
  // SEQUENCE(len) INTEGER(r) INTEGER(s) — minimal ASN.1 walk
  if (der[0] !== 0x30) throw new Error('unexpected signature format')
  let pos = 2 // skip SEQUENCE header (length <= 128 assumption holds for P-256)
  const readInt = () => {
    if (der[pos] !== 0x02) throw new Error('unexpected ASN.1')
    const len = der[pos + 1]
    const start = pos + 2
    pos = start + len
    const int = der.subarray(start, pos)
    return int[0] === 0 ? int.subarray(1) : int // strip leading zero
  }
  const r = readInt()
  const s = readInt()
  const pad = (b) => Buffer.concat([Buffer.alloc(32 - b.length), b])
  return Buffer.concat([pad(r), pad(s)])
}

function makeToken() {
  if (!KEY_ID || !ISSUER_ID || !KEY_PATH) {
    console.error('Need ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH (env or --key-id/--issuer/--key)')
    process.exit(2)
  }
  const header = b64url(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = b64url(
    JSON.stringify({ iss: ISSUER_ID, iat: now, exp: now + 20 * 60, aud: 'appstoreconnect-v1' }),
  )
  const signer = createSign('SHA256')
  signer.update(`${header}.${payload}`)
  const signature = b64url(
    derToJoseSignature(signer.sign(createPrivateKey(readFileSync(KEY_PATH)))),
  )
  return `${header}.${payload}.${signature}`
}

/** Refuse any call Apple's own spec does not describe. */
function checkAgainstSpec(method, urlPath) {
  const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf8'))
  const query = urlPath.indexOf('?')
  const bare = query >= 0 ? urlPath.slice(0, query) : urlPath
  // resolve {param} templates by matching concrete segments
  const match = Object.keys(spec.paths).find((p) => {
    if (p.includes('?')) return false
    const specParts = p.split('/')
    const bareParts = bare.split('/')
    if (specParts.length !== bareParts.length) return false
    return specParts.every((seg, i) => seg.startsWith('{') || seg === bareParts[i])
  })
  if (!match || !(method.toLowerCase() in spec.paths[match])) {
    console.error(`REFUSED: ${method} ${urlPath} is not in the OpenAPI spec (${SPEC_PATH})`)
    process.exit(3)
  }
  return match
}

async function main() {
  const [command, urlPath, bodyFile] = args.filter((a) => !a.startsWith('--')).slice(0, 3)
  const method = { get: 'GET', post: 'POST', patch: 'PATCH', delete: 'DELETE' }[command]
  if (!method || !urlPath) {
    console.error('usage: asc-api.mjs get|post|patch|delete <path> [body.json]')
    process.exit(2)
  }
  const specPath = checkAgainstSpec(method, urlPath)
  const body = bodyFile ? readFileSync(bodyFile, 'utf8') : undefined
  const res = await fetch(`${API_BASE}${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${makeToken()}`,
      'Content-Type': 'application/json',
      ...(body ? { 'Content-Length': String(Buffer.byteLength(body)) } : {}),
    },
    body,
  })
  const text = await res.text()
  console.log(`${res.status} ${method} ${specPath}`)
  try {
    console.log(JSON.stringify(JSON.parse(text), null, 1).slice(0, 4000))
  } catch {
    console.log(text.slice(0, 2000))
  }
  if (res.status >= 400) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
