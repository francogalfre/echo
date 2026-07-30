import { desc, relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { organization, user } from "./auth";

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
  showFeedback: boolean("show_feedback").notNull().default(false),
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

    sentiment: text("sentiment"),
    tags: text("tags").array(),
    enrichedAt: timestamp("enriched_at"),

    insight: text("insight"),
    insightAt: timestamp("insight_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("feedback_org_idx").on(t.organizationId),
    index("feedback_org_created_idx").on(t.organizationId, desc(t.createdAt)),
  ],
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull().default("Default"),
    publicKey: text("public_key").notNull().unique(),
    publicKeyHash: text("public_key_hash").notNull(),
    secretKeyHash: text("secret_key_hash").notNull().unique(),
    secretKeyPrefix: text("secret_key_prefix").notNull(),
    scopes: text("scopes").array().notNull().default(["feedback:write"]),
    lastUsedAt: timestamp("last_used_at"),
    expiresAt: timestamp("expires_at"),
    revokedAt: timestamp("revoked_at"),
    createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("api_keys_org_idx").on(t.organizationId),
    uniqueIndex("api_keys_org_name_live_idx")
      .on(t.organizationId, t.name)
      .where(sql`${t.revokedAt} is null`),
    uniqueIndex("api_keys_public_key_hash_idx").on(t.publicKeyHash),
  ],
);

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
