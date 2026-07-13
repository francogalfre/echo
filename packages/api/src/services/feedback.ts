import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { and, count, desc, eq, gte, ilike, or, sql, type SQLWrapper } from "drizzle-orm";

export type FeedbackListFilters = {
  sentiment?: "positive" | "neutral" | "negative";
  source?: "api" | "form" | "widget";
  search?: string;
  limit: number;
  offset: number;
};

export type FeedbackSentimentCounts = {
  all: number;
  positive: number;
  neutral: number;
  negative: number;
};

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

function startOfCurrentMonthUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function countFeedbackThisMonth(organizationId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(feedback)
    .where(
      and(
        eq(feedback.organizationId, organizationId),
        gte(feedback.createdAt, startOfCurrentMonthUtc()),
      ),
    );

  return row?.count ?? 0;
}

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

export async function getFeedbackListItemById(
  organizationId: string,
  id: string,
): Promise<FeedbackListItem | null> {
  const row = await db.query.feedback.findFirst({
    where: (f) => and(eq(f.id, id), eq(f.organizationId, organizationId)),
  });
  if (!row) return null;

  return {
    id: row.id,
    name: row.authorName,
    feedback: row.content,
    email: row.email,
    rating: row.rating,
    source: row.source,
    sentiment: row.sentiment,
    tags: row.tags,
    hasInsight: row.insight != null,
    createdAt: row.createdAt,
  };
}

export async function listFeedback(
  organizationId: string,
  options: FeedbackListFilters,
): Promise<FeedbackListItem[]> {
  const conditions: (SQLWrapper | undefined)[] = [
    eq(feedback.organizationId, organizationId),
  ];

  if (options.sentiment) {
    conditions.push(eq(feedback.sentiment, options.sentiment));
  }
  if (options.source) {
    conditions.push(eq(feedback.source, options.source));
  }
  if (options.search) {
    const pattern = `%${options.search}%`;
    conditions.push(
      or(ilike(feedback.authorName, pattern), ilike(feedback.content, pattern)),
    );
  }

  const rows = await db.query.feedback.findMany({
    where: and(...conditions),
    orderBy: [desc(feedback.createdAt)],
    limit: options.limit,
    offset: options.offset,
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

export async function countFeedbackBySentiment(
  organizationId: string,
): Promise<FeedbackSentimentCounts> {
  const [row] = await db
    .select({
      all: count(),
      positive: count(sql`case when ${feedback.sentiment} = 'positive' then 1 end`),
      neutral: count(sql`case when ${feedback.sentiment} = 'neutral' then 1 end`),
      negative: count(sql`case when ${feedback.sentiment} = 'negative' then 1 end`),
    })
    .from(feedback)
    .where(eq(feedback.organizationId, organizationId));

  return (
    row ?? {
      all: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
    }
  );
}
