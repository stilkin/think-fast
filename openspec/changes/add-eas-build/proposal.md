# Proposal

## Why

The new icon and splash (add-app-icon-splash, task 4.2) can only truly be judged on a device — launcher masking, themed icons, and the cold-start hand-off don't exist in a browser. That needs a real Android build, which in turn is the first slice of the build pipeline store distribution will need anyway.

## What Changes

- Add `eas.json` with a single `preview` build profile: internal distribution, Android APK — installable directly on a phone, no store.
- Set `android.package` to `be.pocito.thinkfast` in `app.json` (the permanent Play Store identity, chosen by the user) and initialize the EAS project under the `pocito` account (writes `extra.eas.projectId`).
- Run the first EAS cloud build (Android, preview profile) and deliver the APK for the on-device icon/splash check — the verdict closes add-app-icon-splash 4.2.
- Document the build command in README.

## Capabilities

### New Capabilities

(none — build tooling only; `.openspec.yaml` declares `skip_specs: true`)

### Modified Capabilities

(none)

## Impact

- `app.json`: + `android.package`, + `extra.eas.projectId`; `eas.json`: new; README: build section. No app code, no runtime behavior change.
- EAS cloud build on the free tier; local machine needs only the CLI (`pnpm dlx eas-cli`, already logged in as pocito).
- Deliberately out of scope: production/store profiles, Play Console upload, version automation, iOS (needs Apple Developer setup — later store-readiness change).
