# AGENTS.md

Canonical agent guidance for this repository: a standalone React/Vite utility
site for the game Heartopia. Read it fully before changing anything.

<!-- atc:governance -->This repository follows Agent Traffic Control governance: read `.atc/README.md` first.

## Commands

Node `24.19.0`, npm `11.17.0` (`.node-version`).

- `npm ci` — install.
- `npm test` — Vitest suite.
- `npm run build` — typecheck + Vite build into `dist/` (base `/`).

## Rules

- Everything in the repo and `dist/` is public; never commit secrets.

## Task records

- Task prefix: HT

Records live in `.atc/tasks/`; `docs/TASKS.md` of the workspace root specifies
them and `atc task`.

## Integration verification

- Verifier argv file: scripts/integration-verify.json

`scripts/integration-verify.mjs` runs in the `atc integrate` candidate checkout
with Node's standard library only. It checks the `ATC_*` inputs and the
candidate's `HEAD`, that `node` matches `.node-version`, and
`git diff --check` over the integration range; then it runs `npm ci`,
`npm test` and `npm run build` inside the candidate, whose outputs
(`node_modules/`, `dist/`, `dist-ssr/`) are ignored; last it checks that
`HEAD` did not move and the tree is clean. A refusal prints its token as the
first stderr line and exits 1, or 9 for `TIME_SLACK_INVALID`. The report
records the `ATC_TEST_TIME_SLACK` the run used (default 2), as `atc integrate`
compares it before reusing a pass. Every range runs every check: the verifier
takes no documentation-only exception, since the whole run is short.
