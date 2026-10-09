# Design

## Context

The settings footer already has one outward link (Ko-fi, `game-settings` spec, quiet style: 14 px cream text at 65% opacity, coral ☕). The privacy policy needs an in-app home for store compliance; Settings is where secondary/legal links live.

## Goals & Non-Goals

- Goals: policy reachable in-app; localized; quieter than the tip jar; zero new behavior elsewhere.
- Non-Goals: an in-app policy viewer (browser is fine and keeps the policy single-sourced at think-fast.pocito.fyi); version info / about screens; any other footer links.

## Decisions

### D1 — Reuse the footer pattern, minus the emoji

One more `Pressable` directly under the Ko-fi row, same treatment as `kofiText` (small, dimmed cream) but without the ☕ — text-only reads as a legal footer and keeps the support link the friendlier of the two. The link opens `https://think-fast.pocito.fyi/privacy` via `expo-linking`, exactly like `KOFI_URL`.

Alternatives considered: a dedicated "About" screen (overkill for one link), or placing it on the game screen (wrong — settings is the established home for secondary links; a game-screen footer would clutter play).

### D2 — i18n key `privacyPolicy`

Single new key in `strings.ts`, all four languages, per the existing completeness suite:
EN "Privacy policy" · NL "Privacybeleid" · DE "Datenschutzerklärung" · FR "Politique de confidentialité".

### D3 — Style: shared `footerLink` treatment, not a copy

The Ko-fi row's `kofi`/`kofiText` styles get generalized to `footerLink`/`footerText` (the Ko-fi emoji stays as-is on its row only). Two rows sharing one style block keeps the footer consistent if a third link ever appears; `marginTop` moves to a footer wrapper or stays on the first row so the gap between footer and cards is unchanged.

## Risks / Trade-offs

- None meaningful: no permissions, no network dependency in the game, no data model change. The link is inert until tapped.

## Migration Plan

None — additive UI. Existing persisted settings are untouched.

## Open Questions

None.
