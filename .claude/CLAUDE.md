# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Detailed coding standards live in `.claude/CLAUDE.md` and `.claude/rules/*.md` (architecture, trpc-api,
react, typescript, database, security, testing) — read those before writing code. This file covers
commands and the big-picture architecture needed to navigate the repo.

## Commands

This is a Bun + Turborepo monorepo. Run everything from the repo root unless noted.

```bash
bun install              # install all workspaces
bun run dev               # start all apps (web :3001, server :3000)
bun run dev:web           # web only
bun run dev:server        # server only

bun run check:types       # turbo check-types across all packages/apps
bun run lint              # oxlint
bun run format             # oxfmt --write
bun run check              # lint + format

bun run db:push            # drizzle-kit push (packages/database)
bun run db:generate        # drizzle-kit generate — migrations, commit the output
bun run db:migrate         # drizzle-kit migrate
bun run db:studio          # drizzle studio
```

Tests run per-package with Vitest (no root test script) — `cd` into the package first:

```bash
cd packages/api && bun run test                       # all tests in packages/api
cd packages/api && bunx vitest run src/path/to.test.ts # single file
cd packages/api && bunx vitest run -t "test name"      # single test by name
```

Packages with tests: `apps/server`, `packages/api`, `packages/ai`, `packages/authentication`, `packages/ui`.
Test files live in `__tests__/` next to the source they cover (see `.claude/rules/testing.md`).

`apps/web` has no `check-types`/test script of its own — type-check it via the root `check:types`.
**Never run `next build` in `apps/web` while `bun dev` is running** — it clobbers the shared `.next`
dev build. Use `tsc`/`check:types` to validate instead, and only build when dev isn't running.

Git hooks (lefthook): pre-commit runs oxlint + oxfmt on staged files; pre-push runs `check:types`.

## Architecture

Echo is multi-tenant feedback infrastructure: `organizations` → `projects` → `feedback`. Note: Better-Auth's
"organization" concept is what the UI surfaces to users as a "project" — one Better-Auth org per Echo project.

### Two backend processes, one API package

- `apps/server` (Hono, port 3000) — transport only. Mounts the Better-Auth handler, the tRPC adapter,
  CORS, rate-limit middleware, and thin Hono routes. **Never imports `@echo/db` or runs queries directly.**
- `apps/web` (Next.js 15 App Router, port 3001) — the dashboard. Talks to the server via tRPC and Better-Auth,
  cross-origin (different ports/hosts even in dev).
- `packages/api` (`@echo/api`) owns all business logic and is the only package with database access, split
  into two layers:
  - `services/` — data access only. One function per query/fetch, no validation, no orchestration.
  - `controllers/` — validates input, authorizes, calls services in order, returns a `Result` type
    (never throws for expected domain failures).
  - `routers/` — tRPC routers, thin transport over controllers.
  - `jobs/` — Postgres-backed job queue (kinds/registry/handlers); `apps/server/src/worker.ts` polls and
    claims jobs, scheduled work runs through `jobs/bootstrap.ts`.

  `packages/api`'s `package.json` `exports` map is deliberately narrow. `apps/web` may only import `.`
  (via tRPC) and `./types` — never `./services/*` or `./controllers/*` directly. `apps/server` may import
  `./controllers/*` and `./jobs/*`, but not `./services/*` (except `./services/jobs`, the queue's
  claim/complete/fail primitives). Full contract in `.claude/rules/architecture.md`.

### Workspace packages

| Package                   | Name           | Purpose                                                                  |
| ------------------------- | -------------- | ------------------------------------------------------------------------ |
| `apps/web`                | `web`          | Next.js dashboard                                                        |
| `apps/server`             | `server`       | Hono host: auth handler, tRPC adapter, routes, job worker                |
| `packages/api`            | `@echo/api`    | tRPC routers, controllers, services, jobs (business logic + data access) |
| `packages/database`       | `@echo/db`     | Drizzle schema (`src/schema/`), migrations, seed/backfill scripts        |
| `packages/authentication` | `@echo/auth`   | Better-Auth config (email/OAuth, Polar billing plugin)                   |
| `packages/ai`             | `@echo/ai`     | Vercel AI SDK agents (e.g. digest generation) via OpenRouter             |
| `packages/ui`             | `@echo/ui`     | Shared shadcn/ui primitives + design tokens (`src/styles/globals.css`)   |
| `packages/environment`    | `@echo/env`    | `@t3-oss/env-nextjs`-validated env vars                                  |
| `packages/configuration`  | `@echo/config` | Shared `tsconfig`/tooling config                                         |
| `packages/assets`         | `@echo/assets` | Static assets                                                            |

### Frontend routing

`apps/web/src/app/dashboard/` follows a co-location rule: every page owns its own `components/`; a
component used by 2+ pages moves up to the nearest shared `components/` folder (never a page-local one).
Route groups (e.g. `dashboard/(overview)/`) exist purely to give a page its own `components/` folder
without changing the URL. Full route map and layout hierarchy in `.claude/rules/architecture.md`.

Any client subtree using nuqs `useQueryState`/`useSearchParams` must be wrapped in `<Suspense>` or
`next build` fails to prerender — `tsc`/oxlint won't catch this.

### Multi-tenancy & auth

- Every query must filter by `organizationId` at the database level — never trust the frontend.
- Tenant isolation today rests entirely on those `organizationId` filters in `packages/api/src/services/*`.
  There is no Postgres RLS in this codebase — no `ENABLE ROW LEVEL SECURITY`, no policies. Enabling it
  correctly needs both `FORCE ROW LEVEL SECURITY` (the app's DB role owns its own tables, so RLS is
  bypassed without it) and per-request `SET LOCAL app.current_organization_id` plumbing that does not
  exist yet. See `packages/database/src/migrations/proposals/rls-tenant-isolation.proposal.sql` for the
  unapplied policy set and what shipping it for real would require.
- Public feedback endpoints (widget/API) use a separate API-key auth layer (secret vs. publishable keys),
  distinct from the Better-Auth session used by the dashboard.
