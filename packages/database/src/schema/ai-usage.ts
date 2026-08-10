import { integer, pgTable, text, unique } from "drizzle-orm/pg-core";

import { organization } from "./auth";

export const aiUsage = pgTable(
  "ai_usage",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    feature: text("feature").notNull(),
    day: text("day").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [unique("ai_usage_org_feature_day").on(t.organizationId, t.feature, t.day)],
);
