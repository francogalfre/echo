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
  <feature>.ts        # thin Hono route: auth, parse input, call a controller

packages/api/src/
  index.ts            # tRPC init (procedures)
  context.ts          # tRPC context
  routers/            # tRPC routers (transport for JSON-RPC procedures)
  controllers/        # business logic / orchestration, returns Result
  services/           # data access only — the only place touching @echo/db
```

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
