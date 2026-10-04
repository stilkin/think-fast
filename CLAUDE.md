# Think Fast

Digital Pim Pam Pet: spin the wheel, get a letter and a category, and name something
that fits — fast. Expo (React Native, TypeScript) app for Android and iOS;
EN / NL / DE / FR out of the box.

## How work happens: OpenSpec, always

Features are built through OpenSpec changes, never ad-hoc. The full loop and guardrails
live in `.claude/skills/openspec-*/SKILL.md` (authoritative — read them when running a
workflow). Key rules:

- `/opsx:explore` (thinking, no writes) → `/opsx:propose` (planning artifacts only) →
  `/opsx:apply` (implementation) → `/opsx:archive` (sync specs). Never implement inside
  explore or propose.
- Never hand-create change directories; always `openspec new change "<name>"`.
- `openspec validate "<name>"` takes the name positionally (`--change` is only for
  `status`/`instructions`).
- `openspec/config.yaml` → `context:` holds locked project constraints (Expo stack,
  offline-first, EN/NL/DE/FR, playful look, editable category data). It applies
  to every artifact and decision — treat it as binding.
- `openspec/specs/` is the durable capability inventory; changes carry deltas until archived.

## Running

Package manager is pnpm; do not use npm/yarn.

- `pnpm install`
- `pnpm start` — Expo dev server (Expo Go / dev client / emulators)
- `pnpm typecheck`, `pnpm lint`, `pnpm test`

## OpenSpec

```bash
openspec list                       # in-flight changes
openspec list --specs               # durable capabilities
openspec status --change "<name>"   # artifact/task progress
openspec validate "<name>"          # change validity
```

Category data lives in `src/data/categories.ts` (typed module); README documents the
format for adding categories, and `pnpm test` validates it.
