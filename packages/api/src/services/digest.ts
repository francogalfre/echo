import { db } from "@echo/db";
import { feedbackDigests } from "@echo/db/schema/feedback-digests";
import { feedback } from "@echo/db/schema/feedback";
import type { DigestInput, DigestOutput } from "@echo/ai";
import { and, desc, eq, gt } from "drizzle-orm";

export type DigestRecord = {
  digest: DigestOutput;
  generatedAt: Date;
  feedbackCount: number;
};

const FREE_MAX_ITEMS = 100;
const PRO_MAX_ITEMS = 500;

export type DigestHistoryEntry = DigestRecord & { id: string };

const HISTORY_LIMIT = 10;

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

function sampleProportional(items: DigestInput[], max: number): DigestInput[] {
  if (items.length <= max) return items;

  const byTag = new Map<string, DigestInput[]>();
  const untagged: DigestInput[] = [];

  for (const item of items) {
    const tag = item.tags?.[0] ?? null;
    if (!tag) {
      untagged.push(item);
    } else {
      const bucket = byTag.get(tag) ?? [];
      bucket.push(item);
      byTag.set(tag, bucket);
    }
  }

  const buckets = [...byTag.values(), untagged].filter((b) => b.length > 0);
  const perBucket = Math.max(1, Math.floor(max / buckets.length));
  const result: DigestInput[] = [];

  for (const bucket of buckets) {
    const capacity = max - result.length;
    if (capacity <= 0) break;
    result.push(...bucket.slice(0, Math.min(perBucket, capacity)));
  }

  const remaining = max - result.length;
  if (remaining > 0) {
    const used = new Set(result);
    for (const item of items) {
      if (!used.has(item) && result.length < max) result.push(item);
    }
  }

  return result;
}

export async function getFeedbackForDigest(
  organizationId: string,
  isPro: boolean,
): Promise<DigestInput[]> {
  const max = isPro ? PRO_MAX_ITEMS * 4 : FREE_MAX_ITEMS * 2;

  const rows = await db.query.feedback.findMany({
    where: (f) => eq(f.organizationId, organizationId),
    orderBy: [desc(feedback.createdAt)],
    limit: max,
  });

  const inputs: DigestInput[] = rows.map((r) => ({
    content: r.content,
    sentiment: r.sentiment,
    tags: r.tags,
  }));

  return sampleProportional(inputs, isPro ? PRO_MAX_ITEMS : FREE_MAX_ITEMS);
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
