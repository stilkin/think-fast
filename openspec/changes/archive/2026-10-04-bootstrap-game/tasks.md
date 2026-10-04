# Tasks

## 1. App shell & tooling

- [x] 1.1 Scaffold the single Expo TypeScript app with expo-router (`app/` routes for the language picker and game screen, `src/` module layout per design D1) and root `pnpm` scripts (`start`, `typecheck` via `tsc --noEmit`, `lint` via Biome, `test` via vitest); verify `pnpm typecheck` / `pnpm lint` / `pnpm test` pass on the scaffold and the app boots in an emulator via `pnpm start`
- [x] 1.2 Resolve design Q1: source one OFL rounded display font, commit it under `assets/fonts/`, load it via `expo-font`, confirming it covers EN/NL/DE/FR glyphs; verify the title renders in the font with the device in airplane mode (fall back to the system rounded stack only if sourcing fails, per design D5)

## 2. Category data

- [x] 2.1 Author `src/data/categories.ts`: `LETTERS` per language (nl −Q/X/Y, en −Q/X, de −Q/X/Y, fr −K/W/X/Y) and ≥ 40 categories covering the classic base list plus extended and thematic ones, each with `id`, `pack`, `icon`, and EN/NL/DE/FR labels; verify by spot-checking the base-list topics exist with sane translations in all four languages
- [x] 2.2 Add the data-contract vitest suite enforcing the category-data spec — unique ids, non-empty English label, known pack (`basis`/`gevorderd`/`thematisch`), ≥ 40 entries, naming offenders; verify `pnpm test` passes and fails naming the entry when run against a deliberately broken copy (duplicate id, missing label, unknown pack)
- [x] 2.3 Document adding categories in `README.md`: entry-format copy-paste example, pack meanings, letter-set note, and the `pnpm test` validation command; verify the documented command runs as written

## 3. Localization & language screen

- [x] 3.1 Implement `src/i18n/strings.ts`: UI string dictionary for EN/NL/DE/FR with a `t(key)` helper typed against the key union (design D6), plus a vitest case asserting every key exists in all four languages; verify `pnpm test` covers it
- [x] 3.2 Build the language screen (four large language options) that appears on first launch and is skipped when a language is saved (AsyncStorage), per ui-localization spec; verify: fresh install shows the picker, and after choosing + restarting the app the game opens directly in that language

## 4. Letter wheel

- [x] 4.1 Implement wheel rendering in `src/wheel/`: `react-native-svg` donut with one segment per letter of the active language's set, alternating palette, positioned letters, top pointer, rebuilt on language change (design D2); verify by counting rendered segments per language: nl 23, en 24, de 23, fr 22
- [x] 4.2 Implement the spin: outcome drawn first from the unused-letter bag, target angle with in-segment jitter + 4–6 revolutions, Reanimated `withTiming` cubic ease-out over ~3.8–4.3 s, overlapping-spin guard, activation by tap/press, and the reduced-motion quick reveal via `useReducedMotion` (design D3); verify over 20+ consecutive spins: each rests on its reported letter, lasts 3–5 s, produces each letter exactly once per bag cycle (log draws for the check), and reduced-motion reveals near-instantly
- [x] 4.3 Implement sound and mute: generate and commit the tick and landing-chime WAVs (authoring script per design D4), wrap `expo-audio` behind `src/sound/sound.ts`, add the persisted mute toggle; verify ticks audibly slow with the wheel, the chime plays once at rest, and mute silences everything and survives an app restart

## 5. Game loop & screens

- [x] 5.1 Implement the round flow in `src/game/`: category draw without repeats per cycle, Re-spin keeping the category while drawing a new letter, Next advancing the category and auto-spinning, per game-loop spec; verify manually that Re-spin keeps the category, Next changes it and spins automatically, and no category repeats across a full cycle
- [x] 5.2 Polish the game screen: category card with icon and label, letter reveal treatment, live language switch updating chrome + labels + wheel, phone-first layout with big touch targets and animated feedback; verify on Android and iOS emulators that the game is playable one-handed and a mid-game language switch updates everything at once

## 6. Integration checks

- [x] 6.1 Full pass on Android and iOS emulators: pick language → spin → Re-spin → Next → switch language mid-game → restart the app, with zero errors; launch in airplane mode and play rounds fully (categories, font, sounds); verify both platforms clean
- [x] 6.2 Static checks from the repo root: `pnpm typecheck`, `pnpm lint`, `pnpm test` all green; verify all three pass
