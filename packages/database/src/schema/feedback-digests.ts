import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organization } from "./auth";

export const feedbackDigests = pgTable(
  "feedback_digests",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    digest: jsonb("digest").notNull(),
    generatedAt: timestamp("generated_at").notNull(),
    feedbackCount: integer("feedback_count").notNull(),
  },
  (table) => [
    index("feedback_digests_org_generated_at_idx").on(
      table.organizationId,
      table.generatedAt,
    ),
  ],
);
