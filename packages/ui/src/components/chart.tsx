"use client";

import { formatCount } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import * as React from "react";
import * as RechartsPrimitive from "recharts";

type ChartConfig = Record<string, { label: string; color: string }>;

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
};

function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps): React.ReactElement {
  const style = Object.fromEntries(
    Object.entries(config).map(([key, item]) => [`--color-${key}`, item.color]),
  );

  return (
    <div
      data-slot="chart"
      className={cn(
        "flex aspect-video justify-center text-[11px]",
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
        "[&_.recharts-cartesian-grid_line]:stroke-border/60",
        "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/60",
        className,
      )}
      style={style}
      {...props}
    >
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipEntry = {
  dataKey?: string | number;
  value?: number | string;
};

type ChartTooltipContentProps = {
  config: ChartConfig;
  active?: boolean;
  payload?: readonly TooltipEntry[];
  label?: string | number;
  labelFormatter?: (label: string) => string;
};

function ChartTooltipContent({
  config,
  active,
  payload,
  label,
  labelFormatter,
}: ChartTooltipContentProps): React.ReactElement | null {
  if (!active || !payload || payload.length === 0) return null;

  const heading =
    typeof label === "string" || typeof label === "number" ? String(label) : "";

  return (
    <div className="min-w-36 rounded-md bg-popover px-2.5 py-2 text-[11px] text-popover-foreground shadow-md ring-1 ring-foreground/10">
      {heading ? (
        <p className="mb-1.5 font-medium">
          {labelFormatter ? labelFormatter(heading) : heading}
        </p>
      ) : null}
      <div className="flex flex-col gap-1">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? "");
          const item = config[key];
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  aria-hidden
                  className="size-2 rounded-[3px]"
                  style={{ backgroundColor: item?.color }}
                />
                {item?.label ?? key}
              </span>
              <span className="font-medium tabular-nums">
                {formatCount(Number(entry.value ?? 0))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig };
