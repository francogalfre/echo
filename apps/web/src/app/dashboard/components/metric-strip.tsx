"use client";

import { Icons } from "@echo/ui/components/icons";

import type { DashboardOverview, SeriesPoint } from "@echo/api/services/dashboard-overview";

import { MetricCard } from "./metric-card";

type MetricStripProps = {
  metrics: DashboardOverview["metrics"];
  series: SeriesPoint[];
};

export function MetricStrip({ metrics, series }: MetricStripProps): React.ReactElement {
  const totalSeries = series.map(
    (point) => point.positive + point.neutral + point.negative,
  );
  const positiveSeries = series.map((point) => point.positive);
  const negativeSeries = series.map((point) => point.negative);
  // "This week" has no distinct daily series server-side, so it reuses the total trend
  const thisWeekSeries = totalSeries;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Total feedback"
        icon={<Icons.message className="size-4 text-accent" />}
        iconClassName="bg-accent/10"
        value={metrics.total.value}
        growth={metrics.total.growth}
        caption="vs previous period"
        sparklineData={totalSeries}
        sparklineColor="var(--chart-1)"
      />
      <MetricCard
        label="Positive"
        icon={<Icons.circleCheck className="size-4 text-success" />}
        iconClassName="bg-success/10"
        value={metrics.positive.value}
        growth={metrics.positive.growth}
        caption="vs previous period"
        sparklineData={positiveSeries}
        sparklineColor="var(--success)"
      />
      <MetricCard
        label="Negative"
        icon={<Icons.triangleAlert className="size-4 text-destructive" />}
        iconClassName="bg-destructive/10"
        value={metrics.negative.value}
        growth={metrics.negative.growth}
        caption="vs previous period"
        sparklineData={negativeSeries}
        sparklineColor="var(--destructive)"
      />
      <MetricCard
        label="This week"
        icon={<Icons.radar className="size-4 text-info" />}
        iconClassName="bg-info/10"
        value={metrics.thisWeek.value}
        growth={metrics.thisWeek.growth}
        caption="vs last week"
        sparklineData={thisWeekSeries}
        sparklineColor="var(--info)"
      />
    </div>
  );
}
