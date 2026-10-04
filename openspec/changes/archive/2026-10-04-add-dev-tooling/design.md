# Design

## Context

Static checks are already wired (`pnpm lint` / `typecheck` / `test`, all green). This change adds the enforcement and visibility layer only. See proposal.md — CI is out of scope.

## Goals / Non-Goals

**Goals:** staged files are always Biome-clean when committed; coverage is one command away.

**Non-Goals:** CI, coverage thresholds, whole-repo formatting on every commit.

## Decisions

**D1 — `simple-git-hooks` + `lint-staged`, not husky.** The hook only needs to run one command; `simple-git-hooks` is a single dev dependency with no postinstall surprises, while husky brings shell-script scaffolding we don't need. `lint-staged` handles the fiddly part correctly: only staged files, safe application of fixes, automatic re-staging (a hand-rolled shell pipeline would mis-handle renames/spacing and either over-stage or under-stage).

**D2 — The hook formats and fixes, then lets Biome errors block.** `biome check --write` applies safe fixes to staged files; anything it cannot fix exits non-zero and aborts the commit. That is deliberate enforcement — the fix is usually one `pnpm format` away. Type errors and tests stay OUT of the pre-commit hook (tsc has no staged-files mode, and test runs belong to CI/`pnpm test`).

**D3 — Coverage via `@vitest/coverage-v8`, no thresholds.** v8 provider needs no native instrumentation. A `test:coverage` script reports lines/branches/functions per file; thresholds would be premature while all UI code is intentionally uncovered (Vitest covers the pure-logic modules only — RN components have no test environment configured, by design).

## Risks / Trade-offs

- [Hooks are local-only until CI exists] → accepted: the product owner deferred CI; `prepare` re-installs hooks on every clone.
- [`lint-staged` mutates staged files] → it only touches Biome-fixable formatting, which `pnpm format` would do anyway.
- [A blocked commit mid-flow is annoying] → one-off escape hatch documented in README: `git commit --no-verify`.
