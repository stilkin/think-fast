# Tasks

## 1. Sources & variant selection

- [x] 1.1 Author the SVG sources in `assets/icon-sources/` (design D2): four icon variants (plain `TF`, `TF` + coral `!`, `TF` + lightning badge, stock Noto ferris wheel as control) plus the splash wordmark source; verify each renders through Chromium with Fredoka resolving and the exact palette hexes
- [x] 1.2 Render the mockup contact sheet — variants at 512 / 192 / 48 px, a circular adaptive-mask preview, and the splash composition; verify via vision check, present to the user, and record the chosen variant before wiring anything

## 2. Generator

- [x] 2.1 Write `scripts/gen-icons.mjs` (design D3): HTML shell + `@font-face` on the committed TTFs, headless Chromium screenshots at the exact output sizes from D4, transparent vs ink-opaque per surface; verify `file` reports the exact dimensions/alpha for every output and a double run produces identical files (hash check)
- [x] 2.2 Generate the final asset set with the chosen variant into `assets/images/`; verify dimensions via `file` and spot-check the palette (ink background, butter/coral accents) on the rendered PNGs

## 3. Wiring & cleanup

- [x] 3.1 Wire `app.json` per design D5 (icon + iOS icon → 1024 PNG, adaptive foreground/monochrome + ink `backgroundColor`, splash plugin ink background + wordmark image + `imageWidth`, favicon) and delete the dead template images plus `assets/expo.icon`; verify grep finds no remaining template-asset references and `expo doctor` passes
- [x] 3.2 Document regeneration in README (system Chromium requirement, `node scripts/gen-icons.mjs`); verify the documented command runs as written

## 4. Integration checks

- [x] 4.1 Statics green (`pnpm typecheck` / `lint` / `test`) and the web export builds serving the new favicon; verify no console errors on the exported app
- [ ] 4.2 On-device pass: launcher icon legible at small sizes, adaptive mask keeps the monogram intact, cold start shows the wordmark on ink with no seam into the game screen (user verdict)
