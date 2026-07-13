"use client";

import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";

export type WidgetInstall = {
  publicKey: string;
  orgSlug: string;
  name: string;
  logo: string | null;
  accentColor: string;
};

export type WidgetInstallInitial = { info: WidgetInstall | null } | { error: true };

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | { status: "ready"; info: WidgetInstall };

type UseWidgetInstallResult = State & { retry: () => void };

const RETRY_DELAYS_MS = [400, 800] as const;

function toState(initial: WidgetInstallInitial): State {
  if ("error" in initial) return { status: "error" };
  return initial.info ? { status: "ready", info: initial.info } : { status: "empty" };
}

export function useWidgetInstall(initial: WidgetInstallInitial): UseWidgetInstallResult {
  const [state, setState] = useState<State>(() => toState(initial));

  const retry = (): void => {
    let attempt = 0;
    setState({ status: "loading" });

    const load = (): void => {
      trpc.widget.getInstallInfo
        .query()
        .then((info) => {
          setState(info ? { status: "ready", info } : { status: "empty" });
        })
        .catch(() => {
          const delay = RETRY_DELAYS_MS[attempt];
          attempt += 1;
          if (delay !== undefined) {
            setTimeout(load, delay);
            return;
          }
          toast.error("Failed to load widget configuration");
          setState({ status: "error" });
        });
    };

    load();
  };

  return { ...state, retry };
}
