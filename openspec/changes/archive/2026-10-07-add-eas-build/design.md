# Design

## Context

No `eas.json` exists; `app.json` has no `android.package` (EAS Android builds require one). The box is logged in to EAS with two owner accounts; the user chose `pocito`. The immediate goal is narrow: an APK on their phone to judge the new icon + splash (add-app-icon-splash task 4.2). Store submission is a later change.

## Goals / Non-Goals

**Goals:**
- One command produces an installable Android APK via EAS cloud build.
- The permanent choices made deliberately now: package id `be.pocito.thinkfast`, project under `pocito`.
- Groundwork the later store-readiness change can extend (profiles stay minimal but honest).

**Non-Goals:**
- Production/Play builds, store listing assets, submission automation.
- iOS (Apple Developer account + device registration — separate setup).
- `expo-dev-client` / development builds (the app has no native debug needs yet; a preview APK suffices).

## Decisions

### D1 — One `preview` profile, internal APK distribution
`eas.json` gets exactly one build profile: `preview` with `distribution: "internal"` and `android.buildType: "apk"`. Internal-distribution APKs download straight from the build page/QR — no signing keystore ceremony (EAS generates one), no store review.
*Why:* the smallest thing that answers "does the icon and splash look right on my phone". A `production` profile arrives with the store-readiness change, when its requirements (AAB, Play signing, channels) are actually known.

### D2 — Package id now, deliberately
`be.pocito.thinkfast` goes into `app.json` before the first build because it is baked into every APK and is unchangeable on Play once listed. Namespace matches the owning `pocito` account.

### D3 — CLI via `pnpm dlx eas-cli`, no devDependency
EAS builds are occasional; `dlx` always fetches a current CLI and keeps the dependency tree lean. README documents the exact commands. If builds become routine (CI), pinning becomes worth it.

### D4 — What the device check should show on Android 12+
The `expo-splash-screen` config (ink background + wordmark) governs iOS and classic Android; Android 12+ derives its launch screen from the adaptive icon over the window background. The check verifies what actually appears on the user's phone and, if the 12+ system splash disappoints, that finding goes to the store-readiness or a splash-tuning follow-up rather than being silently accepted.

## Risks / Trade-offs

- [Free-tier build queue can stall] → build is kicked non-interactively and polled; nothing blocks local work meanwhile.
- [EAS-generated keystore lives in Expo's cloud] → fine for preview APKs; the store-readiness change decides about bring-your-own-keystore.
- [First build sets versionCode 1] → acceptable; version policy comes with store-readiness.

## Migration Plan

Config-only; rollback is reverting `eas.json`/`app.json`. The EAS project record can be abandoned harmlessly if renamed later.
