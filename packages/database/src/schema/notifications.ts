import { desc, relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organization } from "./auth";

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    link: text("link"),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("notifications_org_created_idx").on(t.organizationId, desc(t.createdAt))],
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  organization: one(organization, {
    fields: [notifications.organizationId],
    references: [organization.id],
  }),
}));
