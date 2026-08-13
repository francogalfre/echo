# Backend Architecture & Layering

Echo splits backend responsibilities across `apps/server` and `packages/api`.

## The rule

**All database and storage logic lives in `packages/api`, never in `apps/server`.**

- `apps/server` is the Hono host. It owns transport only: CORS, logging, auth
  handler mounting, tRPC adapter, route wiring, request parsing, and mapping
  results to HTTP status codes. It must not import `@echo/db` or run Drizzle
  queries, Supabase fetches, or any persistence logic.
- `packages/api` owns everything else, split into two layers:
  - `services/` — the only place that imports `@echo/db`, builds Drizzle queries,
    and performs storage/network fetches. Data access **only**: one function per
    query/fetch, no validation, no business decisions, no env reads.
  - `controllers/` — business logic and orchestration: validate input, authorize,
    read config, call services in sequence, return a `Result`.

## Layout

```
apps/server/src/
  index.ts            # Hono app: middleware, mounts auth/tRPC/routes
  routes/<feature>.ts # thin Hono route: auth, parse input, call a controller
  middleware/         # CORS, auth, rate-limit
  lib/                # transport-only helpers (submit/upload handler factories)

packages/api/src/
  index.ts            # tRPC init (procedures)
  context.ts          # tRPC context
  types.ts            # cross-cutting Result/domain types re-exported to apps/*
  routers/            # tRPC routers (transport for JSON-RPC procedures)
  controllers/         # business logic / orchestration, returns Result
  services/            # data access only — the only place touching @echo/db
  lib/                 # shared helpers: plan, dates, crypto, sampling, rate-limit
  jobs/                 # job kinds/registry/handlers for the Postgres queue
```

