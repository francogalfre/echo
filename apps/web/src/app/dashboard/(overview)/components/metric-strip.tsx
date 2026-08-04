"use client";

import type { DashboardOverview, SeriesPoint } from "@echo/api/types";

import { MetricCard } from "./metric-card";

type MetricStripProps = {
  metrics: DashboardOverview["metrics"];
  trend: SeriesPoint[];
};

function isZeroPoint(point: SeriesPoint): boolean {
  return point.positive === 0 && point.neutral === 0 && point.negative === 0;
}

function trimFlatEdges(trend: readonly SeriesPoint[]): readonly SeriesPoint[] {
  let start = 0;
  let end = trend.length - 1;
  while (start < end && isZeroPoint(trend[start] as SeriesPoint)) start += 1;
  while (end > start && isZeroPoint(trend[end] as SeriesPoint)) end -= 1;
  return trend.slice(start, end + 1);
}

function smooth(values: readonly number[]): number[] {
  const window = Math.min(values.length, Math.max(3, Math.round(values.length / 10)));
  const half = Math.floor(window / 2);
  return values.map((_, i) => {
    let sum = 0;
    let count = 0;
    for (let j = i - half; j <= i + half; j += 1) {
      const v = values[j];
      if (v !== undefined) {
        sum += v;
        count += 1;
      }
    }
    return sum / count;
  });
}

export function MetricStrip({ metrics, trend }: MetricStripProps): React.ReactElement {
  const activeTrend = trimFlatEdges(trend);
  const totalSeries = smooth(
    activeTrend.map((point) => point.positive + point.neutral + point.negative),
  );
  const positiveSeries = smooth(activeTrend.map((point) => point.positive));
  const negativeSeries = smooth(activeTrend.map((point) => point.negative));

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <MetricCard
        label="Total feedback"
        value={metrics.total.value}
        growth={metrics.total.growth}
        sparklineData={totalSeries}
      />
      <MetricCard
        label="Positive"
        value={metrics.positive.value}
        growth={metrics.positive.growth}
        sparklineData={positiveSeries}
      />
      <MetricCard
        label="Negative"
        value={metrics.negative.value}
        growth={metrics.negative.growth}
        sparklineData={negativeSeries}
      />
    </div>
  );
}
