# Design

## Context

IPA `fb656eb9` (buildNumber 4) is store-signed and waiting. The user holds an ASC API key and Apple's OpenAPI spec (`~/Downloads/openapi.oas.json`, ASC API 4.5.1) and set a hard behavioral constraint: careful, spec-grounded API usage — reads before writes, no retries on unexpected responses, docs checked before alternatives. The dev box is Linux; the web-export + headless-Chromium rig (gen-icons pattern: Node http server + playwright-core + system Chromium) is proven. Support site exists (think-fast.pocito.fyi); the privacy page does not yet.

## Goals / Non-Goals

**Goals:**
- A complete, review-ready iOS listing with every reproducible piece in the repo.
- Minimal, documented API surface on Apple's side (< 25 calls total, each spec-checked).
- Screenshots at Apple's exact required sizes rendered from the real app.

**Non-Goals:**
- Play Store listing (parked until Apple ships).
- NL/DE/FR listing localizations (metadata-only change later; no new binary needed).
- Hosting the privacy page (user's side).
- Automated "Submit for Review" (the user presses it).

## Decisions

### D1 — App record via web UI, everything else via API
The spec file confirms 4.5.1 has no `POST /v1/apps`; the record is created once by the user in the browser (~30 s). Everything after — binary (`eas submit`), text metadata (`eas metadata:push`), screenshots (API) — rides the key. This honors "API-first where it exists" without fighting Apple's spec.

### D2 — `store.config.json` (EAS Metadata) as the copy's home, EN-US only
EAS Metadata is the one tool that covers title/subtitle/description/keywords/URLs **and** the age-rating questionnaire plus review contact in a validated push. User chose English-only v1; localizations are additive later without a new binary. The keyword string is length-checked (≤100 chars) before any push.

### D3 — Screenshots from the web export, not the device
Playwright viewports: 393×852 @ deviceScaleFactor 3 → exact 1179×2556 (Dynamic Island medium, the required minimum set); 1032×1376 @2x → exact 2064×2752 (iPad 13", required because the Expo build is universal). The app renders identically on web (this is the standing verification rig), the ink background is opaque (no alpha), and every scene is deterministic (language screen, fresh round, mid-spin, landed + timer, settings). Rejected: TestFlight-then-device-capture (adds a waiting loop for no quality gain on a native-RN-web-identical UI).

### D4 — Upload screenshots via API, web drag-drop as the fallback
The reserve→upload→commit flow (`/v1/appScreenshotSets`, `/v1/appScreenshots`) is in the spec; `asc-api.mjs` walks it (~12 calls). Any schema mismatch → stop, report, fall back to the web UI. Screenshots are the only piece where the API is genuinely fiddly, hence the pre-declared fallback instead of improvisation.

### D5 — `asc-api.mjs`: zero-dependency, read-only by default
node:crypto signs the ES256 JWT from the user's `.p8`; the script loads path templates from the OpenAPI file so URLs are never hand-typed. GETs are safe to run; every write is an explicit subcommand. No retry logic anywhere — an unexpected status prints the response and exits.

### D6 — Privacy content drafted in-repo, published by the user
`PRIVACY.md` states the truth: fully offline, no accounts, no analytics, no tracking, no third parties, no permissions. The user publishes it at think-fast.pocito.fyi/privacy; only Step 6 (submission) depends on it being live.

## Risks / Trade-offs

- [App name "Think Fast!" conflicts at record creation] → Apple reports it immediately in the web UI; the user picks a fallback then (suffixes drafted in the plan); no API retries involved.
- [Web-render screenshots questioned in review] → they depict the real app UI pixel-for-pixel; device captures can replace them anytime without resubmission.
- [EAS Metadata beta schema drift] → `metadata:push` validates before writing; on validation failure the config is fixed, not the tool.
- [Key role insufficient for some write] → surfaces as 403 on the first such call; reported to the user rather than worked around.

## Migration Plan

All additive: two scripts, one config, one markdown draft. Rollback is file deletion; nothing irreversible happens on Apple's side short of the submission itself.
