"use client";

import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";
import * as React from "react";

import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

import type { DigestOutput } from "@echo/ai";
import type { DashboardOverview, StatsRange } from "@echo/api/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@echo/ui/components/select";

import { AiAnalysisButton } from "../../components/ai/ai-analysis-button";
import { ErrorCard } from "../../components/error-card";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { HowEchoWorks } from "./how-echo-works";
import { MetricStrip } from "./metric-strip";
import { OnboardingChecklist } from "./onboarding-checklist";
import { ProductFlowStrip } from "./product-flow-strip";
import { RecentFeedbackTable } from "./recent-feedback-table";
import { SentimentChartCard } from "./sentiment-chart-card";
import { SourcesCard } from "./sources-card";

type InitialDigest = {
  readonly digest: DigestOutput | null;
  readonly generatedAt: Date | null;
  readonly feedbackCount: number;
};

type DashboardClientProps = {
  readonly initialData: DashboardOverview;
  readonly hasApiKey: boolean;
  readonly initialDigest: InitialDigest;
};

const INITIAL_RANGE: StatsRange = "all";

const RANGE_OPTIONS: readonly { value: StatsRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
];

export function DashboardClient({
  initialData,
  hasApiKey,
  initialDigest,
}: DashboardClientProps): React.ReactElement {
  const { data: session } = useSession();
  const [range, setRange] = React.useState<StatsRange>(INITIAL_RANGE);
  const { state } = useAsyncResource(() => trpc.dashboard.overview.query({ range }), {
    initialData,
    deps: [range],
  });

  const firstName = session?.user.name?.split(" ")[0] ?? "";
  const hasFeedback = state.status === "ready" && state.data.metrics.total.value > 0;
  const hasInsights =
    initialDigest.digest !== null &&
    (initialDigest.digest.topIssues.length > 0 || initialDigest.digest.themes.length > 0);

  const handleRangeChange = (value: StatsRange | null): void => {
    const next = RANGE_OPTIONS.find((option) => option.value === value);
    if (next) setRange(next.value);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium font-pixel">
            Hello{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s how your project is performing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select items={RANGE_OPTIONS} value={range} onValueChange={handleRangeChange}>
            <SelectTrigger className="data-[size=default]:h-10 rounded-lg px-4 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" side="bottom" alignItemWithTrigger={false}>
              {RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AiAnalysisButton />
        </div>
      </div>

      {state.status === "loading" && <DashboardSkeleton />}

      {state.status === "error" && (
        <ErrorCard
          message="We couldn't load your dashboard. Refresh the page to retry."
          onRetry={state.retry}
        />
      )}

      {state.status === "ready" && state.data.recent.length === 0 && (
        <div className="flex flex-col gap-5">
          <MetricStrip metrics={state.data.metrics} trend={state.data.trend} />
          <ProductFlowStrip
            variant="full"
            hasFeedback={hasFeedback}
            hasInsights={hasInsights}
          />
          <OnboardingChecklist
            hasFeedback={state.data.metrics.total.value > 0}
            hasApiKey={hasApiKey}
          />
          <HowEchoWorks />
        </div>
      )}

      {state.status === "ready" && state.data.recent.length > 0 && (
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          <motion.div variants={fadeInUp}>
            <MetricStrip metrics={state.data.metrics} trend={state.data.trend} />
          </motion.div>
          <motion.div variants={fadeInUp} className="grid gap-5 lg:grid-cols-3">
            <SentimentChartCard
              series={state.data.series}
              granularity={state.data.granularity}
              pending={state.pending}
            />
            <SourcesCard sources={state.data.sources} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <RecentFeedbackTable items={state.data.recent} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
