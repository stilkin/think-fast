# Tasks

## 1. Implementation

- [x] 1.1 Add the `supportKoFi` string to `src/i18n/strings.ts` in EN/NL/DE/FR ("Support me on Ko-fi" / "Steun me op Ko-fi" / "Unterstütze mich auf Ko-fi" / "Soutiens-moi sur Ko-fi"); verify `pnpm test` i18n completeness passes
- [x] 1.2 Add the footer link to `src/app/settings.tsx`: coral `☕` + localized label Pressable, quiet styling per design D1, opening `https://ko-fi.com/stilkin` via `Linking.openURL`; verify via the web runtime that the link renders at the bottom with the right label per language and exposes the href/label accessibly

## 2. Checks

- [x] 2.1 Statics green (`pnpm typecheck` / `lint` / `test`); on-device spot check together with the EAS preview build's app-identity pass (settings bottom, tap opens browser) — statics re-verified and device pass confirmed 2026-10-07
