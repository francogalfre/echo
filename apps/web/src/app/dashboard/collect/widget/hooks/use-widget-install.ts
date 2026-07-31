"use client";

import { useEffect, useRef } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

export type WidgetInstall = {
  publicKey: string;
  orgSlug: string;
  name: string;
  logo: string | null;
  accentColor: string;
};

export type WidgetInstallInitial = { info: WidgetInstall | null } | { error: true };

type UseWidgetInstallResult =
  | { status: "loading"; retry: () => void }
  | { status: "empty"; retry: () => void }
  | { status: "error"; retry: () => void }
  | { status: "ready"; info: WidgetInstall; retry: () => void };

export function useWidgetInstall(initial: WidgetInstallInitial): UseWidgetInstallResult {
  const hasInitialInfo = !("error" in initial);
  const previousStatusRef = useRef<"loading" | "ready" | "error">("loading");

  const { state, refresh } = useAsyncResource<WidgetInstall | null>(
    () => trpc.widget.getInstallInfo.query(),
    hasInitialInfo ? { initialData: initial.info } : undefined,
  );

  useEffect(() => {
    if (state.status === "error" && previousStatusRef.current !== "error") {
      toast.error("Failed to load widget configuration");
    }
    previousStatusRef.current = state.status;
  }, [state.status]);

  if (state.status === "loading") return { status: "loading", retry: refresh };
  if (state.status === "error") return { status: "error", retry: refresh };
  return state.data
    ? { status: "ready", info: state.data, retry: refresh }
    : { status: "empty", retry: refresh };
}
