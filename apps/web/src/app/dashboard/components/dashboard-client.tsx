"use client";

import { Icons } from "@echo/ui/components/icons";
import { useEffect, useState } from "react";

import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import type { DashboardStats } from "@echo/api/services/dashboard";

import { AiSummaryCard } from "./ai-summary-card";
import { RecentFeedbackList } from "./recent-feedback-list";
import { SentimentBreakdown } from "./sentiment-breakdown";
import { StatCard } from "./stat-card";

type State =
  | { status: "loading" }
  | { status: "ready"; data: DashboardStats }
  | { status: "error" };

export function DashboardClient(): React.ReactElement {
  const { data: session } = useSession();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    trpc.dashboard.stats
      .query()
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error" }));
  }, []);

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

      {state.status === "loading" && (
        <div className="flex h-48 items-center justify-center">
          <Icons.loading className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {state.status === "error" && (
        <div className="rounded-xl border border-border bg-card px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load dashboard. Refresh to retry.
          </p>
        </div>
      )}

      {state.status === "ready" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Feedback"
              value={state.data.total}
              growth={state.data.activityGrowth}
              subtitle="vs last 7 days"
              sparkline={state.data.sparkline}
              color="#7C3AED"
            />
            <StatCard
              label="Positive"
              value={state.data.positive}
              growth={state.data.positiveGrowth}
              subtitle="vs last 7 days"
              sparkline={state.data.sparkline}
              color="#10B981"
            />
            <StatCard
              label="This Week"
              value={state.data.thisWeek}
              growth={state.data.activityGrowth}
              subtitle="vs last week"
              sparkline={state.data.sparkline}
              color="#3B82F6"
            />
          </div>

          <SentimentBreakdown breakdown={state.data.breakdown} />

          <AiSummaryCard />

          <RecentFeedbackList items={state.data.recent} />
        </>
      )}
    </div>
  );
}
