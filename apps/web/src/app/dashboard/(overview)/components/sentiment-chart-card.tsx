"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@echo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@echo/ui/components/chart";
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  positive: { label: "Positive", color: "var(--chart-1)" },
  neutral: { label: "Neutral", color: "var(--chart-2)" },
  negative: { label: "Negative", color: "var(--chart-3)" },
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
                    style={{ backgroundColor: item.color }}
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
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className={cn(
              "h-64 w-full transition-opacity duration-200 aspect-auto",
              pending && "opacity-60",
            )}
          >
            <BarChart
              key={granularity}
              data={series}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="bucket"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tickMargin={8}
                tickFormatter={(value: string) => formatBucket(value, granularity)}
              />
              <YAxis
                width={36}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tickFormatter={(value: number) => formatCompact(value)}
              />
              {isEmpty ? null : (
                <ChartTooltip
                  cursor={{ fillOpacity: 0.4 }}
                  content={
                    <ChartTooltipContent
                      config={chartConfig}
                      labelFormatter={(label) => formatBucket(label, granularity)}
                    />
                  }
                />
              )}
              {isEmpty ? null : (
                <Bar
                  dataKey="positive"
                  stackId="sentiment"
                  fill="var(--color-positive)"
                  maxBarSize={28}
                />
              )}
              {isEmpty ? null : (
                <Bar
                  dataKey="neutral"
                  stackId="sentiment"
                  fill="var(--color-neutral)"
                  maxBarSize={28}
                />
              )}
              {isEmpty ? null : (
                <Bar
                  dataKey="negative"
                  stackId="sentiment"
                  fill="var(--color-negative)"
                  maxBarSize={28}
                  radius={[3, 3, 0, 0]}
                />
              )}
            </BarChart>
          </ChartContainer>
          {isEmpty ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <EmptyState icon={<Icons.message />} title="No feedback in this period" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
