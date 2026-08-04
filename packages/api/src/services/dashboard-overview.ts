import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { and, count, desc, eq, gte, lt, min, sql } from "drizzle-orm";

import { granularityFor, rangeWindow } from "../lib/dates";
import type { SeriesGranularity, StatsRange } from "../types";

export type SentimentCounts = { total: number; positive: number; negative: number };

export type BucketSentimentRow = { bucket: string; sentiment: string | null; n: number };

export type SourceRow = { source: string; n: number };

export type RecentFeedbackRow = {
  id: string;
  authorName: string;
  content: string;
  sentiment: string | null;
  source: string;
  createdAt: Date;
};

export type DashboardRawData = {
  current: SentimentCounts;
  prev: SentimentCounts;
  thisWeek: number;
  prevWeek: number;
  seriesRows: BucketSentimentRow[];
  trendRows: BucketSentimentRow[];
  sourceRows: SourceRow[];
  recentRows: RecentFeedbackRow[];
  earliest: Date | null;
  granularity: SeriesGranularity;
};

const EMPTY_COUNTS: SentimentCounts = { total: 0, positive: 0, negative: 0 };

function sentimentSums(): {
  total: ReturnType<typeof count>;
  positive: ReturnType<typeof sql<number>>;
  negative: ReturnType<typeof sql<number>>;
} {
  return {
    total: count(),
    positive: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${feedback.sentiment} = 'positive' THEN 1 ELSE 0 END), 0) AS INTEGER)`,
    negative: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${feedback.sentiment} = 'negative' THEN 1 ELSE 0 END), 0) AS INTEGER)`,
  };
}

export async function fetchDashboardRawData(
  organizationId: string,
  range: StatsRange,
): Promise<DashboardRawData> {
  const now = new Date();
  const { start, prevStart } = rangeWindow(range, now);
  const granularity = granularityFor(range);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const orgFilter = eq(feedback.organizationId, organizationId);
  const windowFilter = start ? and(orgFilter, gte(feedback.createdAt, start)) : orgFilter;
  const prevWindowFilter =
    start && prevStart
      ? and(orgFilter, gte(feedback.createdAt, prevStart), lt(feedback.createdAt, start))
      : null;
  const bucketExpr =
    granularity === "day"
      ? sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM-DD')`
      : sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM')`;
  const dayBucketExpr = sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM-DD')`;

  const [
    currentRows,
    prevRows,
    weekRows,
    seriesRows,
    trendRows,
    sourceRows,
    recentRows,
    earliestRows,
  ] = await Promise.all([
    db.select(sentimentSums()).from(feedback).where(windowFilter),

    prevWindowFilter
      ? db.select(sentimentSums()).from(feedback).where(prevWindowFilter)
      : Promise.resolve([EMPTY_COUNTS]),

    db
      .select({
        thisWeek: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${feedback.createdAt} >= ${sevenDaysAgo} THEN 1 ELSE 0 END), 0) AS INTEGER)`,
        prevWeek: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${feedback.createdAt} >= ${fourteenDaysAgo} AND ${feedback.createdAt} < ${sevenDaysAgo} THEN 1 ELSE 0 END), 0) AS INTEGER)`,
      })
      .from(feedback)
      .where(and(orgFilter, gte(feedback.createdAt, fourteenDaysAgo))),

    db
      .select({
        bucket: bucketExpr,
        sentiment: feedback.sentiment,
        n: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(feedback)
      .where(windowFilter)
      .groupBy(bucketExpr, feedback.sentiment),

    db
      .select({
        bucket: dayBucketExpr,
        sentiment: feedback.sentiment,
        n: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(feedback)
      .where(windowFilter)
      .groupBy(dayBucketExpr, feedback.sentiment),

    db
      .select({ source: feedback.source, n: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(feedback)
      .where(windowFilter)
      .groupBy(feedback.source),

    db.query.feedback.findMany({
      where: (f) => eq(f.organizationId, organizationId),
      orderBy: [desc(feedback.createdAt)],
      limit: 5,
      columns: {
        id: true,
        authorName: true,
        content: true,
        sentiment: true,
        source: true,
        createdAt: true,
      },
    }),

    range === "all"
      ? db
          .select({ earliest: min(feedback.createdAt) })
          .from(feedback)
          .where(orgFilter)
      : Promise.resolve([{ earliest: null }]),
  ]);

  const { thisWeek = 0, prevWeek = 0 } = weekRows[0] ?? {};

  return {
    current: currentRows[0] ?? EMPTY_COUNTS,
    prev: prevRows[0] ?? EMPTY_COUNTS,
    thisWeek,
    prevWeek,
    seriesRows,
    trendRows,
    sourceRows,
    recentRows,
    earliest: earliestRows[0]?.earliest ?? null,
    granularity,
  };
}
