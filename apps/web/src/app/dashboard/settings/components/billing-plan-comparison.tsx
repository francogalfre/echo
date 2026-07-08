import { Badge } from "@echo/ui/components/badge";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { Fragment } from "react";

import { BillingUpgradeButton } from "./billing-upgrade-button";

type ComparisonRow = { label: string; free: string; pro: string };

const ROWS: ComparisonRow[] = [
  { label: "Projects", free: "1", pro: "5" },
  { label: "Feedback", free: "300 / mo", pro: "Unlimited" },
  { label: "AI summaries", free: "1 / week", pro: "10 / day + history" },
  { label: "AI insights", free: "3 / day", pro: "50 / day" },
  { label: "“Powered by echo” badge", free: "Shown", pro: "Removed" },
  { label: "Support", free: "Community", pro: "Priority" },
];

type BillingPlanComparisonProps = { plan: string };

export const BillingPlanComparison = ({
  plan,
}: BillingPlanComparisonProps): React.ReactElement => {
  const isPro = plan === "pro";

  return (
    <div className="rounded-lg bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-3 p-5">
        <span className="text-xs font-medium text-muted-foreground">Feature</span>
        <span className="text-xs font-medium text-muted-foreground">Free</span>
        <Badge variant="accent" className="w-fit">
          Pro
        </Badge>

        {ROWS.map((row) => (
          <Fragment key={row.label}>
            <span className="text-sm text-foreground">{row.label}</span>
            <span className="text-sm text-muted-foreground">{row.free}</span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-md bg-accent/5 px-2 py-1 text-sm",
                "text-foreground ring-1 ring-accent/20",
              )}
            >
              <Icons.check className="size-3.5 shrink-0 text-accent" />
              {row.pro}
            </span>
          </Fragment>
        ))}
      </div>

      {!isPro ? (
        <div className="flex justify-end border-t border-border px-5 py-4">
          <BillingUpgradeButton size="sm" />
        </div>
      ) : null}
    </div>
  );
};
