#!/usr/bin/env node
/**
 * Careful Google Play Developer Publishing API client (store-distribution spec).
 *
 *   - Auth: service-account RS256 JWT against Google's OAuth endpoint; the
 *     access token is cached until shortly before expiry.
 *   - playFetch(method, path, {body, raw}) → {status, body}; throws on >= 400.
 *   - NOTHING retries — a failure stops the caller for inspection (policy).
 *
 * Credentials: PLAY_KEY_PATH env var, else ~/.config/think-fast/play/service-account.json
 * Import from other scripts, or run directly for a read:
 *
 *   node scripts/play-api.mjs get /applications/<pkg>/edits   # (creates+leaks an edit — prefer the push script)
 */
import { createSign } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3'
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher'

const keyPath =
  process.env.PLAY_KEY_PATH ?? join(homedir(), '.config/think-fast/play/service-account.json')
if (!existsSync(keyPath)) throw new Error(`service account key not found: ${keyPath}`)
const sa = JSON.parse(readFileSync(keyPath, 'utf8'))

let cachedToken = null
let cachedUntil = 0

async function accessToken() {
  if (cachedToken && Date.now() < cachedUntil) return cachedToken
  const iat = Math.floor(Date.now() / 1000)
  const b64u = (buf) => Buffer.from(buf).toString('base64url')
  const header = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64u(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: 'https://oauth2.googleapis.com/token',
      iat,
      exp: iat + 600,
    }),
  )
  const sig = createSign('RSA-SHA256')
    .update(`${header}.${claims}`)
    .sign(sa.private_key, 'base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${sig}`,
    }),
  })
  if (res.status !== 200)
    throw new Error(`token endpoint ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const json = await res.json()
  cachedToken = json.access_token
  cachedUntil = Date.now() + (json.expires_in - 60) * 1000
  return cachedToken
}

/**
 * @param {string} method  HTTP method
 * @param {string} path    absolute path after /androidpublisher/v3
 * @param {{body?: object, raw?: {bytes: Buffer, contentType: string}}} [opts]
 *   body → JSON body; raw → binary upload (images)
 */
export async function playFetch(method, path, opts = {}) {
  const headers = { authorization: `Bearer ${await accessToken()}` }
  let body
  if (opts.raw) {
    headers['content-type'] = opts.raw.contentType
    body = opts.raw.bytes
  } else if (opts.body !== undefined) {
    headers['content-type'] = 'application/json'
    body = JSON.stringify(opts.body)
  }
  // media uploads use Google's /upload/ host prefix (see discovery doc); the
  // rest hang off the plain service root
  const url = path.startsWith('/upload/')
    ? `https://androidpublisher.googleapis.com${path}`
    : `${API}${path}`
  const res = await fetch(url, { method, headers, body })
  const text = await res.text()
  console.error(`${res.status} ${method} ${path.slice(0, 100)}`)
  if (res.status >= 400)
    throw new Error(
      `${res.status} ${method} ${path} — ${text.slice(0, 400)} (stopping, no retries by design)`,
    )
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }
  return { status: res.status, body: json }
}

const invokedDirectly =
  process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href
if (invokedDirectly) {
  const [method = 'get', path] = process.argv.slice(2)
  if (!path) {
    console.error('usage: play-api.mjs get|post|patch|put|delete <path-after-/androidpublisher/v3>')
    process.exit(2)
  }
  const { body } = await playFetch(method.toUpperCase(), path)
  console.log(JSON.stringify(body, null, 1).slice(0, 4000))
}
