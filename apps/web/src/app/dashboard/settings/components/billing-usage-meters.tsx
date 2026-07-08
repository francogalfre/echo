import { formatRelativeTime } from "@echo/ui/lib/format";

import type { BillingOverviewData } from "../../hooks/use-billing-overview";
import { BillingUsageMeterRow } from "./billing-usage-meter-row";
import { SettingsCard } from "./settings-card";

type BillingUsageMetersProps = { overview: BillingOverviewData };

function digestRightLabel(overview: BillingOverviewData): string | undefined {
  if (overview.plan === "pro") return undefined;
  if (overview.digests.lastGeneratedAt) {
    return `Last generated ${formatRelativeTime(overview.digests.lastGeneratedAt)}`;
  }
  return "1 per week";
}

export const BillingUsageMeters = ({
  overview,
}: BillingUsageMetersProps): React.ReactElement => {
  const { feedback, insights, digests, projects } = overview;

  return (
    <SettingsCard>
      <h3 className="text-sm font-semibold text-foreground">Usage</h3>
      <div className="mt-4 flex flex-col gap-4">
        <BillingUsageMeterRow
          label="Feedback this month"
          used={feedback.used}
          limit={feedback.limit}
        />
        <BillingUsageMeterRow
          label="AI insights today"
          used={insights.used}
          limit={insights.limit}
        />
        <BillingUsageMeterRow
          label="AI summaries"
          used={digests.used ?? 0}
          limit={digests.limit}
          rightLabel={digestRightLabel(overview)}
        />
        <BillingUsageMeterRow
          label="Projects"
          used={projects.used}
          limit={projects.limit}
        />
      </div>
    </SettingsCard>
  );
};
