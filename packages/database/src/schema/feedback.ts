import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organization } from "./auth";

export const feedbackPageConfig = pgTable("feedback_page_config", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" })
    .unique(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  accentColor: text("accent_color").notNull().default("#7C3AED"),
  backgroundColor: text("background_color").notNull().default("#F5F3FF"),
  enableEmail: boolean("enable_email").notNull().default(false),
  enableRating: boolean("enable_rating").notNull().default(false),
  enableCoverBanner: boolean("enable_cover_banner").notNull().default(false),
  coverBannerUrl: text("cover_banner_url"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const feedback = pgTable(
  "feedback",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    content: text("content").notNull(),
    email: text("email"),
    rating: integer("rating"),
    source: text("source").notNull().default("form"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("feedback_org_idx").on(t.organizationId)],
);

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" })
    .unique(),
  publicKey: text("public_key").notNull().unique(),
  secretKeyHash: text("secret_key_hash").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  organization: one(organization, {
    fields: [apiKeys.organizationId],
    references: [organization.id],
  }),
}));

export const feedbackPageConfigRelations = relations(feedbackPageConfig, ({ one }) => ({
  organization: one(organization, {
    fields: [feedbackPageConfig.organizationId],
    references: [organization.id],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  organization: one(organization, {
    fields: [feedback.organizationId],
    references: [organization.id],
  }),
}));
