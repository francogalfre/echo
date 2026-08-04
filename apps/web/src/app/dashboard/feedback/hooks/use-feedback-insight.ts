"use client";

import { useCallback, useState } from "react";

import { trpc } from "@/lib/trpc";

import { isUpgradeError } from "../../components/upgrade-error";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; insight: string }
  | { status: "error"; message: string };

export function useFeedbackInsight(): {
  state: State;
  generate: (feedbackId: string) => Promise<void>;
  reset: () => void;
  upgradeReason: string | null;
  dismissUpgrade: () => void;
} {
  const [state, setState] = useState<State>({ status: "idle" });
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null);

  const generate = useCallback(async (feedbackId: string): Promise<void> => {
    setState({ status: "loading" });
    try {
      const result = await trpc.feedback.insight.mutate({ id: feedbackId });
      setState({ status: "ready", insight: result.insight });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not generate insight";
      if (isUpgradeError(error)) {
        setUpgradeReason(message);
        setState({ status: "idle" });
      } else {
        setState({ status: "error", message });
      }
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);
  const dismissUpgrade = useCallback((): void => setUpgradeReason(null), []);

  return { state, generate, reset, upgradeReason, dismissUpgrade };
}
