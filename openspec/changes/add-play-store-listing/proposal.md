# Proposal

## Why

The Play app record exists and the service account works, but its listing is empty while the iOS release sits in review. Everything the Publishing API can carry — text, screenshots, icon, feature graphic — should be filled from the repo now, so the Play release waits only on the (web-only) questionnaires and the closed-testing gate. The iOS round (archive/2026-10-09-add-ios-store-listing) established the pattern: listing lives in the repository, pushed through documented interfaces, manual remainder enumerated.

## What Changes

- **`play.config.json`** — the Play listing in the repo (title, short + full description, contact details, asset paths, language), mirroring the iOS copy. Kept separate from `store.config.json` because EAS Metadata validates that file's schema and does not support Android ([eas-cli#4173](https://github.com/expo/eas-cli/issues/4173), closed unimplemented).
- **`scripts/play-api.mjs`** — careful Publishing API client (RS256 service-account JWT, no retries, throws on ≥400), the twin of `scripts/asc-api.mjs`.
- **`scripts/play-push-listing.mjs`** — one transactional edit: default language en-GB (fallback en-US), listing text, screenshots (reusing the five App Store iPhone PNGs — 1179×2556 is within Play limits), 512 icon (`play-icon.png`), feature graphic; committed once, then verified by re-reading.
- **Feature graphic** — new `assets/icon-sources/feature-graphic.svg` (wordmark + tagline, ink background) rasterized by `gen-icons.mjs` at 1024×500; the script also learns to load Fredoka for the tagline.
- README: Play listing section + the enumerated manual remainder.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `store-distribution`: new requirement — the Play listing lives in the repository and reaches the store only through the Publishing API's transactional edits, with the web-only remainder enumerated in-repo.

## Impact

- New files: `play.config.json`, `scripts/play-api.mjs`, `scripts/play-push-listing.mjs`, `assets/icon-sources/feature-graphic.svg`, `assets/images/feature-graphic.png`.
- `scripts/gen-icons.mjs` gains one target row + Fredoka loading; existing outputs unchanged (byte-identical, git-verified).
- Reads the service-account key from `~/.config/think-fast/play/service-account.json`.
- No app code, no dependencies, no store state beyond the listing edit itself.
