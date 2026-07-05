"use client";

import { AnimatedCounter } from "@echo/ui/components/animated-counter";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@echo/ui/components/card";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { formatCount } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

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
            {sources.map((item) => {
              const share = Math.round((item.count / total) * 100);
              const color = SOURCE_COLORS[item.source];
              return (
                <div key={item.source} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {SOURCE_LABELS[item.source]}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatCount(item.count)} · {share}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${share}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
