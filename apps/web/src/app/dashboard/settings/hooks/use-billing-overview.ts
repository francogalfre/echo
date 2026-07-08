"use client";

import { useCallback, useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";

export type BillingOverviewData = Awaited<ReturnType<typeof trpc.billing.overview.query>>;

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: BillingOverviewData };

export function useBillingOverview(): { state: State; reload: () => void } {
  const [state, setState] = useState<State>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback((): void => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 3;

    setState({ status: "loading" });

    const load = (): void => {
      trpc.billing.overview
        .query()
        .then((data) => {
          if (!cancelled) setState({ status: "ready", data });
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
  }, [reloadKey]);

  return { state, reload };
}
