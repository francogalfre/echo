# Drizzle ORM Standards

- Always use type inference: `const result = await db.query.projects.findFirst(...)`
- Never write raw SQL unless absolutely necessary
- Use `with: {}` to load relationships, not separate queries
- Migrations are auto-generated — commit them
- Multi-tenancy is enforced today by `organizationId` filters in `packages/api/src/services/*` only —
  there is no Postgres RLS in this repo yet. See
  `packages/database/src/migrations/proposals/rls-tenant-isolation.proposal.sql` for the unapplied
  proposal and the per-request GUC plumbing it depends on before it can ship.
