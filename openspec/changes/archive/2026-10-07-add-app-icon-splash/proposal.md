# Proposal

## Why

The app still ships the Expo template identity everywhere the OS shows it: default icon in the launcher, pale-blue adaptive-icon background, blue splash with the Expo mark. Before store submission the app needs its own launch identity — and it should be one the user has actually chosen, not auto-generated.

## What Changes

- Add a wordmark identity for the app's OS-level appearance: an `TF` monogram launcher icon (Fredoka, butter on the ink night sky) and a splash screen carrying the full "Think Fast!" wordmark on the same ink background, so cold start hands off seamlessly into the app.
- The accent treatment of the monogram (plain / coral `!` / small lightning badge, plus a stock-emoji wheel as control sample) is decided by the user from rendered PNG mockups — the change renders the variants first, the user picks, then the winner is wired in.
- Introduce committed vector sources and a deterministic generator script (`scripts/gen-icons.mjs`, following the `gen-sounds.mjs` precedent): SVG sources + local Fredoka TTFs rasterized via headless Chromium to every required PNG size (iOS 1024, Android adaptive foreground + monochrome, Play Store 512, web favicon, splash image).
- Wire `app.json` to the generated assets: `icon`, iOS icon, `android.adaptiveIcon` (ink background color + foreground + monochrome for themed icons), `expo-splash-screen` plugin (ink background + wordmark image), favicon.
- Remove the now-unreferenced Expo template images (verified unreferenced by grep).

## Capabilities

### New Capabilities
- `app-identity`: the app's branded appearance at OS level — the launcher icon family (iOS, Android adaptive incl. monochrome, favicon, store listing asset) and the launch/splash screen, all derived from committed, regenerable vector sources in the app's visual identity.

### Modified Capabilities

(none — no existing capability covers OS-level identity; `ui-localization` and the game specs are untouched.)

## Impact

- `app.json`: icon paths, adaptive icon config, splash plugin config — the only app-code-adjacent change; no runtime code changes (`_layout.tsx`'s existing splash-hide-on-fonts-ready flow stays as is).
- `assets/`: new `assets/icon-sources/` (SVG sources); `assets/images/` gains generated PNGs and loses the dead template images; `assets/expo.icon` (template iOS icon set) is replaced by the generated PNG.
- `scripts/gen-icons.mjs`: new, pure Node + system Chromium; no new dependencies.
- Store-readiness note: the Play Store 512×512 listing asset comes out of the same pipeline; EAS build profiles remain a later change.