`packages/api/package.json`'s `exports` map is intentionally narrow: `.`, `./context`,
`./types`, `./routers/index`, `./lib/redis`, `./schemas`, `./controllers/*`, `./jobs/*`,
`./services/jobs`. `apps/web` may only import `.` (via tRPC) and `./types` — never
`./services/*` or `./controllers/*` directly, since those are `apps/server`'s privilege as
the layer that actually calls controllers. `apps/server` may import `./controllers/*` and
`./jobs/*` (that's the whole point of the transport/controller split) but never
`./services/*` except `./services/jobs` (the job-queue claim/complete/fail primitives,
treated as infrastructure plumbing rather than a business-logic service).

## Service contract (data access only)

- A service function does exactly one thing: run a query or perform a fetch.
- It receives primitive args (ids, urls, bytes), returns rows / the raw `Response`
  / `void`. No validation, no status codes, no env access, no orchestration.
- Config (credentials, urls) is injected by the controller, never read here.

## Controller contract (business logic)

- Receives already-parsed, primitive inputs plus the authenticated `userId` —
  never the raw `Request` or Hono `Context`.
- Validates input, enforces authorization (e.g. organization membership), reads
  config, and calls services in order.
- Returns a discriminated `Result` the caller maps to a response:
  `{ success: true; ... } | { success: false; status; error }`. It does not throw
  for expected domain failures.

## Router / route contract (transport)

A Hono route in `apps/server` (or a tRPC procedure) does exactly: authenticate →
parse the request → call a controller → translate the `Result` to a response
(`c.json(..., status)`). Nothing more.

---

# Frontend Architecture (Next.js App Router)

## Route Map

| URL                           | File                                         | Purpose                           |
| ----------------------------- | -------------------------------------------- | --------------------------------- |
| `/`                           | `(marketing)/(landing)/page.tsx`             | Landing page                      |
| `/docs`                       | `(marketing)/docs/`                          | Public docs (3-column shell)      |
| `/login`                      | `(authentication)/login/page.tsx`            | Authentication                    |
| `/register`                   | `(authentication)/register/page.tsx`         | Authentication                    |
| `/onboarding`                 | `(onboarding)/onboarding/page.tsx`           | Create first org (post-auth gate) |
| `/dashboard`                  | `dashboard/(overview)/page.tsx`              | Home: stats, recent feedback      |
| `/dashboard/feedback`         | `dashboard/feedback/page.tsx`                | Feedback list                     |
| `/dashboard/feedback/[id]`    | `dashboard/feedback/[id]/page.tsx`           | Feedback detail                   |
| `/dashboard/board`            | `dashboard/board/page.tsx`                   | Board                             |
| `/dashboard/collect`          | `dashboard/collect/page.tsx`                 | Collect index                     |
| `/dashboard/collect/api`      | `dashboard/collect/api/page.tsx`             | API keys + docs                   |
| `/dashboard/collect/widget`   | `dashboard/collect/widget/page.tsx`          | Widget install                    |
| `/dashboard/settings`         | `dashboard/settings/page.tsx`                | Redirect → `/settings/account`    |
| `/dashboard/settings/account` | `dashboard/settings/account/page.tsx`        | Profile, appearance, danger zone  |
| `/dashboard/settings/team`    | `dashboard/settings/team/page.tsx`           | Members + projects                |
| `/dashboard/settings/billing` | `dashboard/settings/billing/page.tsx`        | Plan, usage, invoices             |
| `/dashboard/team/*`           | `dashboard/team/{members,projects}/page.tsx` | Legacy redirects → settings/team  |

Settings is **routes, not tabs** — each tab is a real page sharing `settings/layout.tsx`.

## Folder Structure

```
apps/web/src/app/
├── layout.tsx                          # Root: fonts, <Toaster />, providers
├── {favicon.ico,manifest.ts,robots.ts,sitemap.ts,
│   opengraph-image.tsx,twitter-image.tsx,apple-icon.tsx}
│                                       # Next.js file conventions — MUST stay at app root.
│                                       # Moving them breaks /robots.txt, /sitemap.xml, etc.
│                                       # Their logic lives in src/lib/seo/.
├── llms.txt/route.ts                   # GEO: LLM-readable product summary
├── (marketing)/                        # landing + docs/ + legal/
│   └── (landing)/                      # `/` — page.tsx, layout.tsx (nav+footer),
│                                       # components/ (nav, footer, section) and
│                                       # components/blocks/ (hero, features, pricing…)
├── (authentication)/                   # login, register
├── (onboarding)/onboarding/
└── dashboard/
    ├── layout.tsx                      # Sidebar shell + auth/org guard
    ├── components/                     # SHARED dashboard-wide ONLY
    │   ├── page-container, page-header, motion-provider
    │   ├── feedback-badges, upgrade-dialog, create-project-modal
    │   ├── digest-modal                # used by feedback AND overview
    │   ├── sidebar/  topbar/
    ├── hooks/                          # use-billing-overview, use-digest
    ├── (overview)/                     # route group → still serves /dashboard
    │   ├── page.tsx
    │   └── components/                 # home-only: metric-*, sources-card,
    │                                   # onboarding-checklist, how-echo-works…
    ├── feedback/   { page, components/, hooks/, utils/, [id]/ }
    ├── board/      { page, components/ }
    ├── collect/    { page, components/, api/, widget/, feedback-page/ }
    └── settings/
        ├── layout.tsx  page.tsx (redirect)
        ├── components/                 # SHARED settings only:
        │                               # settings-card, settings-nav, settings-row
        ├── account/{page.tsx, components/}
        ├── billing/{page.tsx, components/}
        └── team/{page.tsx, components/}
```

## Component Co-location Rule

- **Every page owns a `components/` folder.** Components used by one page live there.
- A component shared by 2+ pages moves UP to the nearest shared `components/` folder
  (e.g. `settings/components/` for settings-wide, `dashboard/components/` for
  dashboard-wide). Never leave a shared component inside one page's folder.
- Use route groups `(name)/` to give a page its own `components/` folder without
  changing the URL — that is why `/dashboard` lives in `dashboard/(overview)/`.
- Global UI primitives (Button, Input, Card) live in `packages/ui`.
- Never create a global `components/` folder at `src/` level for dashboard features.

## Suspense Rule (production-build blocker)

Any page whose client tree calls nuqs `useQueryState` / `useSearchParams` **must** wrap
that subtree in `<Suspense>`, or `next build` fails to prerender the route. `tsc` and
`oxlint` will NOT catch this. Always run `cd apps/web && bunx next build` before claiming
a change is deploy-ready.

## Layout Hierarchy

```
Root layout (fonts, Toaster)
├── (marketing) — no extra layout
├── (auth)/layout.tsx — centered shell + echo logotype
├── (onboarding)/layout.tsx — centered shell + ambient glow (must NOT wrap marketing)
└── dashboard/layout.tsx — sidebar + main content area
```

## Rendering Strategy

- Pages are **Server Components** by default.
- `'use client'` only at leaf components (forms, interactive controls).
- Auth guard lives in `dashboard/layout.tsx` via a client wrapper: no session → `/login`, no orgs → `/onboarding`.
- Data fetching happens at the page level; components receive typed props.
