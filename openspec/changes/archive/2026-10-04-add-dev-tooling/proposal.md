# Proposal

## Why

The project already has the Ruff/Black/MyPy/PyTest quartet (Biome, tsc, Vitest), but nothing enforces them: they only pass because someone remembers to run them, and there is no visibility into how much of the code the tests actually exercise. The enforcement layer proposed earlier had two parts — CI (deferred by the product owner for now) and a pre-commit hook (requested now).

## What Changes

- **Pre-commit hook**: `simple-git-hooks` + `lint-staged` running Biome (`check --write`) on staged TS/TSX/JS/JSON/CSS files, re-staging the fixes; a `prepare` script installs the hook on every `pnpm install` so fresh clones get it automatically
- **Coverage reporting**: `@vitest/coverage-v8` dev dependency plus a `pnpm test:coverage` script (the pytest-cov equivalent), with a baseline report captured in this change
- One line in README's Developing section documenting the hook

Out of scope: GitHub Actions CI (explicitly delayed), husky, coverage thresholds/enforcement, `knip`.

## Capabilities

### New Capabilities

(none — pure tooling; no spec-level behavior changes, `skip_specs: true`)

### Modified Capabilities

(none)

## Impact

- `package.json`: two new devDependencies (`simple-git-hooks`, `lint-staged`, plus `@vitest/coverage-v8`), new `test:coverage` and `prepare` scripts, `simple-git-hooks` + `lint-staged` config blocks; `pnpm-lock.yaml`
- `.git/hooks/pre-commit` (local, not committed — recreated via `prepare`)
- No app code, no specs, no behavior changes
