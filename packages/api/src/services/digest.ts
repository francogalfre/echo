import { db } from "@echo/db";
import { feedbackDigests } from "@echo/db/schema/feedback-digests";
import { feedback } from "@echo/db/schema/feedback";
import type { DigestInput, DigestOutput } from "@echo/ai";
import { and, desc, eq, gte } from "drizzle-orm";

export type DigestRecord = {
  digest: DigestOutput;
  generatedAt: Date;
  feedbackCount: number;
};

export async function getDigest(organizationId: string): Promise<DigestRecord | null> {
  const row = await db.query.feedbackDigests.findFirst({
    where: (d) => eq(d.organizationId, organizationId),
  });
  if (!row) return null;

  return {
    digest: row.digest as DigestOutput,
    generatedAt: row.generatedAt,
    feedbackCount: row.feedbackCount,
  };
}

export async function getFeedbackForDigest(
  organizationId: string,
  since: Date,
  limit = 100,
): Promise<DigestInput[]> {
  const rows = await db.query.feedback.findMany({
    where: (f) => and(eq(f.organizationId, organizationId), gte(f.createdAt, since)),
    orderBy: [desc(feedback.createdAt)],
    limit,
  });

  return rows.map((r) => ({
    content: r.content,
    sentiment: r.sentiment,
    tags: r.tags,
  }));
}

export async function upsertDigest(
  organizationId: string,
  digest: DigestOutput,
  feedbackCount: number,
): Promise<void> {
  const existing = await db.query.feedbackDigests.findFirst({
    where: (d) => eq(d.organizationId, organizationId),
  });

  if (existing) {
    await db
      .update(feedbackDigests)
      .set({ digest, generatedAt: new Date(), feedbackCount })
      .where(eq(feedbackDigests.organizationId, organizationId));
  } else {
    await db.insert(feedbackDigests).values({
      id: crypto.randomUUID(),
      organizationId,
      digest,
      generatedAt: new Date(),
      feedbackCount,
    });
  }
}
