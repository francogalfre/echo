"use client";

import { AnimatedCounter } from "@echo/ui/components/animated-counter";

import type { DashboardOverview, MetricValue } from "@echo/api/services/dashboard-overview";

type MetricStripProps = {
  metrics: DashboardOverview["metrics"];
};

function TrendChip({ growth }: { growth: number | null }): React.ReactElement {
  if (growth === null) {
    return <span className="font-medium text-muted-foreground/70">—</span>;
  }
  const positive = growth >= 0;
  return (
    <span
      className={positive ? "font-medium text-success" : "font-medium text-destructive"}
    >
      {positive ? "↑" : "↓"} {Math.abs(growth)}%
    </span>
  );
}

function Segment({
  label,
  caption,
  metric,
  className,
}: {
  label: string;
  caption: string;
  metric: MetricValue;
  className?: string;
}): React.ReactElement {
  return (
    <div className={`flex flex-col gap-1.5 border-border px-5 py-4 ${className ?? ""}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tracking-tight">
        <AnimatedCounter value={metric.value} />
      </p>
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <TrendChip growth={metric.growth} />
        {caption}
      </p>
    </div>
  );
}

export function MetricStrip({ metrics }: MetricStripProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10 lg:grid-cols-4">
      <Segment
        label="Total feedback"
        caption="vs previous period"
        metric={metrics.total}
        className="border-b lg:border-b-0"
      />
      <Segment
        label="Positive"
        caption="vs previous period"
        metric={metrics.positive}
        className="border-b border-l lg:border-b-0"
      />
      <Segment
        label="Negative"
        caption="vs previous period"
        metric={metrics.negative}
        className="lg:border-l"
      />
      <Segment
        label="This week"
        caption="vs last week"
        metric={metrics.thisWeek}
        className="border-l"
      />
    </div>
  );
}
