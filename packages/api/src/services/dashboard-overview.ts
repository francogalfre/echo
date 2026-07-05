import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { and, count, desc, eq, gte, lt, min, sql } from "drizzle-orm";

import {
  bucketKeys,
  granularityFor,
  growthPercent,
  monthKey,
  rangeWindow,
  zeroFillSeries,
  type SeriesGranularity,
  type SeriesPoint,
  type StatsRange,
} from "../lib/dashboard-range";

export type { SeriesGranularity, SeriesPoint, StatsRange } from "../lib/dashboard-range";

export type MetricValue = { value: number; growth: number | null };
export type FeedbackSource = "api" | "form" | "widget";
export type SourceCount = { source: FeedbackSource; count: number };
export type OverviewRecentItem = {
  id: string;
  name: string;
  content: string;
  sentiment: string | null;
  source: string;
  createdAt: string;
};

export type DashboardOverview = {
  metrics: {
    total: MetricValue;
    positive: MetricValue;
    negative: MetricValue;
    thisWeek: MetricValue;
  };
  granularity: SeriesGranularity;
  series: SeriesPoint[];
  trend: SeriesPoint[];
  sources: SourceCount[];
  recent: OverviewRecentItem[];
};

const SOURCES = ["api", "form", "widget"] as const;

type SentimentCounts = { total: number; positive: number; negative: number };

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

export async function getDashboardOverview(
  organizationId: string,
  range: StatsRange,
): Promise<DashboardOverview> {
  const now = new Date();
  const { start } = rangeWindow(range, now);
  const granularity = granularityFor(range);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const orgFilter = eq(feedback.organizationId, organizationId);
  const windowFilter = start ? and(orgFilter, gte(feedback.createdAt, start)) : orgFilter;
  const bucketExpr =
    granularity === "day"
      ? sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM-DD')`
      : sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM')`;
  const trendBucketExpr = sql<string>`TO_CHAR(${feedback.createdAt}, 'YYYY-MM-DD')`;

  const [
    allTimeRows,
    last30Rows,
    prev30Rows,
    trendRows,
    weekRows,
    seriesRows,
    sourceRows,
    recentRows,
    earliestRows,
  ] = await Promise.all([
    db.select(sentimentSums()).from(feedback).where(orgFilter),

    db
      .select(sentimentSums())
      .from(feedback)
      .where(and(orgFilter, gte(feedback.createdAt, thirtyDaysAgo))),

    db
      .select(sentimentSums())
      .from(feedback)
      .where(
        and(
          orgFilter,
          gte(feedback.createdAt, sixtyDaysAgo),
          lt(feedback.createdAt, thirtyDaysAgo),
        ),
      ),

    db
      .select({
        bucket: trendBucketExpr,
        sentiment: feedback.sentiment,
        n: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(feedback)
      .where(and(orgFilter, gte(feedback.createdAt, thirtyDaysAgo)))
      .groupBy(trendBucketExpr, feedback.sentiment),

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

  const allTime = allTimeRows[0] ?? EMPTY_COUNTS;
  const last30 = last30Rows[0] ?? EMPTY_COUNTS;
  const prev30 = prev30Rows[0] ?? EMPTY_COUNTS;
  const { thisWeek = 0, prevWeek = 0 } = weekRows[0] ?? {};

  const earliestDate = earliestRows[0]?.earliest ?? null;
  const keys = bucketKeys(range, now, earliestDate ? monthKey(earliestDate) : undefined);
  const trendKeys = bucketKeys("30d", now);

  const sourceMap = new Map(sourceRows.map((row) => [row.source, row.n]));
  const sources = SOURCES.map((source) => ({
    source,
    count: sourceMap.get(source) ?? 0,
  })).sort((a, b) => b.count - a.count);

  return {
    metrics: {
      total: {
        value: allTime.total,
        growth: growthPercent(last30.total, prev30.total),
      },
      positive: {
        value: allTime.positive,
        growth: growthPercent(last30.positive, prev30.positive),
      },
      negative: {
        value: allTime.negative,
        growth: growthPercent(last30.negative, prev30.negative),
      },
      thisWeek: { value: thisWeek, growth: growthPercent(thisWeek, prevWeek) },
    },
    granularity,
    series: zeroFillSeries(keys, seriesRows),
    trend: zeroFillSeries(trendKeys, trendRows),
    sources,
    recent: recentRows.map((row) => ({
      id: row.id,
      name: row.authorName,
      content: row.content,
      sentiment: row.sentiment,
      source: row.source,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}
