"use client";

import { buttonVariants } from "@echo/ui/components/button-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

import type { DashboardOverview, StatsRange } from "@echo/api/services/dashboard-overview";

import { AiSummaryBanner } from "./ai-summary-banner";
import { MetricStrip } from "./metric-strip";
import { RecentFeedbackTable } from "./recent-feedback-table";
import { SentimentChartCard } from "./sentiment-chart-card";
import { SourcesCard } from "./sources-card";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: DashboardOverview; pending: boolean };

function DashboardSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-lg lg:col-span-2" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
      <Skeleton className="h-[4.5rem] rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

export function DashboardClient(): React.ReactElement {
  const { data: session } = useSession();
  const [range, setRange] = React.useState<StatsRange>("30d");
  const [state, setState] = React.useState<State>({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;
    setState((prev) =>
      prev.status === "ready" ? { ...prev, pending: true } : { status: "loading" },
    );
    trpc.dashboard.overview
      .query({ range })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data, pending: false });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const firstName = session?.user.name?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hello{firstName ? `, ${firstName}` : ""}! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s how your project is performing.
        </p>
      </div>

      {state.status === "loading" && <DashboardSkeleton />}

      {state.status === "error" && (
        <div className="rounded-lg bg-card px-5 py-10 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            Failed to load dashboard. Refresh to retry.
          </p>
        </div>
      )}

      {state.status === "ready" && state.data.recent.length === 0 && (
        <div className="flex flex-col gap-4">
          <MetricStrip metrics={state.data.metrics} series={state.data.series} />
          <div className="rounded-lg bg-card ring-1 ring-foreground/10">
            <EmptyState
              icon={<Icons.message />}
              title="No feedback yet"
              description="Connect a source and your analytics will light up here."
              action={
                <Link
                  href="/dashboard/collect"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Start collecting
                </Link>
              }
            />
          </div>
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
            <MetricStrip metrics={state.data.metrics} series={state.data.series} />
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
            <AiSummaryBanner total={state.data.metrics.total.value} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <RecentFeedbackTable items={state.data.recent} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
