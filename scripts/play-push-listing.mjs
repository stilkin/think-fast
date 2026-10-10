#!/usr/bin/env node
/**
 * Push the Play listing from play.config.json (store-distribution spec).
 *
 * One transactional edit (design D4): clear-then-upload images, listing text,
 * details (default language + contact), single commit, then verify by reading
 * the committed state back through a fresh throwaway edit. Any failure deletes
 * the draft edit and exits non-zero — nothing partial ever reaches the store.
 *
 *   node scripts/play-push-listing.mjs
 */
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { playFetch } from './play-api.mjs'

const ROOT = join(import.meta.dirname, '..')
const config = JSON.parse(readFileSync(join(ROOT, 'play.config.json'), 'utf8'))
const PKG = config.packageName

// --- validate before touching the network (Play's own limits) ---
const listing = config.listings[config.defaultLanguage]
if (!listing) throw new Error(`no listing for ${config.defaultLanguage} in play.config.json`)
if (listing.title.length > 30) throw new Error(`title ${listing.title.length} chars > 30`)
if (listing.shortDescription.length > 80)
  throw new Error(`shortDescription ${listing.shortDescription.length} chars > 80`)
if (listing.fullDescription.length > 4000)
  throw new Error(`fullDescription ${listing.fullDescription.length} chars > 4000`)

const images = [
  ...config.images.phoneScreenshots.map((p) => ({ type: 'phoneScreenshots', path: p })),
  { type: 'icon', path: config.images.icon },
  { type: 'featureGraphic', path: config.images.featureGraphic },
]

const png = (p) => ({ bytes: readFileSync(join(ROOT, p)), contentType: 'image/png' })

/**
 * Stage everything into one draft edit, commit it. Language strategy (design D2):
 * the details PUT first attempts the en-GB default switch; if Play rejects it,
 * the same draft is corrected without the switch and the listing goes to the
 * existing default language. Mid-edit corrections are safe — nothing is live
 * until the single commit. Any other failure deletes the edit and throws.
 */
async function pushListing() {
  const { body: edit } = await playFetch('POST', `/applications/${PKG}/edits`)
  const editId = edit.id
  try {
    const { body: current } = await playFetch('GET', `/applications/${PKG}/edits/${editId}/details`)
    const base = {
      ...current,
      contactEmail: config.contact.email,
      contactWebsite: config.contact.website,
    }
    let lang = config.defaultLanguage
    if (current.defaultLanguage !== lang) {
      try {
        await playFetch('PUT', `/applications/${PKG}/edits/${editId}/details`, {
          body: { ...base, defaultLanguage: lang },
        })
        console.log(`default language: ${current.defaultLanguage} -> ${lang}`)
      } catch (switchErr) {
        console.error(
          `(default-language switch rejected: ${switchErr.message.split(' — ')[0]}; using ${current.defaultLanguage})`,
        )
        await playFetch('PUT', `/applications/${PKG}/edits/${editId}/details`, { body: base })
        lang = current.defaultLanguage
      }
    } else {
      await playFetch('PUT', `/applications/${PKG}/edits/${editId}/details`, { body: base })
    }
    await playFetch('PUT', `/applications/${PKG}/edits/${editId}/listings/${lang}`, {
      body: {
        language: lang,
        title: listing.title,
        fullDescription: listing.fullDescription,
        shortDescription: listing.shortDescription,
      },
    })
    // image endpoints hang off the listing language directly — no /images/
    // segment (reference: edits.images.upload / .deleteall / .list)
    const imagesPath = (type) => `/applications/${PKG}/edits/${editId}/listings/${lang}/${type}`
    for (const { type } of images) {
      // re-pushes must not accumulate: clear the type first. This API reports
      // "nothing there" as 400/404 — tolerate exactly those, rethrow the rest.
      try {
        await playFetch('DELETE', imagesPath(type))
      } catch (err) {
        if (!/^\s*(400|404) /.test(err.message)) throw err
        console.error(`  (${type}: none to clear)`)
      }
    }
    for (const { type, path } of images) {
      const uploadPath = `/upload/androidpublisher/v3${imagesPath(type)}`
      const { body: uploaded } = await playFetch('POST', uploadPath, { raw: png(path) })
      console.log(`  ${type}: uploaded ${basename(path)} (id ${uploaded.image?.id ?? '?'})`)
    }
    await playFetch('POST', `/applications/${PKG}/edits/${editId}:commit`)
    return lang
  } catch (err) {
    await playFetch('DELETE', `/applications/${PKG}/edits/${editId}`).catch(() => {})
    throw err
  }
}

async function verify(lang) {
  const { body: edit } = await playFetch('POST', `/applications/${PKG}/edits`)
  const editId = edit.id
  try {
    const { body: details } = await playFetch('GET', `/applications/${PKG}/edits/${editId}/details`)
    const { body: remote } = await playFetch(
      'GET',
      `/applications/${PKG}/edits/${editId}/listings/${lang}`,
    )
    console.log(`default language: ${details.defaultLanguage}`)
    console.log(`contact: ${details.contactEmail} / ${details.contactWebsite ?? '(none)'}`)
    console.log(
      `listing: title "${remote.title}" | short ${remote.shortDescription?.length ?? 0} chars | full ${remote.fullDescription?.length ?? 0} chars`,
    )
    const textsMatch =
      remote.title === listing.title &&
      remote.shortDescription === listing.shortDescription &&
      remote.fullDescription === listing.fullDescription
    for (const type of [...new Set(images.map((i) => i.type))]) {
      const { body: list } = await playFetch(
        'GET',
        `/applications/${PKG}/edits/${editId}/listings/${lang}/${type}`,
      )
      console.log(`  ${type}: ${(list.images ?? []).length} image(s)`)
    }
    if (!textsMatch)
      throw new Error('read-back mismatch: listing text differs from play.config.json')
    if (details.defaultLanguage !== lang)
      throw new Error(
        `read-back mismatch: default language is ${details.defaultLanguage}, expected ${lang}`,
      )
    console.log('verify: listing matches play.config.json')
  } finally {
    await playFetch('DELETE', `/applications/${PKG}/edits/${editId}`).catch(() => {})
  }
}

const pushedLang = await pushListing()
await verify(pushedLang)
