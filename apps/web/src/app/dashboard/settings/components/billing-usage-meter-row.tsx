"use client";

import { cn } from "@echo/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

type BillingUsageMeterRowProps = {
  label: string;
  used: number;
  limit: number | null;
  rightLabel?: string;
};

function barColorClass(ratio: number): string {
  if (ratio >= 1) return "bg-destructive";
  if (ratio >= 0.8) return "bg-warning";
  return "bg-accent";
}

export const BillingUsageMeterRow = ({
  label,
  used,
  limit,
  rightLabel,
}: BillingUsageMeterRowProps): React.ReactElement => {
  const reduced = useReducedMotion();
  const hasLimit = limit !== null;
  const ratio = hasLimit ? Math.min(used / Math.max(limit, 1), 1) : 0;
  const widthPercent = `${ratio * 100}%`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-foreground">{label}</span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {rightLabel ?? (hasLimit ? `${used} / ${limit}` : "Unlimited")}
        </span>
      </div>
      {hasLimit ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn("h-full rounded-full", barColorClass(ratio))}
            initial={{ width: reduced ? widthPercent : "0%" }}
            animate={{ width: widthPercent }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      ) : null}
    </div>
  );
};
