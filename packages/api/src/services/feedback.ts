import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { and, desc, eq } from "drizzle-orm";

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
  source: string;
  sentiment: string | null;
  tags: string[] | null;
  hasInsight: boolean;
  createdAt: Date;
};

export type FeedbackForInsight = {
  id: string;
  content: string;
  rating: number | null;
  sentiment: string | null;
  insight: string | null;
};

export type FeedbackEnrichment = {
  sentiment: string;
  tags: string[];
};

export async function insertFeedback(data: InsertFeedback): Promise<string> {
  const id = crypto.randomUUID();
  await db.insert(feedback).values({ id, ...data });

  return id;
}

export async function setFeedbackEnrichment(
  id: string,
  data: FeedbackEnrichment,
): Promise<void> {
  await db
    .update(feedback)
    .set({ sentiment: data.sentiment, tags: data.tags, enrichedAt: new Date() })
    .where(eq(feedback.id, id));
}

export async function getFeedbackById(
  id: string,
  organizationId: string,
): Promise<FeedbackForInsight | undefined> {
  const row = await db.query.feedback.findFirst({
    where: (f) => and(eq(f.id, id), eq(f.organizationId, organizationId)),
  });
  if (!row) return undefined;

  return {
    id: row.id,
    content: row.content,
    rating: row.rating,
    sentiment: row.sentiment,
    insight: row.insight,
  };
}

export async function setFeedbackInsight(id: string, insight: string): Promise<void> {
  await db
    .update(feedback)
    .set({ insight, insightAt: new Date() })
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
    source: r.source,
    sentiment: r.sentiment,
    tags: r.tags,
    hasInsight: r.insight != null,
    createdAt: r.createdAt,
  }));
}
