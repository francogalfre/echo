"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; insight: string };

export function useFeedbackInsight(): {
  state: State;
  generate: (feedbackId: string) => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<State>({ status: "idle" });

  const generate = useCallback(async (feedbackId: string): Promise<void> => {
    setState({ status: "loading" });
    try {
      const result = await trpc.feedback.insight.mutate({ id: feedbackId });
      setState({ status: "ready", insight: result.insight });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not generate insight";
      toast.error(message);
      setState({ status: "idle" });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, generate, reset };
}
