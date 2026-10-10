# Design

## Context

Play app record exists (default language en-US, bare). Service-account key validated. Publishing API `edits` are drafts until committed — unlike ASC, we can stage freely and abort cheaply. EAS Metadata has no Android support, so the push tooling is ours.

## Goals & Non-Goals

- Goals: full API-able listing pushed from repo, reusing iOS assets/copy; en-GB default if the API allows; verify everything by reading back.
- Non-Goals: track releases/AAB upload (add-production-builds tasks 2.2/2.3), questionnaires (no API), staged rollouts (later).

## Decisions

### D1 — Config file: separate `play.config.json`

`eas metadata:*` validates `store.config.json` against its Apple schema; an `android` sibling key risks breaking the iOS flow. A separate file keeps each store's tooling honest. Shape mirrors the iOS info block: language-keyed copy, top-level contact fields, asset paths.

### D2 — Language: en-GB, fallback en-US

`details.update` carries `defaultLanguage`; Play accepts `en-GB` listing locales. The push tries en-GB inside the edit; if rejected, it deletes the edit, logs, and re-pushes unchanged copy under the existing en-US default. Copy is the iOS en-GB text verbatim. Short description (≤80 chars) is `promoText` trimmed.

### D3 — Client: `scripts/play-api.mjs`

Mirror of `asc-api.mjs`: RS256 JWT (node:crypto, service-account flow against oauth2.googleapis.com), token cached for its lifetime, exported `playFetch(method, path, {body, raw})`, throws on ≥400, never retries. Credentials from `PLAY_KEY_PATH` env or the standard config path.

### D4 — Push: one edit, one commit, verify

`play-push-listing.mjs` reads `play.config.json`; creates an edit; updates details (defaultLanguage, contact email/website); uploads listing text (`listings.update`) and images (`images upload` — PHONE_SCREENSHOTS ×5, ICON, FEATURE_GRAPHIC, image type per Play's enum); commits; re-reads listing + image counts and prints them. Any step ≥400 deletes the edit and exits non-zero. Images are idempotent-ish: Play's images API appends; the script deletes existing images of each type in the edit before uploading so re-pushes don't accumulate.

### D5 — Feature graphic via the icon rig

New `assets/icon-sources/feature-graphic.svg` (ink background, "Think Fast!" wordmark in Titan One, tagline in cream) rasterized by `gen-icons.mjs` at 1024×500 opaque. The rig gains Fredoka loading for the tagline (theme's text face). Existing outputs must stay byte-identical (git diff clean).

### D6 — Screenshots: reuse the iPhone set

1179×2556 (2.17:1) is within Play's limits (≥320 px, ≤3840 px, ≤2.3:1); five images ≥ Play's minimum of 2. The iPad set stays unused for now (optional on Play).

## Risks / Trade-offs

- Play's schema evolves; the client hard-fails on surprises rather than guessing — acceptable by policy.
- `defaultLanguage` change is the one uncertain API call; the en-US fallback bounds the risk.

## Migration Plan

None — the listing is currently empty; the edit populates it.

## Open Questions

None — Families opt-out and 13+ target decided 2026-10-09 (web-side questionnaire, not this change).
