# Proposal

## Why

The developer takes Ko-fi tips (`ko-fi.com/stilkin`, already declared in the repo's `FUNDING.yml`). Players who enjoy the game have no way to discover that from inside the app — a small, honest support link where people already look for the "about-ish" stuff: the bottom of settings.

## What Changes

- Add a small text link at the bottom of the settings screen: coral `☕` + localized label ("Support me on Ko-fi" / "Steun me op Ko-fi" / "Unterstütze mich auf Ko-fi" / "Soutiens-moi sur Ko-fi"), cream at reduced opacity, centered — unobtrusive by placement.
- Tapping opens `https://ko-fi.com/stilkin` in the device browser via `Linking.openURL` (expo-linking, already a dependency). Offline, the OS handles the no-connection case; the app stays fully offline-first.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities
- `game-settings`: one added requirement — the settings screen offers the external support link (localized, bottom placement, opens the browser)

## Impact

- `src/i18n/strings.ts` (+1 key × 4 languages, covered by the existing completeness test), `src/app/settings.tsx` (one footer row). No new dependencies, no data or game-flow changes.
- Store-policy note: external "support the developer" links are standard on both stores; no in-app purchase involved.
