"use client";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

export type BillingOverviewData = Awaited<ReturnType<typeof trpc.billing.overview.query>>;

type BillingOverviewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: BillingOverviewData };

export function useBillingOverview(): { state: BillingOverviewState; reload: () => void } {
  const { state, refresh } = useAsyncResource(() => trpc.billing.overview.query());

  const mapped: BillingOverviewState =
    state.status === "error"
      ? { status: "error" }
      : state.status === "ready"
        ? { status: "ready", data: state.data }
        : { status: "loading" };

  return { state: mapped, reload: refresh };
}
