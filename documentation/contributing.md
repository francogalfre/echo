# Contributing

## Prerequisites

- [Bun](https://bun.sh)
- A PostgreSQL database

## Setup

```bash
bun install
cp .env.example apps/server/.env   # fill in your own values
bun run db:push
bun run dev
```

The dashboard runs at `http://localhost:3001`, the API at `http://localhost:3000`.

## Before opening a PR

```bash
bun run check:types
bun run check          # lint + format
```

Tests run per package with Vitest:

```bash
cd packages/api && bun run test
```

## Conventions

- One PR per change, small and focused.
- Commit messages describe the _why_, not just the _what_.
- Follow the existing patterns in the package you're touching before introducing new ones.
