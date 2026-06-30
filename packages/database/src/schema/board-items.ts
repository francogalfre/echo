import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organization } from "./auth";
import { feedback } from "./feedback";

export const boardItems = pgTable("board_items", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  feedbackId: text("feedback_id")
    .notNull()
    .unique()
    .references(() => feedback.id, { onDelete: "cascade" }),
  column: text("column")
    .notNull()
    .$type<"backlog" | "in_progress" | "done">()
    .default("backlog"),
  position: integer("position").notNull().default(0),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});
