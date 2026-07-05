"use client";

import * as React from "react";
import { cn } from "@echo/ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type SparklineProps = {
  data: readonly number[];
  color?: string;
  className?: string;
};

function Sparkline({
  data,
  color = "var(--chart-1)",
  className,
}: SparklineProps): React.ReactElement {
  const gradientId = React.useId();
  const reduced = useReducedMotion();

  if (data.length < 2) {
    return <div className={cn("h-10", className)} />;
  }

  const points = data.map((value, index) => ({ index, value }));

  return (
    <div data-slot="sparkline" className={cn("h-10 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            // Reduced motion: skip the draw-in so the sparkline appears instantly
            isAnimationActive={!reduced}
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { Sparkline };
