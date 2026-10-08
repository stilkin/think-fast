# Tasks

## 1. Local prep (zero API calls)

- [ ] 1.1 Write `store.config.json` with the EN-US listing per the approved plan (title/subtitle/description/keywords ≤100 chars/URLs/copyright/category/age rating all NONE/review contact servaas.tilkin@gmail.com); verify the EAS Metadata schema accepts it (`eas metadata:push --help` dry validation or schema doc)
- [ ] 1.2 Write `scripts/gen-store-screens.mjs` and generate the ten screenshots (5 scenes × [iPhone 1179×2556, iPad 2064×2752]); verify exact dimensions and no alpha via `file`
- [ ] 1.3 Draft `PRIVACY.md` for the user to publish at think-fast.pocito.fyi/privacy; verify it states only true claims (offline, no collection, no permissions)
- [ ] 1.4 Write `scripts/asc-api.mjs` (ES256 JWT from the user's .p8, paths from `~/Downloads/openapi.oas.json`); verify it loads the spec and renders a valid JWT offline

## 2. App record and binary

- [ ] 2.1 User creates the App Store Connect record in the web UI (Think Fast!, be.pocito.thinkfast, SKU be.pocito.thinkfast, en-US); then verify with exactly one `GET /v1/apps?filter[bundleId]=…` that the key works and the record exists
- [ ] 2.2 Submit the IPA (`eas submit --platform ios --latest --key <p8>`); verify the build appears (one `GET /v1/apps/{id}/builds` or the ASC build list) — this also completes add-production-builds task 3.2

## 3. Listing content

- [ ] 3.1 Push metadata (`eas metadata:push`), reviewing its validation output first; verify with a read-back (`metadata:pull` diff or API GET) that the listing fields landed
- [ ] 3.2 Upload the two screenshot sets via the API flow per design D4 (spec-checked payload; on any mismatch stop and fall back to web drag-drop); verify the sets appear complete for both display types
- [ ] 3.3 Document the store listing flow in README (store.config, screenshots script, the manual-remainder list: pricing, data-collection label, record creation, submit button); tick add-production-builds 4.1 once the iOS commands are proven

## 4. Submission (user-gated)

- [ ] 4.1 User completes the web-only items (Free pricing, availability default, App Privacy "Data Not Collected", attach build 4 to version 0.1.0) and presses Submit for Review after their own pass; privacy page live at think-fast.pocito.fyi/privacy is a precondition
