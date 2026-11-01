# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Codex, etc.) when working with code in this repository. User-facing docs live in `README.md` (Japanese); this file only records what an agent is likely to get wrong.

## Project Overview

Vite + React SPA hosted on Vercel, deliberately chosen over Next.js / Remix (rationale: README "Why Vite on Vercel"). Stack: React 18, React Router v7, Chakra UI v2, TanStack Table v8, Vitest, TypeScript, Prettier.

## Commands

The command list for humans is in README "Scripts". Notes for agents only:

- **pnpm is pinned to `pnpm@10.33.2`** (`package.json#packageManager`). An older local pnpm fails immediately with `ERR_PNPM_BAD_PM_VERSION`; run `corepack pnpm <subcommand>` instead. Verification works even when `pnpm install` has not completed.
- **Node.js `>=24.0.0`** (`.nvmrc` = `24`, matches the Vercel default). CI reads `.nvmrc` via `actions/setup-node`, so a local Node mismatch can pass locally and fail in CI.
- **Single test**: `pnpm vitest run <pathOrPattern>` or `pnpm vitest run -t '<test name pattern>'`. Drop `run` to watch.
- **Final checks that CI always runs**: `pnpm check` → `pnpm test`. Run both locally after any code change.
- **`pnpm lint` rewrites files** (`prettier --write`); `pnpm check` only verifies (`prettier --check`). Use `lint` to fix, `check` to confirm. There is no ESLint, so neither command does static analysis. Do not add ESLint unprompted; if it is ever added, the intended minimum is `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`.

## Architecture (big picture)

Several settings exist only because this is an SPA. They are designed to stay consistent with each other, so changing one in isolation breaks things silently.

- `src/main.tsx` is the entry point and the only place that mounts `<RouterProvider router={router} />` and `<Analytics />` (`@vercel/analytics/react`). Analytics only measures in production; it is a no-op locally and in previews.
- `src/router.tsx` is the single source of truth for routing. When adding a feature, add its `path` and `element` here.
- `vercel.json` `rewrites` are two sides of one coin with client-side routing: `/((?!assets/).*)` falls back to `/index.html` so deep links to SPA sub-paths return 200. If a new "reserved path" is introduced, revisit the regex.
- `vercel.json#framework` takes precedence over the Vercel dashboard settings. When the project settings disagree with expectations, `vercel.json` is the truth.
- `pnpm build` = `tsc && vite build`. `tsc` is the type-check gate and `vite build` emits `dist/`, which is served as static files.

## Conventions

### Directory layout

Easy to get wrong when generating new files (also in README "Conventions"):

- **One feature = one directory**: `src/features/<kebab-case>/`. Features must not import each other. To share code, lift it into a top-level layer under `src/` (e.g. `src/components/`, `src/lib/`).
- **The entry file is `<PascalCase>.tsx`** (one file matching the directory name). It is the only public surface referenced from `router.tsx`, e.g. `dashboard/Dashboard.tsx`.
- **In-feature UI parts go in `components/` (plural)**. Never create `component/` (singular).
- **Tests are colocated**: put `*.test.tsx` next to the file under test. Only shared helpers (e.g. `renderWithProviders`) live in `src/test/`.

### TypeScript

`tsconfig.json` enables `strict` plus `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. Unused imports or parameters fail `pnpm build`, so saving half-written code and building often fails. Prefixing with `_` silences it, but delete anything unused instead.

### Environment variables

The app code currently reads none. When adding one:

- Anything exposed to the client **must** have the `VITE_` prefix; Vite exposes nothing else through `import.meta.env`. Never reference secrets from client code.
- `vercel env pull` writes Vercel variables to `.env.local` (gitignored via `*.local`). Commit only `.env.example`.

### Testing

Details in README "Testing Strategy". Minimum bar when adding a feature:

- **Write at least one behavior test for the feature's root component (`<Name>.tsx`).** Coverage percentage is not a goal and low-value tests should not be mass-produced.
- Do not test library behavior (Chakra UI, TanStack Table, etc.).
- `pnpm coverage` is for inspection only and is not a CI gate.
- Behavior over implementation; cover error paths; inject time and randomness so tests stay deterministic.

### Git and pull requests

Solo project: no external contributors are expected, so these rules exist for consistency, not onboarding.

- **Branches**: changes to `main` go through a PR. Name branches `<type>/<short-description>` (e.g. `feat/dashboard-filter`), with `type` matching the commit type.
- **Commits**: Conventional Commits, in English.
  - Types: `feat` / `fix` / `docs` / `test` / `refactor` / `chore` / `ci` / `build`
  - Subject: imperative, lowercase, ≤72 chars, no trailing period
  - Body explains **why**, not what (the diff shows what)
  - Breaking changes: `type!:` plus a `BREAKING CHANGE:` line in the body
  - One purpose per commit
- **Pull requests**: one purpose per PR; title in the same format as a commit subject; description follows `.github/pull_request_template.md` (in Japanese). CI (`pnpm check` and `pnpm test`) must pass before merging.
- **Code comments**: English, and only for **why** and **why not**: non-obvious constraints, workaround reasons, deliberate behavior, and improvements knowingly skipped. Express what the code does through naming and types. `TODO` / `FIXME` carry a reason or issue number; use `FIXME` when knowingly taking on technical debt.

### CI and Dependabot

- CI (`.github/workflows/test.yml`) runs on PRs and on pushes to `main`. It uses `pnpm install --frozen-lockfile`, so **always commit `pnpm-lock.yaml`** when dependencies change.
- `.github/workflows/audit.yml` runs `pnpm audit --audit-level=high` on PRs, pushes to `main`, and weekly.
- Dependabot runs weekly: minor/patch updates are grouped into one PR, majors are excluded. Major upgrades are done by hand, deliberately.
- GitHub Actions are pinned by commit SHA (Dependabot's `github-actions` ecosystem keeps them current). Pin any new action by SHA too.

## Security

- Secrets only via environment variables; the client bundle is public, so nothing secret may carry the `VITE_` prefix.
- This repository is public. Never commit `.env*` (except `.env.example`), tokens, or `.vercel/` contents.
- Run `pnpm audit` regularly (CI does so weekly).
- Vulnerability reports: see `SECURITY.md`. For a code review, use the `security-review` skill in `.claude/skills/`.

## Language

- **Agent-facing files are written in English**: `AGENTS.md`, `CLAUDE.md`, `.claude/` (skills), code comments, and commit messages.
- **Human-facing documents are written in Japanese**: `README.md`, `SECURITY.md`, `.github/pull_request_template.md`, and PR descriptions.
- Replies, plans, and review reports addressed to the maintainer are in Japanese.
