# Proposal

## Why

The preview APK loop works end to end (build `da6fa065` installed and passed the identity checks), so the game itself is ready for real players. Reaching them means store-signed, store-format binaries — an Android App Bundle for Google Play and an iOS IPA for the App Store — plus release versioning that survives repeated uploads. Both store accounts exist; what's missing is the production build plumbing.

## What Changes

- Add a `production` build profile to `eas.json` (Android `app-bundle`, iOS store build) alongside the existing `preview` profile, with EAS-managed signing credentials for both stores and automatic `versionCode` / `buildNumber` increments.
- Set the iOS app identity (`ios.bundleIdentifier: be.pocito.thinkfast`) to match Android.
- Trim `android.permissions` to the empty set — `eas init` pulled in expo-audio's recording/foreground-service defaults (mic access, foreground service) that a sound-effects-only game never uses.
- Produce and hand over one production binary per store: the AAB for a manual first upload to Play's internal testing track, the IPA for an App Store Connect upload (`eas submit` with an App Store Connect API key — the workable path from this Linux box; Transporter is macOS-only).
- Document the production path in README (build, credential login, per-store first upload).

## Capabilities

### New Capabilities
- `store-distribution`: producing store-ready, signed, versioned release binaries for both stores and the documented path each takes into its store.

### Modified Capabilities
(none)

## Impact

- Files: `eas.json`, `app.json`, `README.md`. No app code changes.
- Verification: `eas config` parses both platforms; sounds still play after the permissions trim (web runtime + device); one real build per platform with a store artifact URL.
- User participation required: Apple ID login during the first iOS build/credential setup, the ASC API key for `eas submit`, and the Play Console upload itself.
- Out of scope (later changes): store listings (screenshots, copy, data-safety and content-rating forms), EAS Submit for Android, phased rollout, CI.
