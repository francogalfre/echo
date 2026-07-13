"use client";

import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

import type { BillingOverviewData } from "../../hooks/use-billing-overview";

type Props = {
  readonly initialData: BillingOverviewData;
};

export const UsageMeter = ({ initialData }: Props): React.ReactElement | null => {
  if (initialData.plan === "pro") return null;

  const { used, limit } = initialData.feedback;
  if (limit === null) return null;

  const percentUsed = Math.min(100, (used / limit) * 100);
  const isOverLimit = percentUsed >= 100;
  const isApproachingLimit = percentUsed >= 80;

  const fillColor = isOverLimit
    ? "bg-destructive"
    : isApproachingLimit
      ? "bg-warning"
      : "bg-accent";

  const upgradeLabel = isOverLimit
    ? "Limit reached — upgrade"
    : isApproachingLimit
      ? "Approaching limit — upgrade"
      : "Upgrade to Pro";

  return (
    <div className="px-2.5 py-2">
      <div className="flex items-center justify-between">
        <p className="micro-label">This month</p>
        <p className="tabular-nums text-[11px] text-muted-foreground">
          {used}/{limit}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Feedback usage this month"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={limit}
        className="mt-1.5 h-1 rounded-full bg-border"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${fillColor}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>
      <Link
        href="/dashboard/settings/billing"
        className="group mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent"
      >
        {upgradeLabel}
        <Icons.arrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
};
