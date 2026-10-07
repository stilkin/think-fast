# Spec Delta

## Purpose

Store-ready releases: building, signing, and versioning production binaries for Google Play and the App Store, and the documented path each binary takes into its store on first upload.

## ADDED Requirements

### Requirement: Production builds produce store artifacts
A `production` build profile SHALL produce store-format artifacts — an Android App Bundle (AAB) and an iOS IPA — distinct from the internal-distribution preview profile, from the same committed app configuration.

#### Scenario: Android production artifact
- **WHEN** a production build for Android finishes
- **THEN** the artifact is an `.aab` App Bundle suitable for upload to Google Play

#### Scenario: iOS production artifact
- **WHEN** a production build for iOS finishes
- **THEN** the artifact is an `.ipa` suitable for upload to App Store Connect

### Requirement: Release signing is managed by EAS
Store signing credentials — the Android upload keystore and the Apple distribution certificate with provisioning profile — SHALL be generated and stored by EAS under the project, recoverable from any machine with the account, not hand-built or committed to the repo.

#### Scenario: First production build without local keystores
- **WHEN** the first production build runs on a machine with no local signing material
- **THEN** EAS generates the missing credentials interactively and the build is store-signed

### Requirement: Release versions increment per upload
The Android `versionCode` and iOS `buildNumber` SHALL increment automatically for every production build, so a store upload never fails on a stale build number; the human-readable version stays owned by the app config.

#### Scenario: Two consecutive Android production builds
- **WHEN** two production builds for Android are made without editing config in between
- **THEN** the second carries a higher `versionCode` than the first

### Requirement: The iOS app identity matches Android
The iOS build SHALL use the same reverse-DNS id (`be.pocito.thinkfast`) and the same icon/splash identity as the Android build, so both stores list one app.

#### Scenario: Bundle id parity
- **WHEN** the iOS production build configuration is inspected
- **THEN** the bundle identifier equals the Android package name

### Requirement: Android ships only the permissions it uses
The production Android app SHALL request no permissions beyond what the game uses; recording and foreground-service permissions that a dependencies default pulled in SHALL be excluded.

#### Scenario: Permissions audit
- **WHEN** the built AAB's manifest is inspected
- **THEN** no microphone or foreground-service permission is requested

#### Scenario: Sounds still play
- **WHEN** the trimmed build runs on a device
- **THEN** the four game sounds play exactly as before the trim

### Requirement: The store upload path is documented
README SHALL document, per store, how to build a production binary and perform the first upload: Play via manual AAB upload to the internal testing track; iOS via `eas submit` with an App Store Connect API key.

#### Scenario: Following the README from a clean clone
- **WHEN** a contributor follows the production section of README
- **THEN** they can produce a store artifact and know exactly how it reaches each store
