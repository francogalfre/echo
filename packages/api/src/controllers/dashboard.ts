import {
  bucketKeys,
  dayKeysBetween,
  growthPercent,
  monthKey,
  rangeWindow,
  zeroFillSeries,
} from "../lib/dates";
import { fetchDashboardRawData } from "../services/dashboard-overview";
import {
  FEEDBACK_SOURCE_VALUES,
  type DashboardOverview,
  type SourceCount,
  type StatsRange,
} from "../types";

export async function getDashboardOverview(
  organizationId: string,
  range: StatsRange,
): Promise<DashboardOverview> {
  const now = new Date();
  const raw = await fetchDashboardRawData(organizationId, range);

  const keys = bucketKeys(range, now, raw.earliest ? monthKey(raw.earliest) : undefined);
  const { start } = rangeWindow(range, now);
  const trendKeys = dayKeysBetween(start ?? raw.earliest ?? now, now);

  const sourceMap = new Map(raw.sourceRows.map((row) => [row.source, row.n]));
  const sources: SourceCount[] = FEEDBACK_SOURCE_VALUES.map((source) => ({
    source,
    count: sourceMap.get(source) ?? 0,
  })).sort((a, b) => b.count - a.count);

  return {
    metrics: {
      total: {
        value: raw.current.total,
        growth: growthPercent(raw.current.total, raw.prev.total),
      },
      positive: {
        value: raw.current.positive,
        growth: growthPercent(raw.current.positive, raw.prev.positive),
      },
      negative: {
        value: raw.current.negative,
        growth: growthPercent(raw.current.negative, raw.prev.negative),
      },
      thisWeek: {
        value: raw.thisWeek,
        growth: growthPercent(raw.thisWeek, raw.prevWeek),
      },
    },
    granularity: raw.granularity,
    series: zeroFillSeries(keys, raw.seriesRows),
    trend: zeroFillSeries(trendKeys, raw.trendRows),
    sources,
    recent: raw.recentRows.map((row) => ({
      id: row.id,
      name: row.authorName,
      content: row.content,
      sentiment: row.sentiment,
      source: row.source,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}
