-- UNAPPLIED PROPOSAL — not a real migration, not referenced by meta/_journal.json,
-- and drizzle-kit will never pick it up from this "proposals" folder.
--
-- Why this is a proposal and not a shipped migration:
--
-- 1. packages/database/src/index.ts opens a single Drizzle pool authenticated as the
--    app's own Postgres role (DATABASE_URL). Migrations run as that same role, which
--    means it OWNS every table it creates. Table owners bypass RLS by default, so
--    `ENABLE ROW LEVEL SECURITY` alone would be a no-op — every policy below is
--    written assuming `FORCE ROW LEVEL SECURITY` is also applied (included below),
--    which is the only way an owning role is subject to its own policies.
--
-- 2. FORCE ROW LEVEL SECURITY means every policy below evaluates against the GUC
--    `app.current_organization_id`. Nothing in this codebase currently sets that GUC
--    per request — there is no `SET LOCAL app.current_organization_id` anywhere.
--    Applying this migration as-is, today, would make every tenant-scoped query
--    return zero rows for every request (the GUC is always unset), because the
--    policies below do not have a "GUC unset -> allow" fallback. That fallback was
--    deliberately left out: a policy that quietly allows everything when its context
--    is missing is not a policy, it is a false sense of defense-in-depth.
--
-- 3. Setting that GUC per request requires wrapping every request's database access
--    in a transaction that runs `SET LOCAL app.current_organization_id = $1` before
--    any query — plumbing that lives in packages/api/src/context.ts and the
--    `organizationProcedure` middleware in packages/api/src/index.ts (for the tRPC
--    majority of the app), plus the Hono routes in apps/server/src/routes for the
--    handful of REST endpoints. That is a real behavioral change to how every query
--    executes, and it must be applied consistently everywhere or not at all —
--    a request path that forgets to set the GUC would silently see zero rows
--    (with FORCE RLS) rather than silently seeing everything (defense-in-depth
--    failing open), which is the opposite failure mode from what RLS is supposed to
--    prevent, but is just as production-breaking.
--
-- Trusted/background paths (the job worker in apps/server/src/worker.ts, scheduled
-- jobs via packages/api/src/jobs/bootstrap.ts) legitimately need to read/write across
-- organizations and would need a separate bypass path (e.g. a dedicated
-- `app_worker` role exempted from FORCE RLS, or explicit `SET LOCAL` per job to the
-- job's own organizationId) — not modeled here, and another reason this needs a
-- deliberate rollout rather than a single migration.
--
-- To apply this for real: implement the per-request GUC plumbing first (a
-- transaction-scoped `db` wrapper populated via AsyncLocalStorage or equivalent,
-- wired into packages/api/src/context.ts and every Hono route that touches the
-- database directly), verify every request path sets it, decide the worker's bypass
-- strategy, THEN move this file into packages/database/src/migrations/ with the next
-- sequential number and run `bun run db:generate`/`db:migrate` to register it in the
-- journal.

alter table "organization" enable row level security;
alter table "organization" force row level security;

create policy organization_tenant_isolation on "organization"
  using (id = current_setting('app.current_organization_id', true));

alter table "member" enable row level security;
alter table "member" force row level security;

create policy member_tenant_isolation on "member"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "invitation" enable row level security;
alter table "invitation" force row level security;

create policy invitation_tenant_isolation on "invitation"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "feedback" enable row level security;
alter table "feedback" force row level security;

create policy feedback_tenant_isolation on "feedback"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "feedback_page_config" enable row level security;
alter table "feedback_page_config" force row level security;

create policy feedback_page_config_tenant_isolation on "feedback_page_config"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "api_keys" enable row level security;
alter table "api_keys" force row level security;

create policy api_keys_tenant_isolation on "api_keys"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "board_items" enable row level security;
alter table "board_items" force row level security;

create policy board_items_tenant_isolation on "board_items"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "notifications" enable row level security;
alter table "notifications" force row level security;

create policy notifications_tenant_isolation on "notifications"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "chat_conversations" enable row level security;
alter table "chat_conversations" force row level security;

create policy chat_conversations_tenant_isolation on "chat_conversations"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "chat_messages" enable row level security;
alter table "chat_messages" force row level security;

create policy chat_messages_tenant_isolation on "chat_messages"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "ai_usage" enable row level security;
alter table "ai_usage" force row level security;

create policy ai_usage_tenant_isolation on "ai_usage"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "ai_events" enable row level security;
alter table "ai_events" force row level security;

create policy ai_events_tenant_isolation on "ai_events"
  using (organization_id = current_setting('app.current_organization_id', true));

alter table "feedback_digests" enable row level security;
alter table "feedback_digests" force row level security;

create policy feedback_digests_tenant_isolation on "feedback_digests"
  using (organization_id = current_setting('app.current_organization_id', true));

-- "jobs" is intentionally excluded: organization_id is nullable (system-wide jobs
-- exist) and the worker that processes it is a trusted background path that needs
-- cross-tenant visibility to claim work for any organization. RLS on this table
-- requires the separate worker-role/bypass strategy called out above, not a
-- same-shape tenant policy.
