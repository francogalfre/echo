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
import { formatBucket, formatCompact } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

import type { SeriesGranularity, SeriesPoint } from "@echo/api/types";

const chartConfig: ChartConfig = {
  positive: { label: "Positive", color: "accent" },
  neutral: { label: "Neutral", color: "accentMuted" },
  negative: { label: "Negative", color: "accentDeep" },
};

type SentimentChartCardProps = {
  series: SeriesPoint[];
  granularity: SeriesGranularity;
  pending?: boolean;
};

export function SentimentChartCard({
  series,
  granularity,
  pending = false,
}: SentimentChartCardProps): React.ReactElement {
  const isEmpty = series.every(
    (point) => point.positive === 0 && point.neutral === 0 && point.negative === 0,
  );

  return (
    <Card className="lg:col-span-2 py-5">
      <CardHeader className="px-5">
        <CardTitle>Feedback sentiment</CardTitle>
        <CardAction>
          <div className="flex items-center gap-3">
            {Object.entries(chartConfig).map(([key, item]) => (
              <span
                key={key}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <span
                  aria-hidden
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: rgb(seedOfColor(item.color).fill) }}
                />
                {item.label}
              </span>
            ))}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-5">
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
