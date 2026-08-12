# Architecture

Echo is a Bun + Turborepo monorepo split into two backend processes and one shared
API package.

```
apps/web/         Next.js dashboard (talks to the server over tRPC + Better-Auth)
apps/server/       Hono host — transport only, no direct database access
packages/api/       tRPC routers, controllers, services, jobs (business logic)
packages/database/   Drizzle schema and migrations
packages/authentication/  Better-Auth configuration
packages/ai/          AI-assisted digest generation
packages/ui/           Shared UI primitives
```

## Layering

`packages/api` is the only package that talks to the database, split into two
layers:

- **services/** — data access only, one function per query.
- **controllers/** — validation, authorization, and orchestration; calls services
  and returns a typed result.

`apps/server` mounts the tRPC adapter, the auth handler, and a few public routes
for the feedback widget/API. It never queries the database directly.

## Data model

Organizations own projects; projects collect feedback. Every dashboard view is
scoped to a project, and every query is scoped to the organization that owns it.

## Background jobs

Longer-running work (like digest generation) runs through a Postgres-backed job
queue, polled by a worker process.
