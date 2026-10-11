# Tasks

## 1. Assets

- [x] 1.1 Author `assets/icon-sources/feature-graphic.svg` (ink background, Titan One wordmark, Fredoka tagline in cream) and extend `scripts/gen-icons.mjs` with the 1024×500 opaque target + Fredoka loading; regenerate and verify the six existing PNGs are byte-identical (git diff) and `feature-graphic.png` is exactly 1024×500 — git shows only the new PNG; `file` confirms 1024×500 RGB; pixel-band profile confirms wordmark y150–280, tagline y340–360, no overlap
- [x] 1.2 Verify `assets/images/play-icon.png` is 512×512 opaque and the five iPhone screenshots exist at 1179×2556 (`file`) — both confirmed, all opaque RGB (no alpha), 2.17:1 aspect within Play's ≤2.3:1 limit

## 2. Config + tooling

- [x] 2.1 Write `play.config.json` — en-GB listing mirroring the iOS copy (title, short description ≤80 chars, full description, contact email + website) and asset paths — short description is the iOS promoText family, 79 chars
- [x] 2.2 Write `scripts/play-api.mjs` (careful client per design D3) and `scripts/play-push-listing.mjs` (transactional push per design D4: clear-then-upload images, text, details with en-GB attempt, single commit, read-back verification, abort+delete on any failure)

## 3. Push + verify

- [x] 3.1 Run the push; verify by reading back: listing text matches config, 5 phone screenshots + icon + feature graphic present, default language en-GB (or documented en-US fallback) — committed 2026-10-10 after fixing three path/enum mistakes against the discovery doc + reference (image types hang off /listings/{lang}/{type} with camelCase enum names, media upload needs the /upload/ host prefix, commit is :commit); read-back: en-GB default, title/short/full match, 5+1+1 images
- [x] 3.2 List the Play-console-only remainder (questionnaires, privacy-policy URL, pricing, category) in README's store section alongside the iOS one — plus the Play listing/tooling section and the updated eas submit upload path

## 4. Wrap-up

- [x] 4.1 `pnpm lint`/`typecheck` clean (scripts only — no app code changed); commit — e35396f, pushed
