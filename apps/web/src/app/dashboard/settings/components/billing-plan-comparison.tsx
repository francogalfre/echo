import { Badge } from "@echo/ui/components/badge";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { Fragment } from "react";

import { BillingUpgradeButton } from "./billing-upgrade-button";
import { SettingsCard } from "./settings-card";

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
    <SettingsCard className="flex flex-col p-0">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-2.5 p-6">
        <span className="text-xs font-medium text-muted-foreground">Feature</span>
        <span className="text-xs font-medium text-muted-foreground">Free</span>
        <Badge variant="accent" className="w-fit px-1.5 text-[11px]">
          Pro
        </Badge>

        {ROWS.map((row) => (
          <Fragment key={row.label}>
            <span className="text-sm text-foreground">{row.label}</span>
            <span className="text-xs text-muted-foreground">{row.free}</span>
            <span
              className={cn(
                "flex items-center gap-1 rounded-md bg-accent/5 px-1.5 py-0.5 text-xs",
                "text-foreground ring-1 ring-accent/20",
              )}
            >
              <Icons.check className="size-3 shrink-0 text-accent" />
              {row.pro}
            </span>
          </Fragment>
        ))}
      </div>

      {!isPro ? (
        <div className="flex justify-end border-t border-border px-6 py-4">
          <BillingUpgradeButton size="sm" />
        </div>
      ) : null}
    </SettingsCard>
  );
};
