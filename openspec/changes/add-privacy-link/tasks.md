# Tasks

## 1. Privacy link in Settings

- [x] 1.1 Add the `privacyPolicy` string to `src/i18n/strings.ts` in all four languages (EN "Privacy policy", NL "Privacybeleid", DE "Datenschutzerklärung", FR "Politique de confidentialité"); the type and completeness test keep them in sync
- [x] 1.2 Generalize the settings footer styles per design D3 (`kofi`/`kofiText` → `footerLink`/`footerText`, emoji stays Ko-fi-only) and add the privacy `Pressable` below the Ko-fi row, opening `https://think-fast.pocito.fyi/privacy` via `expo-linking`
- [x] 1.3 Verify: `pnpm typecheck`, `pnpm lint`, `pnpm test` green; web export shows the link below the support link in EN and NL (screenshots or DOM check) — typecheck/lint/test green (39/39; also silenced a pre-existing unused-variable warning in scripts/asc-api.mjs); headless-Chromium DOM check on the web export confirms exactly two footer links in order (support, then privacy, no emoji) with correct labels in EN and NL

## 2. Wrap-up

- [x] 2.1 Note in README's Playing section (one clause on the Settings bullet) that Settings also links the privacy policy — nothing more; the listing already points at the same page
