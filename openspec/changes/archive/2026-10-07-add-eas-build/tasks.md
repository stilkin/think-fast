# Tasks

## 1. Config

- [x] 1.1 Add `eas.json` (single `preview` profile: internal distribution, Android APK) and set `android.package: be.pocito.thinkfast` in `app.json`; verified `eas config --platform android --profile preview` parses cleanly and reports the package id
- [x] 1.2 Initialize the EAS project under the `pocito` account (`eas init`), writing `extra.eas.projectId` into `app.json`; verified via init's created-and-linked output and `eas config` resolving the project (the drafted `project:list` check used a command this CLI version lacks)

## 2. Build & install

- [x] 2.1 Kick the first build (`eas build --platform android --profile preview`, non-interactive) and see it through; verify it finishes with an APK artifact URL — two pnpm-11 build-script failures fixed along the way (`648d59d`, `33b058a`); build `da6fa065` finished 2026-10-07 with APK artifact URL
- [x] 2.2 Install the APK on the user's phone and pass the app-identity checks (launcher icon at small sizes, adaptive mask, cold-start splash + hand-off — Android 12+ system-splash reality per design D4); this verdict also closes add-app-icon-splash task 4.2 — user confirmed 2026-10-07 on APK da6fa065

## 3. Docs

- [x] 3.1 Document the preview build in README (login, build command, APK install); verify the documented command runs as written
