import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organization } from "./auth";

export const feedbackDigests = pgTable("feedback_digests", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .unique()
    .references(() => organization.id, { onDelete: "cascade" }),
  digest: jsonb("digest").notNull(),
  generatedAt: timestamp("generated_at").notNull(),
  feedbackCount: integer("feedback_count").notNull(),
});
