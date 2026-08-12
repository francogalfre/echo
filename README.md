<img src="assets/echo-avatar.png" width="100%" alt="Echo" />

<h1 align="center">Echo</h1>

<p align="center">Feedback infrastructure for products that ship.</p>

<p align="center">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/hono-%23E36002.svg?style=for-the-badge&logo=hono&logoColor=white" alt="Hono" />
  <img src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC" />
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TurboRepo-%23000000.svg?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
</p>

<p align="center">
  <a href="documentation/overview.md"><strong>Explore the docs »</strong></a>
</p>

---

Say hi to Echo — the one who listens to what your users are telling you, so
you don't have to dig through scattered messages to find it.

Drop a widget on your site or post to the API, and feedback lands in one
place: triaged on a shared list, tracked on a board, summarized with
AI-assisted digests when patterns start to repeat.

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
