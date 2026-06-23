import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";

type InsertFeedback = {
  organizationId: string;
  authorName: string;
  content: string;
  email?: string;
  rating?: number;
  source: string;
};

export async function insertFeedback(data: InsertFeedback): Promise<void> {
  await db.insert(feedback).values({ id: crypto.randomUUID(), ...data });
}
