<p align="center">
  <img src="assets/echo-avatar.png" width="140" alt="Echo" />
</p>

<h1 align="center">Echo</h1>

<p align="center">Feedback infrastructure for products that ship.</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Hono-E36002?style=flat&logo=hono&logoColor=white" alt="Hono" />
  <img src="https://img.shields.io/badge/tRPC-2596BE?style=flat&logo=trpc&logoColor=white" alt="tRPC" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat&logo=turborepo&logoColor=white" alt="Turborepo" />
</p>

<p align="center">
  <a href="documentation/overview.md">Explore the docs »</a>
</p>

---

Say hi to Echo — the one who listens to what your users are telling you, so you
don't have to dig through scattered messages to find it.

Drop a widget on your site or post to the API, and feedback lands in one place:
triaged on a shared list, tracked on a board, summarized with AI-assisted digests
when patterns start to repeat.

## Documentation

- [Overview](documentation/overview.md) — what Echo does and how it's built
- [Architecture](documentation/architecture.md) — how the pieces fit together
- [Contributing](documentation/contributing.md) — local setup

## Quick start

```bash
bun install
cp .env.example apps/server/.env
bun run db:push
bun run dev
```

See [contributing](documentation/contributing.md) for the full setup.

---

<p align="center">Built with Next.js, Hono, tRPC, and Bun.</p>
