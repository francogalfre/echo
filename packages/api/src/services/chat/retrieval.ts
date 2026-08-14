import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { and, desc, eq, gte, inArray, or, sql } from "drizzle-orm";

import { sinceFor } from "../../lib/dates";

export type FeedbackSearchRow = {
  id: string;
  content: string;
  sentiment: string | null;
  tags: string[] | null;
  createdAt: Date;
};

export type FeedbackSeriesRow = {
  period: string;
  total: number;
  positive: number;
  negative: number;
};

export async function searchFeedbackFts(
  organizationId: string,
  query: string | null,
  limit: number,
  sentiment: string | null,
): Promise<readonly FeedbackSearchRow[]> {
  if (!query) {
    return db
      .select({
        id: feedback.id,
        content: feedback.content,
        sentiment: feedback.sentiment,
        tags: feedback.tags,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .where(
        and(
          eq(feedback.organizationId, organizationId),
          sentiment ? eq(feedback.sentiment, sentiment) : undefined,
        ),
      )
      .orderBy(desc(feedback.createdAt))
      .limit(limit);
  }

  const scoreExpr = sql`
    ts_rank_cd(to_tsvector('english', ${feedback.content}), websearch_to_tsquery('english', ${query})) * 0.7
    + similarity(${feedback.content}, ${query}) * 0.3
  `;

  return db
    .select({
      id: feedback.id,
      content: feedback.content,
      sentiment: feedback.sentiment,
      tags: feedback.tags,
      createdAt: feedback.createdAt,
    })
    .from(feedback)
    .where(
      and(
        eq(feedback.organizationId, organizationId),
        sentiment ? eq(feedback.sentiment, sentiment) : undefined,
        or(
          sql`to_tsvector('english', ${feedback.content}) @@ websearch_to_tsquery('english', ${query})`,
          sql`${feedback.content} % ${query}`,
        ),
      ),
    )
    .orderBy(desc(scoreExpr))
    .limit(limit);
}

export async function countFeedbackSentiment(
  organizationId: string,
): Promise<readonly { sentiment: string | null; count: number }[]> {
  return db
    .select({
      sentiment: feedback.sentiment,
      count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
    })
    .from(feedback)
    .where(eq(feedback.organizationId, organizationId))
    .groupBy(feedback.sentiment);
}

export async function countFeedbackByTag(
  organizationId: string,
  sentiment: string | null,
): Promise<readonly { tag: string; count: number }[]> {
  const result = await db.execute<{ tag: string; count: number }>(sql`
    SELECT tag, CAST(COUNT(*) AS INTEGER) AS count
    FROM feedback, unnest(tags) AS tag
    WHERE organization_id = ${organizationId}
      AND (${sentiment}::text IS NULL OR sentiment = ${sentiment})
    GROUP BY tag
    ORDER BY count DESC
    LIMIT 20
  `);

  return result.rows;
}

export async function listFeedbackByIds(
  organizationId: string,
  ids: readonly string[],
): Promise<readonly FeedbackSearchRow[]> {
  if (ids.length === 0) return [];

  return db
    .select({
      id: feedback.id,
      content: feedback.content,
      sentiment: feedback.sentiment,
      tags: feedback.tags,
      createdAt: feedback.createdAt,
    })
    .from(feedback)
    .where(
      and(eq(feedback.organizationId, organizationId), inArray(feedback.id, [...ids])),
    );
}

export async function feedbackTimeSeries(
  organizationId: string,
  bucket: "day" | "week" | "month",
  limit: number,
): Promise<readonly FeedbackSeriesRow[]> {
  const bucketExpr =
    bucket === "day"
      ? sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM-DD')`
      : bucket === "week"
        ? sql<string>`TO_CHAR(DATE_TRUNC('week', ${feedback.createdAt}), 'YYYY-MM-DD')`
        : sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM')`;

  const rows = await db
    .select({
      period: bucketExpr,
      total: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      positive: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${feedback.sentiment} = 'positive' THEN 1 ELSE 0 END), 0) AS INTEGER)`,
      negative: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${feedback.sentiment} = 'negative' THEN 1 ELSE 0 END), 0) AS INTEGER)`,
    })
    .from(feedback)
    .where(
      and(
        eq(feedback.organizationId, organizationId),
        gte(feedback.createdAt, sinceFor(bucket, limit)),
      ),
    )
    .groupBy(bucketExpr)
    .orderBy(bucketExpr);

  return rows;
}
