/**
 * Uploads the generated App Store screenshots via the documented ASC API flow
 * (add-ios-store-listing design D4): reserve a slot per image, PUT the bytes to
 * Apple's signed upload operations (chunk-aware), then commit. Every API call
 * goes through asc-api.mjs's spec check; any unexpected response stops the run.
 *
 *   ASC_KEY_ID=… ASC_ISSUER_ID=… ASC_KEY_PATH=… node scripts/asc-upload-screens.mjs
 */
import { readFile, stat } from 'node:fs/promises'
import { ascFetch } from './asc-api.mjs'

const VERSION_ID = '5dd35034-3325-470f-99ee-4b9cdd80d14b' // editable 0.1.0, IOS
const SETS = [
  { displayType: 'APP_IPHONE_61', prefix: 'iphone' }, // Dynamic Island medium, 1179x2556
  { displayType: 'APP_IPAD_PRO_3GEN_129', prefix: 'ipad' }, // iPad 13", 2064x2752
]
const DIR = 'assets/store-listing/ios'

async function localizationId() {
  const { body } = await ascFetch(
    'GET',
    `/v1/appStoreVersions/${VERSION_ID}/appStoreVersionLocalizations?fields[appStoreVersionLocalizations]=locale`,
  )
  const loc = body.data.find((l) => l.attributes.locale === 'en-GB')
  if (!loc) throw new Error('no en-GB version localization found')
  return loc.id
}

/** Reuse the set for a display type if it exists (idempotent re-runs). */
async function ensureSet(locId, displayType) {
  const { body } = await ascFetch(
    'GET',
    `/v1/appStoreVersionLocalizations/${locId}/appScreenshotSets?filter[screenshotDisplayType]=${displayType}&limit=1`,
  )
  if (body.data.length > 0) return body.data[0].id
  const created = await ascFetch('POST', '/v1/appScreenshotSets', {
    data: {
      type: 'appScreenshotSets',
      attributes: { screenshotDisplayType: displayType },
      relationships: {
        appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: locId } },
      },
    },
  })
  return created.body.data.id
}

/** Reserve -> upload bytes (per signed operation, chunk-aware) -> commit. */
async function uploadImage(setId, path, fileName, fileSize) {
  const reserved = await ascFetch('POST', '/v1/appScreenshots', {
    data: {
      type: 'appScreenshots',
      attributes: { fileName, fileSize },
      relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: setId } } },
    },
  })
  const shot = reserved.body.data
  const ops = shot.attributes.uploadOperations ?? []
  const bytes = await readFile(path)
  for (const op of ops) {
    const chunk = bytes.subarray(op.offset ?? 0, (op.offset ?? 0) + op.length)
    const headers = Object.fromEntries((op.requestHeaders ?? []).map((h) => [h.name, h.value]))
    const res = await fetch(op.url, { method: op.method, headers, body: chunk })
    console.log(`${res.status} ${op.method} upload ${fileName} [+${op.offset ?? 0}..${op.length}]`)
    if (res.status >= 400) {
      console.log(await res.text().then((t) => t.slice(0, 500)))
      throw new Error(`upload failed for ${fileName} — stopping, no retries by design`)
    }
  }
  await ascFetch('PATCH', `/v1/appScreenshots/${shot.id}`, {
    data: { type: 'appScreenshots', id: shot.id, attributes: { uploaded: true } },
  })
}

async function main() {
  const locId = await localizationId()
  for (const { displayType, prefix } of SETS) {
    const setId = await ensureSet(locId, displayType)
    console.log(`set ${displayType}: ${setId}`)
    for (let i = 1; i <= 5; i++) {
      const name = `${prefix}-0${i}.png` // canonical short name on Apple's side
      const path = `${DIR}/${prefix}-0${i}-${SCENES[i - 1]}.png`
      const { size } = await stat(path)
      await uploadImage(setId, path, name, size)
    }
  }
  // read-back: both sets should show five screenshots
  for (const { displayType } of SETS) {
    const { body } = await ascFetch(
      'GET',
      `/v1/appScreenshotSets?filter[appStoreVersionLocalization]=${locId}&filter[screenshotDisplayType]=${displayType}&include=appScreenshots&limit=1`,
    )
    const shots = body.included?.filter((r) => r.type === 'appScreenshots') ?? []
    console.log(`${displayType}: ${shots.length} screenshots on the version`)
  }
}

const SCENES = ['language', 'round', 'spinning', 'landed', 'settings']

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
