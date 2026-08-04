"use client";

import { cn } from "@echo/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

import { usageBarColorClass } from "@/utils/usage-meter";

type BillingUsageMeterRowProps = {
  label: string;
  used: number;
  limit: number | null;
  rightLabel?: string;
};

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
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {rightLabel ?? (hasLimit ? `${used} / ${limit}` : "Unlimited")}
        </span>
      </div>
      {hasLimit ? (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={limit ?? undefined}
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <motion.div
            className={cn("h-full rounded-full", usageBarColorClass(used, limit ?? 0))}
            initial={{ width: reduced ? widthPercent : "0%" }}
            animate={{ width: widthPercent }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      ) : null}
    </div>
  );
};
