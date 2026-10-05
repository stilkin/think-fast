# Proposal

## Why

With 150 categories the mix no longer fits every table: a kids' session hits "Chemical elements" far too often (only ~20% of rounds are `basis`), adults can't ask for a hard game, and the minimal scope we shipped with deliberately left out the timer that gives Pim Pam Pet its time pressure. This change adds a settings screen (category filters + timer) and the round timer itself, plus one UI simplification that falls out of the wheel already being the re-spin control.

## What Changes

- **Settings screen** (gear button in the game header): a **Kids mode master switch** — when on, only `kid`-tagged categories play (~96 across all packs) and the pack toggles grey out — above **three pack toggles** (basis / gevorderd / thematisch; the last enabled pack cannot be turned off, so the active set is never empty)
- **Category tagging**: every entry gains an optional `kid` boolean (default false); the shipped dataset is tagging-passed so at least 90 entries across all three packs are kid-friendly; the validator enforces the field's type
- **Filtered draws**: the category bag draws from the active set (enabled packs, or the kid set in Kids mode); changing the filter mid-game starts a fresh round from the new set (category cycle resets, letter cycle untouched — mirroring the language-switch rule); pack display names localized in the data module
- **Round timer**: configurable in settings (on/off + 10 / 20 / 30 s **chips**, not a slider); starts when the letter lands (including the auto-spin after Next); a countdown ring around the letter stamp drains through warning colors; per-second ticking only in the final five seconds; a buzzer and an expiry state at zero; any round action (re-spin, Next) cancels it — **no dedicated stop button**
- **"Nieuwe letter" button removed**: tapping the wheel already re-spins with identical semantics; the hub label becomes contextual ("DRAAI" → "OPNIEUW" after a landing) to teach the gesture. No spec-level change — `game-loop` defines Re-spin as an action, not a button
- All settings (packs, kids mode, timer config) persist like language and mute

Out of scope: scoring/teams (a later change; the eventual "point!" button will also cancel the timer), per-round custom durations, sounds beyond tick/tock/buzzer, changing the letter sets.

## Capabilities

### New Capabilities

- `game-settings`: the settings screen — Kids master switch, pack toggles, timer configuration, persistence, and the never-empty active-set invariant
- `round-timer`: the countdown during a round — start on landing, visible warning-color progress, final-five-seconds ticking, buzzer on expiry, cancellation on any round action

### Modified Capabilities

- `category-data`: entries gain an optional kid-friendliness tag with validator enforcement and a tagged shipped dataset
- `game-loop`: the no-repeat draw now draws from the user-selected active set, and filter changes restart the category cycle with a fresh round

## Impact

- `src/data/categories.ts` (+ `PACKS` display names, `kid` field, tagging pass), `src/data/categories.test.ts` (tag contract)
- `src/game/engine.ts` (active-set filtering, bag rebuild), `src/game/engine.test.ts`, `src/game/GameState.tsx` (settings state + persistence keys)
- New: settings route + screen, countdown ring component; `src/i18n/strings.ts` (+~15 strings ×4), `src/sound/sound.ts` + `scripts/gen-sounds.mjs` (tock + buzzer)
- `src/app/game.tsx` (gear button, respin-button removal, contextual hub label, timer wiring)
- Specs: 2 new capabilities, 2 modified deltas as listed
