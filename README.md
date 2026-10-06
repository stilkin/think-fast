# Think Fast

Digital Pim Pam Pet: spin the wheel, get a letter and a category, and name something
that fits — fast. Expo (React Native, TypeScript) app for Android and iOS (plus any
browser via Expo web); EN / NL / DE / FR out of the box. Fully offline: there is no
backend, no account, no analytics — nothing to configure.

## Playing

Tap the wheel (or wait for the automatic spin after "Next category"). Name something
in the category that starts with the landed letter.

- **Stuck on a letter?** Tap the wheel to spin the same category again.
- **Next category** — new challenge, spins automatically.
- Letters and categories never repeat until their whole set has been used.
- **Round timer** (optional): a 10 / 20 / 30 s countdown starts when a letter lands,
  ticking over the final seconds and buzzing at zero.
- **Settings (⚙)**: Kids mode (draws only from kid-friendly categories), category
  packs, and the round timer.

The language can be switched anytime via the flag button (top right); sound via the
speaker button. Both are remembered.

## Tech stack

- **Language:** TypeScript (strict) across the app, the scripts, and the tests.
- **Framework:** Expo SDK 57 / React Native 0.86 / React 19, with
  [expo-router](https://docs.expo.dev/router/introduction/) for navigation.
- **UI & animation:** react-native-svg for the wheel, Reanimated for spin and
  letter-stamp motion.
- **Audio:** expo-audio playing four generated sounds (see below).
- **Persistence:** AsyncStorage for the settings (language, sound, packs, kids,
  timer). No database, no server.
- **i18n:** a typed string module (`src/i18n/`) — no i18n library.
- **Tooling:** pnpm, Biome (lint + format), Vitest (tests + coverage),
  simple-git-hooks pre-commit.

## Getting started

You need Node LTS and pnpm (`corepack enable`), plus something to run the app on:
Expo Go on a phone, an emulator, or a browser (press `w` in the dev-server menu).

```bash
pnpm install
pnpm start          # Expo dev server
```

That is the whole setup — no `.env`, no keys, no services to start.

### Commands

```bash
pnpm typecheck      # tsc --noEmit
pnpm lint           # biome check
pnpm test           # vitest (data contract, i18n completeness, game logic, wheel math)
pnpm test:coverage  # same suite with per-file coverage
```

A pre-commit hook (installed automatically by `pnpm install`) runs Biome on staged
files and re-stages the fixes; skip it once with `git commit --no-verify`.

Work happens through OpenSpec changes — see CLAUDE.md.

## Project layout

```
src/
  app/         screens (expo-router): index = language picker, game, settings
  data/        categories.ts — all category data; categories.test.ts
  game/        engine.ts (no-repeat draws), GameState.tsx (provider + persistence)
  i18n/        strings.ts — every UI string in EN/NL/DE/FR; completeness test
  sound/       expo-audio wiring for the four sounds
  ui/          theme.ts (palette, type), RoundTimer.tsx
  wheel/       geometry.ts (segment math), Wheel.tsx (SVG wheel)
assets/        fonts, sounds, images, icon-sources
scripts/       gen-sounds.mjs, gen-icons.mjs (asset generators)
```

## Building for a device (EAS)

One-time: `pnpm dlx eas-cli login`. A preview APK (internal distribution —
installable straight on a phone, no store):

```bash
pnpm dlx eas-cli build --platform android --profile preview --non-interactive
```

The CLI prints the build URL; when the build finishes that page offers the APK
and a QR code to scan on the phone. The EAS project lives at
[expo.dev/accounts/pocito/projects/think-fast](https://expo.dev/accounts/pocito/projects/think-fast)
(Android package `be.pocito.thinkfast`).

## Adding categories

All categories live in [`src/data/categories.ts`](src/data/categories.ts) — that is the
only file to edit. Append an entry to `CATEGORIES`:

```ts
{
  id: 'board-games',                 // stable, unique, kebab-case
  pack: 'gevorderd',                 // 'basis' | 'gevorderd' | 'thematisch'
  icon: '🎲',                        // emoji for the category card
  label: {
    en: 'Board games',
    nl: 'Bordspellen',
    de: 'Brettspiele',
    fr: 'Jeux de société',
  },
  kid: true,                        // optional: playable by ~6-year-olds
},
```

- English is the only required label — missing others fall back to English
  (so a new category can ship NL-only drafts too, and vice versa).
- Packs tag difficulty/theme; players toggle them in settings, and Kids mode
  narrows draws to `kid: true` entries (the suite keeps that set ≥ 90).
- The wheel's letter sets per language (rare initials removed) live in `LETTERS`
  in the same file.

Then run `pnpm test` — the contract suite in `src/data/categories.test.ts` validates
the file (unique ids, English label present, known pack, boolean kid tag, ≥ 90
kid-tagged entries, four-language starter set) and names any entry that breaks
the rules.

## Sounds and fonts

The four game sounds (`tick`, `chime`, `tock`, `buzzer`) are generated — no external
sources:

```bash
node scripts/gen-sounds.mjs
```

The display font is [Fredoka](https://fonts.google.com/specimen/Fredoka) (SIL OFL),
bundled under `assets/fonts/`.

## Icons and splash

The launcher icons and splash wordmark are generated from text sources, so they stay
diffable and regenerable:

- Sources: `assets/icon-sources/*.svg` — `TF!` / "Think Fast!" set in
  [Titan One](https://fonts.google.com/specimen/Titan+One) (SIL OFL, TTF + license
  committed under `assets/fonts/`), on the app's ink background. The in-app UI
  stays Fredoka; Titan One is the wordmark face only.
- Outputs (`assets/images/`): `icon.png` (1024, iOS + fallback), adaptive
  foreground/monochrome (1024), `favicon.png` (48), `splash-icon.png` (1280×512),
  and `play-icon.png` (512, the Play Store listing asset).

```bash
node scripts/gen-icons.mjs   # needs system Chromium (uses the same binary as the app's web testing)
```

The script serves the sources over a local HTTP server and rasterizes them through
Chromium via playwright-core; rerunning it reproduces byte-identical PNGs.

## Support

If you enjoy Think Fast! and want to support its development, consider buying me a drink:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/stilkin)

Your support helps me continue developing and improving Think Fast!

## License

[PolyForm Noncommercial 1.0.0](LICENSE) — free to use for personal and non-commercial purposes.
