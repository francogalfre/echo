# Overview

Echo is feedback infrastructure for products: a widget and API to collect feedback,
and a dashboard to triage, discuss, and act on it.

The core model is simple — organizations own projects, projects collect feedback.
Everything in the dashboard is scoped to the project you're working in.

## What you can do with Echo

- **Collect** — drop a widget on your site or post to the API directly.
- **Triage** — a shared feedback list and a kanban-style board to track status.
- **Understand** — AI-assisted digests summarize patterns across incoming feedback.
- **Ship as a team** — invite teammates, manage API keys, track usage against your plan.

## Tech stack

- **Next.js** (App Router) for the dashboard
- **Hono** for the API transport layer
- **tRPC** for end-to-end typed procedures
- **Drizzle ORM** + **PostgreSQL** for persistence
- **Better-Auth** for authentication
- **Bun** + **Turborepo** for the monorepo tooling

## Documentation

- [Architecture](./architecture.md) — how the pieces fit together
- [Contributing](./contributing.md) — local setup
