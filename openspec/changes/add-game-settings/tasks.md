# Tasks

## 1. Category data

- [x] 1.1 Add the optional `kid?: boolean` field to `Category` and run the tagging pass over all 150 entries (criteria: a ~6-year-old can realistically name answers — animals, food, everyday places, school topics, Disney/cartoons/soccer; exclude phobias, politics, chemicals, drinking/culture-bound adult knowledge); verify the tagged set lands at ~90-100 entries and every pack keeps at least one
- [x] 1.2 Add `PACKS` display names (EN/NL/DE/FR) to the data module and extend the contract suite: `kid` must be boolean when present, ≥90 tagged entries, every pack non-empty of kid entries; verify `pnpm test` passes and fails naming the entry when `kid` gets a string value on a broken copy
- [x] 1.3 Add the new UI strings for settings/timer/hub to `src/i18n/strings.ts` in all four languages (settings title, kids mode + subtext, pack section, timer section, duration labels, hub "again" label); verify the i18n completeness test still passes

## 2. Engine

- [x] 2.1 Generalize `GameEngine` with `setFilter(active: readonly Category[])`: rebuild the category bag from the active set and start a fresh round (letter bag untouched), mirroring the language-switch pattern (design D8); verify new vitest cases: draws stay within the filter, no repeats within the filtered cycle, filter change clears the current round, letter cycle survives a filter change
- [x] 2.2 Compute the active set in `GameState` (packs ∪ kids logic per design D1) with persisted keys `tf.packs` / `tf.kids` / `tf.timer.enabled` / `tf.timer.seconds`, defaulting to all-on and timer-off; verify a reload restores a narrowed selection (web runtime check is fine here)

## 3. Settings screen

- [x] 3.1 Build the settings route: gear button in the game header, Kids master switch with subtext above three pack toggles (labels from `PACKS`, localized), timer on/off + 10/20/30 chips, back returns to the game; verify mid-round open/close without changes keeps the round, timer, and cycles intact
- [x] 3.2 Wire the toggles: last enabled pack cannot be turned off, Kids mode disables and greys the pack toggles and narrows draws to `kid: true`, changes apply immediately with a fresh round + spin; verify via the web runtime that gevorderd-only draws only advanced categories and Kids mode overrides any pack combination

## 4. Round timer

- [x] 4.1 Generate and commit `tock.wav` and `buzzer.wav` via `scripts/gen-sounds.mjs`, extend the `sound.ts` facade; verify both play through the facade with mute silencing them
- [x] 4.2 Build the countdown ring around the letter stamp (drain + butter→tangerine→coral transition, seconds visible, ~300 ms grace after landing, color-only expired state), started on landing and cancelled by re-spin/Next with no buzzer; verify with a 10-second timer in the web runtime: ring appears on landing, warning color in the final phase, expiry state at zero, and an early Next leaves no buzzer
- [x] 4.3 Add final-five-seconds ticking with `tock` and the expiry buzzer, both respecting mute; verify no ticks before the final phase on a 30-second run and silence throughout when muted

## 5. Wheel-first re-spin

- [x] 5.1 Remove the "Nieuwe letter" button and make the hub label contextual (spin label before the first spin, localized "again" label after a landing); verify a landed round shows the again-label and tapping the wheel re-spins with the same category, while Next stays the only footer button

## 6. Integration checks

- [ ] 6.1 Full web-runtime pass: settings flows (packs, kids, timer) + round flows (spin → timer → expiry, early Next, re-spin) + language switch + offline reload, zero console errors; statics green (`pnpm typecheck` / `lint` / `test`); on-device pass for sound audibility and one-handed reach of the new header gear button
