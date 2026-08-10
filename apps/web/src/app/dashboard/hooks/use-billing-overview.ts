"use client";

import { useEffect } from "react";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

export type BillingOverviewData = Awaited<ReturnType<typeof trpc.billing.overview.query>>;

type BillingOverviewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: BillingOverviewData };

type UseBillingOverviewOptions = {
  readonly initialData?: BillingOverviewData;
  readonly pollIntervalMs?: number;
};

export function useBillingOverview(options?: UseBillingOverviewOptions): {
  state: BillingOverviewState;
  reload: () => void;
} {
  const { initialData, pollIntervalMs } = options ?? {};
  const { state, refresh } = useAsyncResource(() => trpc.billing.overview.query(), {
    initialData,
  });

  useEffect(() => {
    if (!pollIntervalMs) return;

    const interval = setInterval(() => {
      if (!document.hidden) refresh();
    }, pollIntervalMs);

    const onVisibilityChange = (): void => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pollIntervalMs, refresh]);

  const mapped: BillingOverviewState =
    state.status === "error"
      ? { status: "error" }
      : state.status === "ready"
        ? { status: "ready", data: state.data }
        : { status: "loading" };

  return { state: mapped, reload: refresh };
}
