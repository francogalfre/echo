import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import Link from "next/link";

import type { BillingOverviewData } from "../../../hooks/use-billing-overview";
import { BillingUsageMeterRow } from "./billing-usage-meter-row";
import { SettingsCard } from "../../components/settings-card";

type BillingUsageMetersProps = { overview: BillingOverviewData };

function digestRightLabel(overview: BillingOverviewData): string | undefined {
  if (overview.plan === "pro") return undefined;
  if (overview.digests.lastGeneratedAt) {
    return `Last generated ${formatRelativeTime(overview.digests.lastGeneratedAt)}`;
  }
  return "1 per week";
}

function shouldNudgeFeedbackCleanup(feedback: BillingOverviewData["feedback"]): boolean {
  if (feedback.limit === null) return false;
  return feedback.used / feedback.limit >= 0.8;
}

export const BillingUsageMeters = ({
  overview,
}: BillingUsageMetersProps): React.ReactElement => {
  const { feedback, insights, digests, projects } = overview;

  return (
    <SettingsCard>
      <h3 className="text-sm font-medium text-foreground">Usage</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        AI usage resets daily • feedback storage doesn&apos;t reset automatically.
      </p>
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <BillingUsageMeterRow
            label="Feedback stored"
            used={feedback.used}
            limit={feedback.limit}
          />
          {shouldNudgeFeedbackCleanup(feedback) ? (
            <Link
              href="/dashboard/feedback"
              className="group inline-flex w-fit items-center gap-1 text-[11px] font-medium text-accent"
            >
              Manage feedback
              <Icons.arrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
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
