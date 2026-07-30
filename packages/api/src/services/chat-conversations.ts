import type { UIMessage } from "@echo/ai";
import { db } from "@echo/db";
import { chatConversations, chatMessages } from "@echo/db/schema/chat";
import { and, asc, desc, eq, max } from "drizzle-orm";

export type ChatConversationSummary = {
  id: string;
  title: string | null;
  createdAt: Date;
  lastMessageAt: Date;
};

export type ChatMessageRow = {
  id: string;
  role: string;
  parts: UIMessage["parts"];
  seq: number;
  createdAt: Date;
};

export type AppendMessageInput = {
  id: string;
  conversationId: string;
  organizationId: string;
  role: string;
  parts: UIMessage["parts"];
  seq: number;
  inputTokens?: number;
  outputTokens?: number;
};

export async function createConversation(
  organizationId: string,
  userId: string,
): Promise<{ id: string }> {
  const id = crypto.randomUUID();
  await db.insert(chatConversations).values({ id, organizationId, userId });

  return { id };
}

export async function findConversation(
  organizationId: string,
  userId: string,
  conversationId: string,
): Promise<{ id: string } | undefined> {
  return db.query.chatConversations.findFirst({
    where: (c) =>
      and(
        eq(c.id, conversationId),
        eq(c.organizationId, organizationId),
        eq(c.userId, userId),
      ),
    columns: { id: true },
  });
}

export async function listConversations(
  organizationId: string,
  userId: string,
): Promise<ChatConversationSummary[]> {
  return db.query.chatConversations.findMany({
    where: (c) => and(eq(c.organizationId, organizationId), eq(c.userId, userId)),
    orderBy: (c) => [desc(c.lastMessageAt)],
    limit: 30,
  });
}

export async function nextSeq(conversationId: string): Promise<number> {
  const [row] = await db
    .select({ maxSeq: max(chatMessages.seq) })
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId));

  return (row?.maxSeq ?? 0) + 1;
}

export async function listMessages(
  organizationId: string,
  conversationId: string,
): Promise<ChatMessageRow[]> {
  const rows = await db.query.chatMessages.findMany({
    where: (m) =>
      and(eq(m.conversationId, conversationId), eq(m.organizationId, organizationId)),
    orderBy: (m) => [asc(m.seq)],
  });

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: row.parts as UIMessage["parts"],
    seq: row.seq,
    createdAt: row.createdAt,
  }));
}

export async function appendMessage(input: AppendMessageInput): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.insert(chatMessages).values({
      id: input.id,
      conversationId: input.conversationId,
      organizationId: input.organizationId,
      role: input.role,
      parts: input.parts,
      seq: input.seq,
      inputTokens: input.inputTokens ?? 0,
      outputTokens: input.outputTokens ?? 0,
    });

    await tx
      .update(chatConversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(chatConversations.id, input.conversationId));
  });
}
