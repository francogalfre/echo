import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { desc, eq } from "drizzle-orm";

export type InsertFeedback = {
  organizationId: string;
  authorName: string;
  content: string;
  email?: string;
  rating?: number;
  source: string;
};

export type FeedbackListItem = {
  id: string;
  name: string;
  feedback: string;
  email: string | null;
  rating: number | null;
  sentiment: string | null;
  createdAt: Date;
};

export async function insertFeedback(data: InsertFeedback): Promise<string> {
  const id = crypto.randomUUID();
  await db.insert(feedback).values({ id, ...data });

  return id;
}

export async function setFeedbackSentiment(id: string, sentiment: string): Promise<void> {
  await db
    .update(feedback)
    .set({ sentiment, enrichedAt: new Date() })
    .where(eq(feedback.id, id));
}

export async function listFeedback(
  organizationId: string,
  limit = 50,
): Promise<FeedbackListItem[]> {
  const rows = await db.query.feedback.findMany({
    where: (f) => eq(f.organizationId, organizationId),
    orderBy: [desc(feedback.createdAt)],
    limit,
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.authorName,
    feedback: r.content,
    email: r.email,
    rating: r.rating,
    sentiment: r.sentiment,
    createdAt: r.createdAt,
  }));
}
