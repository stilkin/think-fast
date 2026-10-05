# Think Fast

Digital Pim Pam Pet: spin the wheel, get a letter and a category, and name something
that fits — fast. Expo (React Native, TypeScript) app for Android and iOS;
EN / NL / DE / FR out of the box, fully offline.

## Playing

Tap the wheel (or wait for the automatic spin after "Next category"). Name something
in the category that starts with the landed letter.

- **New letter** — stuck? Same category, new letter.
- **Next category** — new challenge, spins automatically.
- Letters and categories never repeat until their whole set has been used.

The language can be switched anytime via the flag button (top right); sound via the
speaker button. Both are remembered.

## Developing

Package manager is pnpm; do not use npm/yarn.

```bash
pnpm install
pnpm start          # Expo dev server (Expo Go / dev client / emulators)
pnpm typecheck      # tsc --noEmit
pnpm lint           # biome check
pnpm test           # vitest (data contract, i18n completeness, game logic, wheel math)
pnpm test:coverage  # same suite with per-file coverage
```

A pre-commit hook (installed automatically by `pnpm install`) runs Biome on staged
files and re-stages the fixes; skip it once with `git commit --no-verify`.

Work happens through OpenSpec changes — see CLAUDE.md.

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

`assets/sounds/tick.wav` and `chime.wav` are generated (no external sources):

```bash
node scripts/gen-sounds.mjs
```

The display font is [Fredoka](https://fonts.google.com/specimen/Fredoka) (SIL OFL),
bundled under `assets/fonts/`.
