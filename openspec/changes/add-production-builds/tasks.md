# Tasks

## 1. Release config

- [x] 1.1 Extend `eas.json` with the `production` profile per design D1/D2 (Android app-bundle via default release buildType, `autoIncrement`, `cli.appVersionSource: "remote"`); verify `eas config --platform android --profile production` and the iOS equivalent parse cleanly and show the store artifact types — both parse; iOS reports `distribution: "store"`, Android `autoIncrement: true`
- [x] 1.2 Set `ios.bundleIdentifier: "be.pocito.thinkfast"` in `app.json` and replace the expo-audio `android.permissions` defaults with an empty array; verify `eas config` still resolves both platforms and `pnpm typecheck`/`lint`/`test` stay green — 39 tests, typecheck and lint clean

## 2. Android store release

- [ ] 2.1 Run the Android production build (`pnpm dlx eas-cli build --platform android --profile production --non-interactive --no-wait`) and see it through; verify the artifact is an `.aab` with a URL
- [ ] 2.2 Verify the AAB's manifest requests no permissions (e.g. `aapt2 dump permissions` or bundletool inspect via the Android SDK, or the Play Console's uploaded-artifact warning as fallback)
- [ ] 2.3 User uploads the AAB to the Play Console internal testing track and installs it on a device; sounds and the core loop verified on the store build (design D4 rollback gate)

## 3. iOS store release

- [x] 3.1 First iOS production build with the user present for Apple credential setup (Apple ID login; EAS generates the distribution cert + profile per design D3); verify the artifact is an `.ipa` with a URL — build `fb656eb9` finished 2026-10-08 with an `.ipa` artifact URL (buildNumber 4; 1–3 burned on the pre-credential attempts). Done in the user's terminal after the project's transfer to the pocito-be account
- [x] 3.2 Create an App Store Connect API key together with the user, run `eas submit --platform ios --latest`, and verify the build appears in App Store Connect (design D5; this is the only upload path from Linux) — key reused from the user's soup-quiz setup; build `fb656eb9` submitted 2026-10-08 to app 6820671311, processing confirmed

## 4. Docs

- [ ] 4.1 Document production builds in README (profile, credential login, version inspection, per-store first upload per design D5, listings explicitly deferred); verify the documented commands run as written
