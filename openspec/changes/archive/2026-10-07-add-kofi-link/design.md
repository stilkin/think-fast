# Design

## Context

Settings (`src/app/settings.tsx`) is a scrollable stack of sections (Kids mode, packs, timer) in the app's ink/cream/Fredoka language. The i18n module (`src/i18n/strings.ts`) carries every UI string in EN/NL/DE/FR with a completeness test. expo-linking is already a dependency. The user chose: localized sentence label, coral accent on the coffee emoji.

## Goals / Non-Goals

**Goals:**
- One quiet, localized, accessible support link at the bottom of settings.

**Non-Goals:**
- Ko-fi brand assets or the official badge button (raster asset we cannot regenerate from source).
- Any "about" screen, version info, or link management/config.
- Handling network state around the tap (OS-native behavior is fine).

## Decisions

### D1 — Text link, not a badge
Coral `☕` + cream label in Fredoka text at reduced opacity (~0.65), size ~14, centered in a footer row with generous top margin. No bundled images, crisp at every DPI, in the app's own visual language. The coral (`#FF6B6B`, theme) on the emoji nods to Ko-fi's near-identical red (`#FF5E5B`) without importing their asset.

### D2 — `Linking.openURL` straight to the browser
The Ko-fi flow (tips, login) belongs in a full browser, not an in-app tab — `Linking.openURL('https://ko-fi.com/stilkin')` from expo-linking. No `expo-web-browser` session needed.

### D3 — One string key, accessibility included
`supportKoFi` in `strings.ts` for all four languages; the same string doubles as the Pressable's `accessibilityLabel` (the `☕` is decorative). The existing i18n completeness test enforces the four translations.

## Risks / Trade-offs

- [Link rot if the handle changes] → it is one constant in one file; acceptable.
- [Nobody finds it] → that is the accepted trade-off of "unobtrusive"; placement matches the user's explicit wish.

## Migration Plan

Additive UI row + string; rollback = revert commit.
