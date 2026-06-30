import { db } from "@echo/db";
import { feedback } from "@echo/db/schema/feedback";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";

export type SentimentBreakdown = {
  positive: number;
  negative: number;
  neutral: number;
  none: number;
};

export type RecentItem = {
  id: string;
  name: string;
  content: string;
  sentiment: string | null;
  source: string;
  createdAt: string;
};

export type DashboardStats = {
  total: number;
  positive: number;
  thisWeek: number;
  activityGrowth: number | null;
  positiveGrowth: number | null;
  breakdown: SentimentBreakdown;
  sparkline: number[];
  recent: RecentItem[];
};

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function growth(current: number, prev: number): number | null {
  if (prev === 0) return null;
  return Math.round(((current - prev) / prev) * 100);
}

export async function getDashboardStats(organizationId: string): Promise<DashboardStats> {
  const sevenDaysAgo = daysAgo(7);
  const fourteenDaysAgo = daysAgo(14);

  const [totals, period, sentimentRows, sparklineRows, recentRows] = await Promise.all([
    db
      .select({
        total: count(),
        positive: sql<number>`CAST(SUM(CASE WHEN ${feedback.sentiment} = 'positive' THEN 1 ELSE 0 END) AS INTEGER)`,
      })
      .from(feedback)
      .where(eq(feedback.organizationId, organizationId)),

    db
      .select({
        thisWeek: sql<number>`CAST(SUM(CASE WHEN ${feedback.createdAt} >= ${sevenDaysAgo} THEN 1 ELSE 0 END) AS INTEGER)`,
        prevWeek: sql<number>`CAST(SUM(CASE WHEN ${feedback.createdAt} >= ${fourteenDaysAgo} AND ${feedback.createdAt} < ${sevenDaysAgo} THEN 1 ELSE 0 END) AS INTEGER)`,
        thisWeekPos: sql<number>`CAST(SUM(CASE WHEN ${feedback.createdAt} >= ${sevenDaysAgo} AND ${feedback.sentiment} = 'positive' THEN 1 ELSE 0 END) AS INTEGER)`,
        prevWeekPos: sql<number>`CAST(SUM(CASE WHEN ${feedback.createdAt} >= ${fourteenDaysAgo} AND ${feedback.createdAt} < ${sevenDaysAgo} AND ${feedback.sentiment} = 'positive' THEN 1 ELSE 0 END) AS INTEGER)`,
      })
      .from(feedback)
      .where(
        and(
          eq(feedback.organizationId, organizationId),
          gte(feedback.createdAt, fourteenDaysAgo),
        ),
      ),

    db
      .select({ sentiment: feedback.sentiment, n: count() })
      .from(feedback)
      .where(eq(feedback.organizationId, organizationId))
      .groupBy(feedback.sentiment),

    db
      .select({
        day: sql<string>`DATE(${feedback.createdAt})`,
        n: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(feedback)
      .where(
        and(
          eq(feedback.organizationId, organizationId),
          gte(feedback.createdAt, sevenDaysAgo),
        ),
      )
      .groupBy(sql`DATE(${feedback.createdAt})`)
      .orderBy(sql`DATE(${feedback.createdAt})`),

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
  ]);

  const { total = 0, positive = 0 } = totals[0] ?? {};
  const { thisWeek = 0, prevWeek = 0, thisWeekPos = 0, prevWeekPos = 0 } = period[0] ?? {};

  const breakdown: SentimentBreakdown = { positive: 0, negative: 0, neutral: 0, none: 0 };
  for (const row of sentimentRows) {
    const key = (row.sentiment ?? "none") as keyof SentimentBreakdown;
    breakdown[key in breakdown ? key : "none"] += row.n;
  }

  const dayMap = new Map(sparklineRows.map((r) => [r.day, r.n]));
  const sparkline = Array.from({ length: 7 }, (_, i) => {
    const d = daysAgo(6 - i)
      .toISOString()
      .slice(0, 10);
    return dayMap.get(d) ?? 0;
  });

  return {
    total,
    positive,
    thisWeek,
    activityGrowth: growth(thisWeek, prevWeek),
    positiveGrowth: growth(thisWeekPos, prevWeekPos),
    breakdown,
    sparkline,
    recent: recentRows.map((r) => ({
      id: r.id,
      name: r.authorName,
      content: r.content,
      sentiment: r.sentiment,
      source: r.source,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}
