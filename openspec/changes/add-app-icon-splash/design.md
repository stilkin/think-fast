# Design

## Context

`app.json` currently points at Expo template assets: `icon.png` (1024), the adaptive trio, `favicon.png`, `splash-icon.png`, and the layered `assets/expo.icon` set for iOS. The splash is configured in the `expo-splash-screen` plugin with `backgroundColor #208AEF` + `imageWidth 76`. `_layout.tsx` holds the splash until fonts and game state are ready (`preventAutoHideAsync` → `hideAsync`), so the splash is on screen for the entire font load — an ink splash makes that wait invisible. Only the six grepped image references exist; every other image in `assets/images/` is dead template weight. The visual identity lives in `src/ui/theme.ts` (ink `#241B4F`, butter `#FFC53D`, …) and the bundled Fredoka TTFs in `assets/fonts/`.

## Goals / Non-Goals

**Goals:**
- One wordmark identity across every OS surface, chosen by the user from real rendered pixels.
- Assets that regenerate deterministically from committed text sources — no binary hand-editing, matching the `gen-sounds.mjs` precedent.
- Seamless cold start: splash background = app background = ink.

**Non-Goals:**
- Animated splash (RN-side reveal choreography) — static image only.
- Light/dark splash variants — the app is permanently dark.
- EAS build profiles, store metadata, screenshots — later store-readiness change.
- iOS alternate-mode icons.

## Decisions

### D1 — Mockup-first variant selection
Render four icon variants as actual PNGs before wiring anything: (a) plain `TF`, (b) `TF` + coral `!`, (c) `TF` + small lightning corner badge, (d) stock emoji ferris wheel as the control sample (ended up Twemoji, CC-BY 4.0 — Noto's repo no longer ships per-emoji SVGs). The user picks one from a contact sheet; everything downstream is variant-agnostic.
*Why:* the user asked to choose from options, and ASCII sketches under-sell typography. Alternative — pick now and wire it — rejected: the whole point is a pixel-informed choice.

**Selected (2026-10-06, from the two mockup sheets in `assets/icon-sources/mockup-sheet.png`):** composition **B** — butter `TF` + coral `!` — enlarged (wordmark spans ~65% of the tile), set in **Titan One** (OFL), chosen over runner-ups Luckiest Guy and Lilita One in a six-way font bake-off. The splash wordmark uses the same font and carries the same coral `!`. The wordmark font is icon/splash-only: the in-app UI stays Fredoka (switching the app font would be its own change). The winning TTF gets committed under `assets/fonts/` with its OFL license text in the generator task.

### D2 — Sources are SVG + the gen script supplies the font
Icon sources live in `assets/icon-sources/*.svg` (one per family member: iOS/adaptive-foreground glyph, monochrome, splash wordmark, favicon) using `<text>` with `font-family: Fredoka` and hardcoded palette hexes (cross-referenced to `theme.ts` in a comment — TS tokens can't be imported into SVG; a comment beats a build step).
*Why:* keeps sources diffable text; Fredoka stays the single font family. Alternative — converting text to static paths — rejected: harder to maintain than a `<text>` element, and Chromium renders the real TTF anyway.

### D3 — Rasterize via the system Chromium driven over CDP
*(Corrected during task 1.1 — the original plan of `chromium --headless --screenshot` CLI flags does not work on this box: the snap-confined Chromium cannot read `file://` pages, and the sandbox denies it writing PNG files.)*
`scripts/gen-icons.mjs` embeds a tiny Node HTTP server that serves two things: the SVG source wrapped in a minimal HTML shell whose `@font-face` rules point at the committed TTFs (font filenames resolved from `assets/fonts/` at runtime — the underscore-heavy names must never be hardcoded), and the font files themselves. It then drives the system `/usr/bin/chromium-browser` via `playwright-core` (CDP) and takes `page.screenshot()`s at exact viewport sizes — the Node process writes the PNGs, which the sandbox permits. `playwright-core` becomes a devDependency (it downloads no browser; it drives the system Chromium). Opaque surfaces (iOS icon, Play 512) render on solid ink; transparent surfaces (adaptive foreground, monochrome, favicon, splash wordmark) use Playwright's `omitBackground`.
*Why:* this is the exact mechanism already proven by the web-verification suite and by the mockup render; it keeps "one rasterizer we already trust". Alternatives — `sharp`/`resvg-js` (new native deps) or hand-exported PNGs (unregenerable) — both worse under the project's "simple, clean, maintainable".

### D4 — Output set and sizes
| Output | Size | Notes |
|---|---|---|
| `assets/images/icon.png` | 1024×1024 | opaque ink background — iOS rejects alpha; also the `expo.icon` replacement |
| `assets/images/android-icon-foreground.png` | 1024×1024 | glyph inside the center ~66% safe zone, transparent |
| `assets/images/android-icon-monochrome.png` | 1024×1024 | single-color glyph, transparent (themed icons) |
| `assets/images/play-icon.png` | 512×512 | Play Store listing, generated but not wired |
| `assets/images/favicon.png` | 48×48 | web export |
| `assets/images/splash-icon.png` | ~1024×512 | wordmark only, transparent |
Adaptive background becomes `backgroundColor: #241B4F` in `app.json` (drops the `backgroundImage` file — a solid color is one less asset).

### D5 — app.json wiring and template cleanup
- `icon` → generated 1024 PNG; `ios.icon` → same PNG (retiring the template `assets/expo.icon` set).
- `android.adaptiveIcon`: foreground + monochrome images, `backgroundColor` ink, no background image.
- `expo-splash-screen` plugin: `backgroundColor #241B4F`, `image` → splash wordmark, `imageWidth ≈ 220`.
- Delete dead template images (`react-logo*`, `expo-badge*`, `expo-logo`, `logo-glow`, `tutorial-web`, `tabIcons/`) — grep-verified unreferenced. The splash-hide flow in `_layout.tsx` is untouched.

### D6 — Verification on this box
Static checks (dimensions via `file`, regeneration stability via double-run hashing), `expo doctor` + web export for config validity, vision pass on the mockup sheet, and the final look on device by the user (launcher sizes, adaptive mask, cold-start seam).

## Risks / Trade-offs

- [Headless screenshot determinism (font hinting, GPU flags)] → outputs are committed anyway; the script is a regeneration path, and a double-run hash check in task verification tells us how stable it really is. If unstable, document "regenerate may differ cosmetically" rather than adding deps.
- [Headless `file://` font loading may need flags] → add `--allow-file-access-from-files` / embed the TTF as a base64 data URI in the HTML shell (script-side, sources stay clean).
- [Adaptive safe-zone sizing is a judgment call] → mockup sheet includes the variants inside a circle-mask preview; user confirms on their launcher.
- [Chromium is a Linux-box dependency for regeneration] → README documents the requirement; the committed PNGs are the shipped source of truth.

## Migration Plan

Assets + `app.json` only, no runtime code. Rollback = revert the commit.
