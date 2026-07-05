"use client";

import { AnimatedCounter } from "@echo/ui/components/animated-counter";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@echo/ui/components/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@echo/ui/components/chart";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { formatCount } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import Link from "next/link";
import { Cell, Pie, PieChart } from "recharts";

import type { SourceCount } from "@echo/api/services/dashboard-overview";

const SOURCE_LABELS: Record<SourceCount["source"], string> = {
  api: "API",
  widget: "Widget",
  form: "Form",
};

const SOURCE_COLORS: Record<SourceCount["source"], string> = {
  api: "var(--chart-1)",
  form: "var(--chart-2)",
  widget: "var(--chart-3)",
};

const chartConfig: ChartConfig = {
  api: { label: SOURCE_LABELS.api, color: SOURCE_COLORS.api },
  form: { label: SOURCE_LABELS.form, color: SOURCE_COLORS.form },
  widget: { label: SOURCE_LABELS.widget, color: SOURCE_COLORS.widget },
};

type SourceTooltipEntry = { name?: string; value?: number };

// Pie slices share a single `dataKey` ("count"), so the shared ChartTooltipContent
// (which keys off dataKey) can't tell slices apart — key off `name` instead, which
// Recharts sets per-slice from `nameKey`.
function SourceTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly SourceTooltipEntry[];
}): React.ReactElement | null {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const key = String(entry?.name ?? "");
  const item = chartConfig[key];

  return (
    <div className="min-w-36 rounded-md bg-popover px-2.5 py-2 text-[11px] text-popover-foreground shadow-md ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span
            aria-hidden
            className="size-2 rounded-[3px]"
            style={{ backgroundColor: item?.color }}
          />
          {item?.label ?? key}
        </span>
        <span className="font-medium tabular-nums">
          {formatCount(Number(entry?.value ?? 0))}
        </span>
      </div>
    </div>
  );
}

export function SourcesCard({ sources }: { sources: SourceCount[] }): React.ReactElement {
  const total = sources.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sources</CardTitle>
        {total > 0 ? (
          <div className="flex items-baseline gap-1.5">
            <AnimatedCounter
              value={total}
              className="text-2xl font-semibold tracking-tight"
            />
            <span className="text-xs text-muted-foreground">
              across {sources.length} sources
            </span>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        {total === 0 ? (
          <EmptyState
            icon={<Icons.radar />}
            title="No sources yet"
            description="Connect a source and your analytics will light up here."
            action={
              <Link
                href="/dashboard/collect"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Start collecting
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="relative">
              <ChartContainer config={chartConfig} className="h-36 w-full aspect-auto">
                <PieChart>
                  <ChartTooltip content={<SourceTooltipContent />} />
                  <Pie
                    data={sources}
                    dataKey="count"
                    nameKey="source"
                    innerRadius="60%"
                    outerRadius="100%"
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {sources.map((item) => (
                      <Cell key={item.source} fill={SOURCE_COLORS[item.source]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold tabular-nums">
                  {formatCount(total)}
                </span>
                <span className="text-[11px] text-muted-foreground">total</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {sources.map((item) => {
                const share = Math.round((item.count / total) * 100);
                return (
                  <div
                    key={item.source}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ backgroundColor: SOURCE_COLORS[item.source] }}
                      />
                      {SOURCE_LABELS[item.source]}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatCount(item.count)} · {share}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
