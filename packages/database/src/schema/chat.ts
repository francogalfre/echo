import { desc, relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { organization, user } from "./auth";

export const chatConversations = pgTable(
  "chat_conversations",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  },
  (t) => [
    index("chat_conversations_org_user_last_message_idx").on(
      t.organizationId,
      t.userId,
      desc(t.lastMessageAt),
    ),
  ],
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => chatConversations.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    parts: jsonb("parts").notNull(),
    seq: integer("seq").notNull(),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("chat_messages_conversation_seq_idx").on(t.conversationId, t.seq),
    index("chat_messages_conversation_idx").on(t.conversationId),
  ],
);

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  organization: one(organization, {
    fields: [chatConversations.organizationId],
    references: [organization.id],
  }),
  user: one(user, { fields: [chatConversations.userId], references: [user.id] }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
  organization: one(organization, {
    fields: [chatMessages.organizationId],
    references: [organization.id],
  }),
}));
