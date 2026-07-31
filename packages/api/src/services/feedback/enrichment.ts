import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { and, eq, isNull, lt } from "drizzle-orm";

export type FeedbackEnrichment = {
  sentiment: string;
  tags: string[];
};

export type UnenrichedFeedback = {
  id: string;
  content: string;
};

export async function setFeedbackEnrichment(
  id: string,
  data: FeedbackEnrichment,
): Promise<void> {
  await db
    .update(feedback)
    .set({ sentiment: data.sentiment, tags: data.tags, enrichedAt: new Date() })
    .where(and(eq(feedback.id, id), isNull(feedback.enrichedAt)));
}

export async function listUnenrichedFeedback(
  olderThan: Date,
  limit: number,
): Promise<UnenrichedFeedback[]> {
  return db
    .select({ id: feedback.id, content: feedback.content })
    .from(feedback)
    .where(and(isNull(feedback.enrichedAt), lt(feedback.createdAt, olderThan)))
    .limit(limit);
}
