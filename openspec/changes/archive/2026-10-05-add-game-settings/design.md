# Design

## Context

The game, wheel, data, and persistence patterns all exist (see `openspec/specs/`); this change layers group-tuning and time pressure on top. The product owner settled the UX forks in discussion: Kids mode as a master switch, chips not a slider, countdown ring not a background recolor, no stop button, and the "Nieuwe letter" button removed in favor of the wheel tap.

## Goals / Non-Goals

**Goals:** every table can tune the category mix in one screen; rounds regain time pressure; one less redundant button; all choices remembered.

**Non-Goals:** scoring/teams, per-round duration overrides, haptics, changing letter sets, localizing pack *contents* (only pack names).

## Decisions

**D1 — Kids mode is a master switch, not a fourth toggle.** A kids flag alongside pack toggles creates overlapping filters with confusing states (advanced off, yet kid-tagged advanced entries showing). Kids mode on ⇒ active set = `kid: true` entries and the pack toggles render visibly disabled; off ⇒ packs rule. The invariant "never an empty active set" is trivially guaranteed in both modes (the last pack can't be turned off; the shipped tagging floors the kid set at 90+).

**D2 — Discrete duration chips (10/20/30 s), not a slider.** Three values need no continuous input; chips match the language-screen visual language and are more thumb-friendly at a table. Extending to more durations later is additive.

**D3 — Countdown ring around the letter stamp, not a background recolor.** The indigo night is the identity; a green screen breaks it and creates contrast churn with cream text. A ring that drains butter→tangerine→coral carries the same traffic-light signal inside the design system, sits exactly where eyes already are (the stamp), and leaves the wheel untouched.

**D4 — Ticks only in the final five seconds.** Per-second ticking across 30 s is maddening; the bomb-fuse tail delivers urgency. The tick reuses `tick.wav`; a lower `tock.wav` (same generator script) differentiates timer ticks from wheel ticks. Buzzer: a new generated `buzzer.wav` (two short low sawtooth bursts). Mute silences all of it.

**D5 — No stop button; actions cancel.** Re-spin and Next already end the thinking phase; a stop button duplicates Next's effect with extra chrome. When scoring arrives, its "point" action joins the cancellers. The timer is cancelled (not paused) — pausing a party game is a fiction.

**D6 — Respin button removed; hub label goes contextual.** Tapping the wheel has identical re-spin semantics; the button is pure duplication. The hub label switches from the spin label to a localized "again" label after a landing (e.g. nl OPNIEUW) to teach the gesture. No spec change: `game-loop` defines Re-spin as an action, never as a button.

**D7 — Tagging is a data pass with validator teeth.** `kid?: boolean` on `Category`; ~96 entries tagged by the curation criteria (a child of ~6 can realistically name answers: animals, food, places-they-go, Disney/cartoons/soccer, school topics). The contract suite gains: `kid` boolean when present, ≥90 tagged, every pack non-empty of kid entries. Pack display names (`PACKS` with `Record<Lang, string>`) live in the data module — they are data, not UI chrome.

**D8 — Engine filter plumbing: `setFilter(active: Category[])` + bag rebuild.** `GameEngine` already rebuilds the letter bag on language switch; the same pattern generalizes: the provider computes the active set from settings and hands it to the engine, which replaces its category bag and starts a fresh round (letter bag untouched). Filtering lives in `GameState` (packs ∪ kids logic), keeping the engine dumb and unit-testable with arbitrary sets. Persistence keys: `tf.packs`, `tf.kids`, `tf.timer.enabled`, `tf.timer.seconds` alongside `tf.lang` / `tf.muted`.

**D9 — Timer as a self-contained component driven by a shared value.** `RoundTimer` wraps the stamp: a Reanimated-driven progress shared value started on landing (`withTiming` to 0 over the duration); color derived from progress thresholds; per-second callbacks scheduled only for the final five seconds. Cancellation = replacing/killing the animation, so any action naturally clears it. Reduced motion: the drain itself is informational (no shake/flash by construction); the expired state is color-only.

**D10 — Settings as a pushed route, not a modal stack.** One `settings` route pushed from a gear button in the header; back returns to the unchanged game (state lives in the provider, so the route is dumb). Keeps the router flat; a presentation modal buys nothing here.

## Risks / Trade-offs

- [Tagging judgment calls are debatable (is "Popes" kid-friendly? no — is "Soccer teams"? yes)] → the criteria live in the tasks; the validator only pins the floor (≥90, every pack), and re-tagging is a one-field data edit.
- [Greyed-out pack toggles under Kids mode may read as broken] → the switch sits directly above with explanatory subtext; state is obvious from the kids-set draws.
- [Timer + spin animation compete for attention on landing] → the ring starts only after the landing stamp settles (~300 ms grace), and it lives on the stamp, not the wheel.
- [Cancelling a Reanimated timer across re-renders] → single owner (the game screen) starts/stops it via a ref handle, same pattern as the wheel.
- [`kid` counts drift as categories are added later] → the validator floor fails loudly if the tagged share drops below the contract.

## Migration Plan

Greenfield feature on an existing app; no data migration beyond adding an optional field (old data without `kid` is valid by definition). Settings default to everything-on and timer-off, which reproduces today's behavior exactly.

## Open Questions

1. Exact tagged set (~96) is curated during apply against the criteria in tasks 1.1; the validator floor (≥90) is the contract, the exact list is editorial.
