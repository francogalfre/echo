import { db } from "@echo/db";
import { feedbackDigests } from "@echo/db/schema/feedback-digests";
import { feedback } from "@echo/db/schema/feedback";
import type { DigestInput, DigestOutput } from "@echo/ai";
import { and, desc, eq, gt } from "drizzle-orm";

import { sampleProportional } from "../lib/sampling";

export type DigestRecord = {
  digest: DigestOutput;
  generatedAt: Date;
  feedbackCount: number;
};

export type DigestHistoryEntry = DigestRecord & { id: string };

const HISTORY_LIMIT = 10;
const FETCH_MULTIPLIER = 4;

export async function getDigest(organizationId: string): Promise<DigestRecord | null> {
  const row = await db.query.feedbackDigests.findFirst({
    where: (d) => eq(d.organizationId, organizationId),
    orderBy: (d) => [desc(d.generatedAt)],
  });
  if (!row) return null;

  return {
    digest: row.digest as DigestOutput,
    generatedAt: row.generatedAt,
    feedbackCount: row.feedbackCount,
  };
}

export async function listDigests(organizationId: string): Promise<DigestHistoryEntry[]> {
  const rows = await db.query.feedbackDigests.findMany({
    where: (d) => eq(d.organizationId, organizationId),
    orderBy: (d) => [desc(d.generatedAt)],
    limit: HISTORY_LIMIT,
  });

  return rows.map((row) => ({
    id: row.id,
    digest: row.digest as DigestOutput,
    generatedAt: row.generatedAt,
    feedbackCount: row.feedbackCount,
  }));
}

export async function getFeedbackForDigest(
  organizationId: string,
  maxItems: number,
): Promise<DigestInput[]> {
  const rows = await db.query.feedback.findMany({
    where: (f) => eq(f.organizationId, organizationId),
    orderBy: [desc(feedback.createdAt)],
    limit: maxItems * FETCH_MULTIPLIER,
  });

  const inputs: DigestInput[] = rows.map((r) => ({
    content: r.content,
    sentiment: r.sentiment,
    tags: r.tags,
  }));

  return sampleProportional(inputs, maxItems);
}

export async function hasFeedbackSince(
  organizationId: string,
  since: Date,
): Promise<boolean> {
  const row = await db.query.feedback.findFirst({
    where: (f) => and(eq(f.organizationId, organizationId), gt(f.createdAt, since)),
    columns: { id: true },
  });

  return row !== undefined;
}

export async function insertDigest(
  organizationId: string,
  digest: DigestOutput,
  feedbackCount: number,
): Promise<void> {
  await db.insert(feedbackDigests).values({
    id: crypto.randomUUID(),
    organizationId,
    digest,
    generatedAt: new Date(),
    feedbackCount,
  });
}
