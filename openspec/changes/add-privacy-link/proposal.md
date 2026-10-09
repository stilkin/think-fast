# Proposal

## Why

Both app stores expect the privacy policy to be reachable from inside the app, not only from the store listing. The policy page exists (https://think-fast.pocito.fyi/privacy, the source of `PRIVACY.md`) and both listings already link it — the app itself does not yet. Apple's guideline 5.1.1 and Google Play's data-safety guidance both treat an in-app link as the baseline for a published app, so this belongs in the app before the stores are live.

## What Changes

- The settings screen footer (currently just the Ko-fi link) gains a second, quieter link: **Privacy policy**, opening https://think-fast.pocito.fyi/privacy in the device browser.
- Styled as the quietest element on the screen — same dimmed small type as the Ko-fi row but no emoji, reading as a legal footer beneath the tip jar.
- Localized label in EN / NL / DE / FR (i18n completeness suite keeps them in sync).
- No other behavior changes: still fully offline, the link is the only new outward action and never blocks anything.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `game-settings`: new requirement — the settings screen footer links the privacy policy, quieter than the support link, localized, opening in the browser without affecting offline play.

## Impact

- `src/app/settings.tsx` — one more footer `Pressable` under the Ko-fi row (shared footer style).
- `src/i18n/strings.ts` — new `privacyPolicy` string × 4 languages (completeness test enforces all four).
- No dependency, data, or navigation changes. Ships in the next store release; the build currently in App Store review is unaffected.
