"use client";

import { AnimatedCounter } from "@echo/ui/components/animated-counter";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@echo/ui/components/card";
import type { ChartConfig } from "@echo/ui/components/dither-kit/chart-context";
import { Pie } from "@echo/ui/components/dither-kit/pie";
import { PieChart } from "@echo/ui/components/dither-kit/pie-chart";
import { rgb, seedOfColor } from "@echo/ui/components/dither-kit/palette";
import { Tooltip } from "@echo/ui/components/dither-kit/tooltip";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { formatCount } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import Link from "next/link";

import type { SourceCount } from "@echo/api/services/dashboard-overview";

const SOURCE_LABELS: Record<SourceCount["source"], string> = {
  api: "API",
  widget: "Widget",
  form: "Form",
};

const chartConfig: ChartConfig = {
  api: { label: SOURCE_LABELS.api, color: "purple" },
  form: { label: SOURCE_LABELS.form, color: "blue" },
  widget: { label: SOURCE_LABELS.widget, color: "orange" },
};

export function SourcesCard({ sources }: { sources: SourceCount[] }): React.ReactElement {
  const total = sources.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sources</CardTitle>
        {total > 0 ? (
          <div className="flex items-baseline gap-1.5">
            <AnimatedCounter value={total} className="font-pixel text-2xl tracking-tight" />
            <span className="text-[11px] text-muted-foreground">
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
            <div className="relative h-44 w-full">
              <PieChart
                data={sources}
                config={chartConfig}
                dataKey="count"
                nameKey="source"
                innerRadius={0.62}
              >
                <Pie variant="gradient" />
                <Tooltip labelKey="source" valueFormatter={(value) => formatCount(value)} />
              </PieChart>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-pixel text-lg font-semibold tabular-nums">
                  {formatCount(total)}
                </span>
                <span className="text-[11px] text-muted-foreground">total</span>
              </div>
            </div>
            <Stagger className="flex flex-col gap-2.5" stagger={0.05}>
              {sources.map((item) => {
                const share = Math.round((item.count / total) * 100);
                return (
                  <StaggerItem
                    key={item.source}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor: rgb(
                            seedOfColor(chartConfig[item.source]?.color ?? "grey").fill,
                          ),
                        }}
                      />
                      {SOURCE_LABELS[item.source]}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatCount(item.count)} · {share}%
                    </span>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
