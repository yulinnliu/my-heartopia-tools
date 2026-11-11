# AGENTS.md

Canonical agent guidance for this repository: a standalone React/Vite utility
site for the game Heartopia. Read it fully before changing anything.

<!-- atc:project-policy-reference begin -->
Agent Traffic Control governance bootloader:
1. Use an exact governance source/revision explicitly supplied by task authority, read from that exact Git revision.
2. Otherwise this repository's pinned governance is the copy under `.atc/governance/`; `.atc/governance.yaml` names its source and exact governance revision. Sync writes both; nothing edits them by hand.
3. If neither can be resolved authoritatively, stop.

Read `.atc/governance/INDEX.md` and `CORE.md` first, then only the modules `INDEX.md` routes to for the task. Project/repository rules in this `AGENTS.md` may be stricter and remain authoritative for this project.
<!-- atc:project-policy-reference end -->

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
first stderr line and exits 1. Every range runs every check: the verifier
takes no documentation-only exception, since the whole run is short.
