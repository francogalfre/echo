"use client";

import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";
import * as React from "react";

import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

import type { DigestOutput } from "@echo/ai";
import type { DashboardOverview, StatsRange } from "@echo/api/services/dashboard-overview";

import { ErrorCard } from "../../components/error-card";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { HowEchoWorks } from "./how-echo-works";
import { InsightsHero } from "./insights-hero";
import { MetricStrip } from "./metric-strip";
import { OnboardingChecklist } from "./onboarding-checklist";
import { ProductFlowStrip } from "./product-flow-strip";
import { RecentFeedbackTable } from "./recent-feedback-table";
import { SentimentChartCard } from "./sentiment-chart-card";
import { SourcesCard } from "./sources-card";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: DashboardOverview; pending: boolean };

type InitialDigest = {
  readonly digest: DigestOutput | null;
  readonly generatedAt: Date | null;
  readonly feedbackCount: number;
};

type Props = {
  readonly initialData: DashboardOverview;
  readonly hasApiKey: boolean;
  readonly initialDigest: InitialDigest;
};

const INITIAL_RANGE: StatsRange = "30d";

export function DashboardClient({
  initialData,
  hasApiKey,
  initialDigest,
}: Props): React.ReactElement {
  const { data: session } = useSession();
  const [range, setRange] = React.useState<StatsRange>(INITIAL_RANGE);
  const [state, setState] = React.useState<State>({
    status: "ready",
    data: initialData,
    pending: false,
  });
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 3;

    setState((prev) =>
      prev.status === "ready" ? { ...prev, pending: true } : { status: "loading" },
    );

    const load = (): void => {
      trpc.dashboard.overview
        .query({ range })
        .then((data) => {
          if (!cancelled) setState({ status: "ready", data, pending: false });
        })
        .catch(() => {
          if (cancelled) return;
          attempt += 1;
          if (attempt < maxAttempts) {
            setTimeout(load, attempt * 800);
          } else {
            setState({ status: "error" });
          }
        });
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [range]);

  const firstName = session?.user.name?.split(" ")[0] ?? "";
  const hasFeedback = state.status === "ready" && state.data.metrics.total.value > 0;
  const hasInsights =
    initialDigest.digest !== null &&
    (initialDigest.digest.topIssues.length > 0 || initialDigest.digest.themes.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hello{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s how your project is performing.
        </p>
      </div>

      {state.status === "loading" && <DashboardSkeleton />}

      {state.status === "error" && (
        <ErrorCard message="We couldn't load your dashboard. Refresh the page to retry." />
      )}

      {state.status === "ready" && state.data.recent.length === 0 && (
        <div className="flex flex-col gap-4">
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
          className="flex flex-col gap-4"
        >
          <motion.div variants={fadeInUp}>
            <MetricStrip metrics={state.data.metrics} trend={state.data.trend} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <InsightsHero
              digest={initialDigest.digest}
              generatedAt={initialDigest.generatedAt}
              feedbackCount={initialDigest.feedbackCount}
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="grid gap-4 lg:grid-cols-3">
            <SentimentChartCard
              series={state.data.series}
              granularity={state.data.granularity}
              range={range}
              onRangeChange={setRange}
              pending={state.pending}
            />
            <SourcesCard sources={state.data.sources} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <RecentFeedbackTable items={state.data.recent} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ProductFlowStrip
              variant="compact"
              hasFeedback={hasFeedback}
              hasInsights={hasInsights}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
