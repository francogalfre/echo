"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

export type WidgetInstall = {
  publicKey: string;
  orgSlug: string;
  name: string;
  logo: string | null;
  accentColor: string;
};

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | { status: "ready"; info: WidgetInstall };

type UseWidgetInstallResult = State & { retry: () => void };

const RETRY_DELAYS_MS = [400, 800] as const;

export function useWidgetInstall(): UseWidgetInstallResult {
  const [state, setState] = useState<State>({ status: "loading" });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;

    setState({ status: "loading" });

    const load = (): void => {
      trpc.widget.getInstallInfo
        .query()
        .then((info) => {
          if (cancelled) return;
          setState(info ? { status: "ready", info } : { status: "empty" });
        })
        .catch(() => {
          if (cancelled) return;
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

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const retry = useCallback((): void => {
    setReloadToken((token) => token + 1);
  }, []);

  return { ...state, retry };
}
