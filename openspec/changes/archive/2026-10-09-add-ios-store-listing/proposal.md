# Proposal

## Why

The iOS production IPA exists (build `fb656eb9`) and Apple is the first store target. To submit for review, the App Store Connect app record needs its listing filled: copy, category, age rating, screenshots, URLs, and review contact — all currently absent. The user holds an ASC API key plus Apple's own OpenAPI spec (v4.5.1) and wants the work done API-first, carefully: every endpoint grounded in the spec, reads before writes, no experiments on Apple's servers.

## What Changes

- New `store.config.json` (EAS Metadata, EN-US only) carrying the full listing copy: title, subtitle, description, keywords, promo text, release notes, copyright, category, support/privacy URLs, age-rating answers (all NONE → 4+), and review contact.
- New `scripts/gen-store-screens.mjs` rendering five real app scenes at Apple's exact required sizes (Dynamic Island medium 1179×2556, iPad 13" 2064×2752) from the web export — reusing the icon-rig pattern, no app changes, no new dependencies.
- New `scripts/asc-api.mjs`: zero-dependency ASC API helper (node:crypto ES256 JWT) whose paths are grounded in the user's OpenAPI spec file; read-only by default.
- `PRIVACY.md` draft for the user to publish at think-fast.pocito.fyi/privacy (the one external dependency; blocks only the final submission, not the prep).
- Execution flow: user creates the app record in the ASC web UI (not API-able in 4.5.1) → `eas submit` the IPA → `eas metadata:push` → screenshot upload via API (web drag-drop fallback) → user does the web-only bits (Free pricing, "Data Not Collected" privacy label, attach build) → user presses Submit for Review.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `store-distribution`: one added requirement — the iOS listing is complete, reproducible from the repo, and pushed through documented store interfaces.

## Impact

- Files: two new scripts, `store.config.json`, `PRIVACY.md`, the change's own artifacts. No app code, no `app.json`/`eas.json` changes.
- Apple-side surface: ~15–25 documented API calls total plus `eas submit` and `eas metadata:push`; every write preceded by a read; spec-checked payloads.
- Completes add-production-builds task 3.2 (binary submit) on the way.
- Out of scope: Play Store listing (parked), NL/DE/FR listing localizations (later, metadata-only), the privacy page's hosting itself (user), pressing Submit for Review (user).
