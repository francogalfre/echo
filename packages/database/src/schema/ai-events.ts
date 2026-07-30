import { desc } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organization } from "./auth";

export const aiEvents = pgTable(
  "ai_events",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    feature: text("feature").notNull(),
    agent: text("agent").notNull(),
    model: text("model").notNull(),
    promptVersion: integer("prompt_version").notNull(),
    cacheHit: boolean("cache_hit").notNull().default(false),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    costMicroUsd: integer("cost_micro_usd").notNull().default(0),
    latencyMs: integer("latency_ms"),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("ai_events_org_created_idx").on(t.organizationId, desc(t.createdAt))],
);
