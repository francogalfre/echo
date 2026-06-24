import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { desc, eq } from "drizzle-orm";

type InsertFeedback = {
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
  createdAt: Date;
};

export async function insertFeedback(data: InsertFeedback): Promise<void> {
  await db.insert(feedback).values({ id: crypto.randomUUID(), ...data });
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
    createdAt: r.createdAt,
  }));
}
