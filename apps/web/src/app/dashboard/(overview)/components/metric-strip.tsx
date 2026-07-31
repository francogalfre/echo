"use client";

import type { DashboardOverview, SeriesPoint } from "@echo/api/services/dashboard-overview";

import { MetricCard } from "./metric-card";

type MetricStripProps = {
  metrics: DashboardOverview["metrics"];
  trend: SeriesPoint[];
};

export function MetricStrip({ metrics, trend }: MetricStripProps): React.ReactElement {
  const totalSeries = trend.map((point) => point.positive + point.neutral + point.negative);
  const positiveSeries = trend.map((point) => point.positive);
  const negativeSeries = trend.map((point) => point.negative);

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <MetricCard
        label="Total feedback"
        value={metrics.total.value}
        growth={metrics.total.growth}
        sparklineData={totalSeries}
        sparklineColor="accent"
      />
      <MetricCard
        label="Positive"
        value={metrics.positive.value}
        growth={metrics.positive.growth}
        sparklineData={positiveSeries}
        sparklineColor="accentSoft"
      />
      <MetricCard
        label="Negative"
        value={metrics.negative.value}
        growth={metrics.negative.growth}
        sparklineData={negativeSeries}
        sparklineColor="accentDeep"
      />
    </div>
  );
}
