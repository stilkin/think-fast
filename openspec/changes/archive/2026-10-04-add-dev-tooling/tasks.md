# Tasks

## 1. Coverage reporting

- [x] 1.1 Add `@vitest/coverage-v8` and a `pnpm test:coverage` script (`vitest run --coverage`); verify the command runs and reports per-file line/branch coverage, and record the baseline numbers

## 2. Pre-commit hook

- [x] 2.1 Configure `simple-git-hooks` (`pre-commit` → `pnpm exec lint-staged`) and `lint-staged` (`*.{ts,tsx,js,jsx,json,css}` → `biome check --write`) in `package.json`, add a `prepare` script installing the hook, and activate it with `pnpm exec simple-git-hooks`; verify `.git/hooks/pre-commit` exists and contains the command
- [x] 2.2 Verify the hook end-to-end: stage a deliberately misformatted scratch file, run the exact pre-commit command, confirm the file is reformatted and re-staged, then remove the scratch file
- [x] 2.3 Document the hook (and its `--no-verify` escape hatch) in README's Developing section; verify the documented command runs as written
