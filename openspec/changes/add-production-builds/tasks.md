# Tasks

## 1. Release config

- [x] 1.1 Extend `eas.json` with the `production` profile per design D1/D2 (Android app-bundle via default release buildType, `autoIncrement`, `cli.appVersionSource: "remote"`); verify `eas config --platform android --profile production` and the iOS equivalent parse cleanly and show the store artifact types — both parse; iOS reports `distribution: "store"`, Android `autoIncrement: true`
- [x] 1.2 Set `ios.bundleIdentifier: "be.pocito.thinkfast"` in `app.json` and replace the expo-audio `android.permissions` defaults with an empty array; verify `eas config` still resolves both platforms and `pnpm typecheck`/`lint`/`test` stay green — 39 tests, typecheck and lint clean

## 2. Android store release

- [x] 2.1 Run the Android production build (`pnpm dlx eas-cli build --platform android --profile production --non-interactive --no-wait`) and see it through; verify the artifact is an `.aab` with a URL — first attempt (ce0e443c) wedged IN_QUEUE across the account transfer and is un-cancelable via API (ignorable); requeued build 9e2cfcb3 FINISHED 2026-10-10 with an .aab artifact URL
- [ ] 2.2 Verify the AAB's manifest requests no permissions (e.g. `aapt2 dump permissions` or bundletool inspect via the Android SDK, or the Play Console's uploaded-artifact warning as fallback) — build 9e2cfcb3: FAILED, 11 permissions, library-merged (expo-audio et al.); `android.permissions: []` only clears template defaults. Build 423478e4 (plugin v1): still FAILED, 10 — emptying the app manifest's list doesn't survive gradle library-manifest merging. Plugin v2 uses `tools:node="remove"` markers; re-verify on the next build
- [ ] 2.4 Strip library-merged permissions: `plugins/strip-android-permissions.js` config plugin empties the merged `<uses-permission>` list (keeping the app's own DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION), wired into app.json; rebuild production AAB and re-run the bundletool check — expects the manifest to show only the receiver permission — v1 (empty the list) insufficient, see 2.2; v2 (remove-markers) queued as a new build
- [ ] 2.3 User uploads the AAB to the Play Console internal testing track and installs it on a device; sounds and the core loop verified on the store build (design D4 rollback gate) — superseded by user request 2026-10-11: release uploaded via API to **open testing** (track `beta`) as a DRAFT (Play requires a Console click to start a new app's first release; `android.releaseStatus: "draft"` in eas.json), build vc4 pending the user's roll-out + device pass; final permission check will repeat on the v2-plugin build

## 3. iOS store release

- [x] 3.1 First iOS production build with the user present for Apple credential setup (Apple ID login; EAS generates the distribution cert + profile per design D3); verify the artifact is an `.ipa` with a URL — build `fb656eb9` finished 2026-10-08 with an `.ipa` artifact URL (buildNumber 4; 1–3 burned on the pre-credential attempts). Done in the user's terminal after the project's transfer to the pocito-be account
- [x] 3.2 Create an App Store Connect API key together with the user, run `eas submit --platform ios --latest`, and verify the build appears in App Store Connect (design D5; this is the only upload path from Linux) — key reused from the user's soup-quiz setup; build `fb656eb9` submitted 2026-10-08 to app 6820671311, processing confirmed

## 4. Docs

- [x] 4.1 Document production builds in README (profile, credential login, version inspection, per-store first upload per design D5, listings explicitly deferred); verify the documented commands run as written — build, submit, and metadata commands all ran verbatim during the iOS release; listing flow documented in add-ios-store-listing 3.3
