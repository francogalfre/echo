import { db } from "@echo/db";
import { boardItems } from "@echo/db/schema/board-items";
import { feedback } from "@echo/db/schema/feedback";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  type SQLWrapper,
} from "drizzle-orm";

import type { FeedbackSource, Sentiment } from "../../types";

export type FeedbackListFilters = {
  sentiment?: Sentiment;
  source?: FeedbackSource;
  search?: string;
  limit: number;
  offset: number;
};

export type FeedbackCountFilters = {
  source?: FeedbackSource;
  search?: string;
};

export type FeedbackSentimentCounts = {
  all: number;
  positive: number;
  neutral: number;
  negative: number;
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
  onBoard: boolean;
  createdAt: Date;
};

async function getOnBoardIds(
  organizationId: string,
  feedbackIds: readonly string[],
): Promise<Set<string>> {
  if (feedbackIds.length === 0) return new Set();

  const rows = await db
    .select({ feedbackId: boardItems.feedbackId })
    .from(boardItems)
    .where(
      and(
        eq(boardItems.organizationId, organizationId),
        inArray(boardItems.feedbackId, feedbackIds),
      ),
    );

  return new Set(rows.map((row) => row.feedbackId));
}

export type FeedbackForInsight = {
  id: string;
  content: string;
  rating: number | null;
  sentiment: string | null;
  insight: string | null;
};

export async function countFeedbackTotal(organizationId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(feedback)
    .where(eq(feedback.organizationId, organizationId));

  return row?.count ?? 0;
}

export async function getFeedbackOrganizationId(id: string): Promise<string | undefined> {
  const row = await db.query.feedback.findFirst({
    where: (f) => eq(f.id, id),
    columns: { organizationId: true },
  });

  return row?.organizationId;
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

export async function getFeedbackListItemById(
  organizationId: string,
  id: string,
): Promise<FeedbackListItem | null> {
  const row = await db.query.feedback.findFirst({
    where: (f) => and(eq(f.id, id), eq(f.organizationId, organizationId)),
  });
  if (!row) return null;

  const onBoardIds = await getOnBoardIds(organizationId, [row.id]);

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
    onBoard: onBoardIds.has(row.id),
    createdAt: row.createdAt,
  };
}

function feedbackFilterConditions(
  organizationId: string,
  filters: { sentiment?: Sentiment; source?: FeedbackSource; search?: string },
): SQLWrapper[] {
  const conditions: SQLWrapper[] = [eq(feedback.organizationId, organizationId)];

  if (filters.sentiment) {
    conditions.push(eq(feedback.sentiment, filters.sentiment));
  }
  if (filters.source) {
    conditions.push(eq(feedback.source, filters.source));
  }
  if (filters.search) {
    const pattern = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(feedback.authorName, pattern),
        ilike(feedback.content, pattern),
      ) as SQLWrapper,
    );
  }

  return conditions;
}

export async function listFeedback(
  organizationId: string,
  options: FeedbackListFilters,
): Promise<FeedbackListItem[]> {
  const rows = await db.query.feedback.findMany({
    where: and(...feedbackFilterConditions(organizationId, options)),
    orderBy: [desc(feedback.createdAt)],
    limit: options.limit,
    offset: options.offset,
  });

  const onBoardIds = await getOnBoardIds(
    organizationId,
    rows.map((r) => r.id),
  );

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
    onBoard: onBoardIds.has(r.id),
    createdAt: r.createdAt,
  }));
}

export async function countFeedbackBySentiment(
  organizationId: string,
  filters: FeedbackCountFilters = {},
): Promise<FeedbackSentimentCounts> {
  const [row] = await db
    .select({
      all: count(),
      positive: count(sql`case when ${feedback.sentiment} = 'positive' then 1 end`),
      neutral: count(sql`case when ${feedback.sentiment} = 'neutral' then 1 end`),
      negative: count(sql`case when ${feedback.sentiment} = 'negative' then 1 end`),
    })
    .from(feedback)
    .where(and(...feedbackFilterConditions(organizationId, filters)));

  return (
    row ?? {
      all: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
    }
  );
}
