"use client";

import { Bar } from "@echo/ui/components/dither-kit/bar";
import { BarChart } from "@echo/ui/components/dither-kit/bar-chart";
import type { ChartConfig } from "@echo/ui/components/dither-kit/chart-context";
import { Grid } from "@echo/ui/components/dither-kit/grid";
import { rgb, seedOfColor } from "@echo/ui/components/dither-kit/palette";
import { Tooltip } from "@echo/ui/components/dither-kit/tooltip";
import { XAxis } from "@echo/ui/components/dither-kit/x-axis";
import { YAxis } from "@echo/ui/components/dither-kit/y-axis";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@echo/ui/components/card";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@echo/ui/components/select";
import { formatBucket, formatCompact } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

import type {
  SeriesGranularity,
  SeriesPoint,
  StatsRange,
} from "@echo/api/services/dashboard-overview";

const RANGE_OPTIONS: readonly { value: StatsRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
];

const chartConfig: ChartConfig = {
  positive: { label: "Positive", color: "accent" },
  neutral: { label: "Neutral", color: "accentMuted" },
  negative: { label: "Negative", color: "accentDeep" },
};

type SentimentChartCardProps = {
  series: SeriesPoint[];
  granularity: SeriesGranularity;
  range: StatsRange;
  onRangeChange: (range: StatsRange) => void;
  pending?: boolean;
};

export function SentimentChartCard({
  series,
  granularity,
  range,
  onRangeChange,
  pending = false,
}: SentimentChartCardProps): React.ReactElement {
  const handleRangeChange = (value: StatsRange | null): void => {
    const next = RANGE_OPTIONS.find((option) => option.value === value);
    if (next) onRangeChange(next.value);
  };

  const isEmpty = series.every(
    (point) => point.positive === 0 && point.neutral === 0 && point.negative === 0,
  );

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Feedback sentiment</CardTitle>
        <CardAction>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {Object.entries(chartConfig).map(([key, item]) => (
                <span
                  key={key}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ backgroundColor: rgb(seedOfColor(item.color).fill) }}
                  />
                  {item.label}
                </span>
              ))}
            </div>
            <Select value={range} onValueChange={handleRangeChange}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" alignItemWithTrigger={false}>
                {RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "relative h-80 w-full overflow-hidden rounded-lg transition-opacity duration-200",
            pending && "opacity-60",
          )}
        >
          {isEmpty ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState icon={<Icons.message />} title="No feedback in this period" />
            </div>
          ) : (
            <BarChart
              data={series}
              config={chartConfig}
              stackType="stacked"
              margins={{ left: 32, bottom: 24 }}
            >
              <Grid horizontal />
              <Bar dataKey="positive" />
              <Bar dataKey="neutral" />
              <Bar dataKey="negative" />
              <XAxis
                dataKey="bucket"
                tickFormatter={(value) => formatBucket(String(value), granularity)}
              />
              <YAxis tickFormatter={(value) => formatCompact(value)} />
              <Tooltip labelKey="bucket" valueFormatter={(value) => formatCompact(value)} />
            </BarChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
