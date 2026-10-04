# Design

## Context

Greenfield: no code exists yet. Hard constraints come from the project context: single Expo (React Native, TypeScript) app with expo-router, managed with pnpm, targeting Android and iOS; offline-first (everything bundled); EN/NL/DE/FR at launch; look-and-feel is a first-class requirement. Motivation and scope: see `proposal.md`; behaviors: see the four spec deltas. The platform was switched from an earlier static-web sketch to Expo before any code was written; this design reflects Expo only.

## Goals / Non-Goals

**Goals:**

- A phone app the family can play anywhere, with zero setup and zero network
- A spin that feels physical: deceleration, ticks, a landing chime
- Data and UI factored so adding categories or languages later is a one-file edit
- Logic testable without an emulator (pure TS modules + vitest)

**Non-Goals:**

- No timer, scoring, players, or pack-picker UI in this change (specs leave room)
- No web target, no store submission/EAS pipeline, no push/analytics
- No end-to-end test framework — verification is vitest for logic + scripted manual checks on emulators

## Decisions

**D1 — Single Expo app, TypeScript strict, expo-router, pnpm.** One app: `app/` holds the two routes (`/` language picker, `/game` game screen); `src/` holds modules (`data/`, `i18n/`, `game/`, `wheel/`, `sound/`, `ui/`). Tooling matches the project's other apps: `tsc --noEmit`, Biome, Vitest, wired as root `pnpm` scripts. Alternative rejected: pnpm monorepo with `packages/schema|data|engine` (soup-quiz pattern) — that split pays off when an external consumer (e.g. a Python pipeline) needs the schema contract; here TypeScript types inside the app carry the same guarantee. Can be split out later without API churn.

**D2 — Wheel is `react-native-svg`, rotation driven by Reanimated on the UI thread.** The donut is a static SVG (one `Path` per letter segment + rotated `Text` labels) inside a single animated group whose rotation is a Reanimated shared value. The spin uses `withTiming` with a cubic ease-out; an animated reaction derives `floor(angle / segmentAngle)` and emits a tick each time it changes (`runOnJS`), so ticks track the wheel without JS-driven frames. Alternatives rejected: animating via `setState`/rAF (frame drops through the bridge); CSS/`Animated` classic API (no per-frame derived values).

**D3 — Outcome is chosen first, then the animation targets it.** On spin: draw a letter uniformly from the unused set, compute the final angle to land the pointer in that segment (with jitter inside the segment), add 4–6 full revolutions, and `withTiming` to it over ~3.8–4.3 s (randomized per spin). Alternative rejected: animating to a random final angle and reading the letter under the pointer — segment jitter makes uniformity harder to reason about and the no-repeat bag impossible to honor. Bag empties → refill.

**D4 — Sounds are two tiny bundled clips played through `expo-audio`, behind a facade.** WebAudio synthesis isn't available on RN, so the tick and landing chime are short WAV files generated once by a script at authoring time (sine/noise shaping — no downloaded audio, no licensing) and committed under `assets/sounds/`. `src/sound/sound.ts` wraps playback (pre-load, fire-and-forget play, mute) so the audio module can be swapped without touching the wheel. Risk of Android latency on rapid ticks is accepted; mitigation in Risks.

**D5 — One bundled display font via `expo-font`.** A single OFL-licensed rounded display weight (e.g. Baloo 2 / Fredoka class) is committed under `assets/fonts/` and loaded at startup; the system font is the fallback for any missing glyph. Bundling keeps the offline guarantee while giving the distinctive party look the project context demands. Contingency: if the font can't be sourced during apply, ship the system rounded stack only — appearance only, no spec impact. Final typeface choice is an open question (Q1).

**D6 — Hand-rolled i18n dictionary.** ~15 UI strings × 4 languages in `src/i18n/strings.ts` with a `t(key)` helper typed so a missing key or language is a compile error. A library would be the first runtime dependency for no gain at this size. No RTL languages at launch.

**D7 — Data is a typed TS module; the contract is compile-time + a vitest suite.** `src/data/categories.ts` exports `LETTERS: Record<Lang, string>` and `CATEGORIES: readonly Category[]` (`{id, pack, icon, label: Record<Lang, string>}` with `label.en` required by the type). TypeScript catches shape errors while editing; a vitest suite enforces what types can't — unique ids, non-empty English labels, known pack values, ≥ 40 entries — naming offending entries. Alternative rejected: zod schema (pays off only with external data producers; revisit if a category pipeline ever appears). README documents the entry format with a copy-paste example so future category lists merge without touching app code.

**D8 — Two screens via expo-router stack; React state + AsyncStorage.** Language picker and game are two routes; navigation replaces the saved-language check (first launch → picker, else → game). Game state (bags for letters/categories, current round) lives in a small React context; only preferences (`tf.lang`, `tf.muted`) persist via AsyncStorage. No state library.

## Risks / Trade-offs

- [Android audio latency makes rapid ticks smear] → clips are pre-loaded and fire-and-forget; if ticks lag in practice, thin them at high speed (tick every other crossing near the start) — the perceptible slowdown at the end is what sells the effect.
- [`runOnJS` tick emissions could thrash the bridge at top speed] → the reaction emits only on integer-crossing changes (a few dozen per spin); if profiling shows pressure, batch crossings per frame.
- [`expo-audio` is the newer Expo audio module with a moving API] → isolated behind `src/sound/sound.ts` (D4), swap is one file.
- [Bundled font lacks a glyph for some DE/FR accent] → verify coverage for all four alphabets in apply; RN falls back per-glyph to the system font automatically.
- [Wheel letters unreadable on small screens] → wheel takes the full width minus margins, letters sized relative to wheel radius, dark-on-light contrast enforced per palette segment.
- [Fixed spin feel becomes predictable] → per-spin randomized duration, revolution count, and landing jitter (D3).
- [Reanimated/SVG interactions differ subtly between Android and iOS] → apply-phase checks run on both emulators; any divergence is a bug to fix, not a platform fork.

## Open Questions

1. Final typeface (Baloo 2 vs Fredoka vs similar OFL rounded face) — decided during apply when the wheel is rendered; changes no structure and no spec.
