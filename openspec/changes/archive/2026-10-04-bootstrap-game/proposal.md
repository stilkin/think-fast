# Proposal

## Why

Pim Pam Pet (a category and a letter → name an example, fast) is a proven around-the-table party format, but playing it today needs the physical wheel and cards. Think Fast replaces both with a phone app — built on the project's home stack (Expo) so it can ship to the family through the Android and iOS stores, with the wheel, letter sets, and categories built in for the languages the players speak (EN/NL/DE/FR).

## What Changes

- Single Expo (React Native, TypeScript) app with expo-router, managed with pnpm; targets Android and iOS, fully offline (all data, fonts, and sounds bundled). Store submission via EAS (icons, splash, store listings) is a later change — v1 runs in Expo Go / dev builds
- Spinning letter wheel: `react-native-svg` donut with a per-language letter set, a satisfying decelerating Reanimated spin (~4s), a tick sound per passing segment plus a landing chime (small bundled audio clips), mute toggle, and a quick-reveal fallback for reduced motion
- Core game loop, deliberately minimal: each round shows a random category and a spun letter; **Re-spin** keeps the category and draws a new letter; **Next** moves to a new category and spins again; neither letters nor categories repeat until their set is exhausted
- Category dataset: ~40 solid starter categories (basiscategorieën + uitgebreide + thematische from the classic game) each labeled in EN/NL/DE/FR with pack tags, in one typed, trivially editable data module whose contract is enforced by TypeScript and a vitest suite — more (niche) category lists will be merged in later changes
- Localization: language screen on first launch, all UI strings in four languages, language switchable anytime, language + mute persisted via AsyncStorage
- Look and feel is a first-class requirement: bold, playful party aesthetic, phone-first, big touch targets, animated feedback

Out of scope for this change (later changes): countdown timer, team scores, category-pack picker UI, web target, store submission/EAS build pipeline, further languages, merging the additional category lists still to be supplied.

## Capabilities

### New Capabilities

- `game-loop`: the round flow — presenting a category with a spun letter, the Re-spin and Next actions and their exact semantics, and no-repeat draws for letters and categories
- `letter-wheel`: the wheel itself — per-language letter sets (rare initials removed), spin animation and outcome selection, spin sounds and mute, reduced-motion behavior
- `category-data`: the category dataset — entry shape, translations with fallback chain, pack tagging, and the contract for editing/extending the data module
- `ui-localization`: language selection (EN/NL/DE/FR), translated UI chrome, and persistence of user preferences

### Modified Capabilities

(none — greenfield, no existing specs)

## Impact

- All new code; no existing code or specs affected. One Expo app: `app/` routes (language picker, game) + `src/` modules (`data/`, `i18n/`, `game/`, `wheel/`, `sound/`, `ui/`)
- New dependencies: `expo` + `expo-router`, `react-native`, `react-native-reanimated`, `react-native-svg`, `expo-audio`, `expo-font` + `expo-asset`, `@react-native-async-storage/async-storage`; dev: `typescript` (strict), `vitest`, `@biomejs/biome`
- No backend, no external APIs; everything needed to play ships inside the app bundle
- Project conventions (`openspec/config.yaml` context, root `CLAUDE.md`) updated to the Expo stack as part of this change; `openspec/specs/` gains the four capabilities above when this change archives
