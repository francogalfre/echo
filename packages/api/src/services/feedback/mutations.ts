import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { eq } from "drizzle-orm";

export type InsertFeedback = {
  organizationId: string;
  authorName: string;
  content: string;
  email?: string;
  rating?: number;
  source: string;
};

export async function insertFeedback(data: InsertFeedback): Promise<string> {
  const id = crypto.randomUUID();
  await db.insert(feedback).values({ id, ...data });

  return id;
}

export async function setFeedbackInsight(id: string, insight: string): Promise<void> {
  await db
    .update(feedback)
    .set({ insight, insightAt: new Date() })
    .where(eq(feedback.id, id));
}
