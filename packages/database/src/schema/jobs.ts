import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { organization } from "./auth";

export const jobs = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "cascade",
    }),
    kind: text("kind").notNull(),
    payload: jsonb("payload").notNull().default({}),
    dedupeKey: text("dedupe_key"),
    status: text("status")
      .notNull()
      .$type<"pending" | "running" | "completed" | "dead">()
      .default("pending"),
    priority: integer("priority").notNull().default(100),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    runAt: timestamp("run_at", { withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    lockedBy: text("locked_by"),
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("jobs_kind_dedupe_key_idx")
      .on(t.kind, t.dedupeKey)
      .where(sql`${t.dedupeKey} is not null and ${t.status} in ('pending', 'running')`),
    index("jobs_claim_idx")
      .on(t.priority, t.runAt)
      .where(sql`${t.status} = 'pending'`),
    index("jobs_locked_at_idx")
      .on(t.lockedAt)
      .where(sql`${t.status} = 'running'`),
    index("jobs_organization_id_idx").on(t.organizationId),
  ],
);

export const jobSchedules = pgTable("job_schedules", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull().unique(),
  payload: jsonb("payload").notNull().default({}),
  intervalSeconds: integer("interval_seconds").notNull(),
  nextRunAt: timestamp("next_run_at", { withTimezone: true }).notNull(),
  enabled: boolean("enabled").notNull().default(true),
});
