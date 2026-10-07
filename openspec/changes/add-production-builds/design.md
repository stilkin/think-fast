# Design

## Context

`eas.json` has one `preview` profile (internal APK). `app.json` carries `android.package: be.pocito.thinkfast`, no iOS id, and an `android.permissions` array of expo-audio defaults (`RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, foreground-service entries) inserted by `eas init`. The builder runs pnpm 11 (lesson of three failed builds: config must be version-proof). The dev box is Linux — no Mac, no emulators; device passes are the user's. Both store accounts belong to the user (pocito for EAS/Expo; Play + Apple Developer their own).

## Goals / Non-Goals

**Goals:**
- One `production` profile that yields store artifacts for both platforms from the same config.
- Signing and build-number bookkeeping handled by EAS so the loop from commit to store upload is two commands.
- An Android permission set that matches what the game actually does.
- A documented first-upload path per store that works from this Linux box.

**Non-Goals:**
- Store listings: screenshots, copy, data-safety and content-rating forms (separate change; needs device screenshots and copy review).
- `eas submit` for Android (manual Console upload chosen; service account later if uploads get frequent).
- Phased rollouts, release channels, CI, or OTA updates (`expo-updates`).
- Changing any app code or behavior.

## Decisions

### D1 — One `production` profile for both platforms
`{ "production": { "autoIncrement": true } }` with Android's default `release` buildType producing an AAB and iOS's default producing an IPA. The preview profile stays untouched. Alternative — per-store profiles (`production-android`, `production-ios`) — adds naming for no behavior difference.

### D2 — `cli.appVersionSource: "remote"` + `autoIncrement`
EAS owns `versionCode`/`buildNumber` server-side and bumps them per build; `app.json` keeps only the human version (`0.1.0`). Avoids the classic rejected-upload-on-duplicate-build-number failure and keeps `app.json` out of release bookkeeping. Trade-off: versions live in two places (EAS server + app.json), accepted because the alternative is hand-editing ints per upload.

### D3 — EAS-managed credentials for both stores
Let EAS generate and store the Android upload keystore and the Apple distribution cert + profile on first use (interactive Apple ID login — user present for the iOS first build). Recoverable/exportable from any logged-in machine; nothing secret ever enters the repo. Alternative — locally managed keystores — buys independence at the cost of backup discipline we don't need at this scale.

### D4 — `android.permissions: []`
The game plays four bundled WAVs in the foreground; it never records, never plays in background. `expo-audio`'s permission defaults cover recording and background playback we don't do, and mic permission is a red flag on a Play data-safety form. Empty array = request nothing. Risk: if some device path turns out to need `MODIFY_AUDIO_SETTINGS` (audio ducking), sounds would degrade — covered by an explicit device check; rollback is restoring the array.

### D5 — Upload paths: Play manual, iOS `eas submit`
Play: user downloads the AAB and uploads to the internal testing track in Play Console (they must create the listing there anyway). iOS from Linux: Transporter is macOS-only, so the documented path is `eas submit --platform ios --latest` with an App Store Connect API key created together with the user. Both paths land in README; neither blocks the other.

## Risks / Trade-offs

- [Permissions trim breaks playback on some OEM] → device check in tasks before the Play upload; trivial rollback (D4).
- [Apple first-build friction] → interactive credential setup needs the user's Apple ID at that moment; scheduled as its own task with the user present, not batched into config work.
- [Remote version source surprises later] → `eas build:version`-style inspection documented in README so the current numbers are always one command away.
- [`ios.bundleIdentifier` collides with an existing App Store Connect id] → `be.pocito.thinkfast` is namespaced under the user's own domain pattern; collision would surface at the first ASC upload with a clear error and a rename decision then.

## Migration Plan

Additive config (`eas.json`, `app.json` ios block, permissions array replacement). No data or code migration; rollback per file.
