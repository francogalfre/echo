"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";
import type { DigestOutput } from "@echo/ai";

export type DigestItem = {
  digest: DigestOutput;
  generatedAt: Date;
  feedbackCount: number;
  canRegenerate: boolean;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: DigestItem }
  | { status: "generating" }
  | { status: "error"; message: string };

export function useDigest(): {
  state: State;
  load: () => Promise<void>;
  generate: () => Promise<void>;
} {
  const [state, setState] = useState<State>({ status: "idle" });

  const load = useCallback(async (): Promise<void> => {
    setState({ status: "loading" });
    try {
      const result = await trpc.digest.get.query();
      if (!result.digest || !result.generatedAt) {
        setState({ status: "idle" });
        return;
      }
      setState({
        status: "ready",
        data: {
          digest: result.digest,
          generatedAt: new Date(result.generatedAt),
          feedbackCount: result.feedbackCount,
          canRegenerate: result.canRegenerate,
        },
      });
    } catch {
      setState({ status: "error", message: "Failed to load digest." });
    }
  }, []);

  const generate = useCallback(async (): Promise<void> => {
    setState((prev) =>
      prev.status === "ready"
        ? { ...prev, status: "generating" }
        : { status: "generating" },
    );
    try {
      const result = await trpc.digest.generate.mutate();
      setState({
        status: "ready",
        data: {
          digest: result.digest,
          generatedAt: new Date(result.generatedAt),
          feedbackCount: result.feedbackCount,
          canRegenerate: false,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to generate digest.";
      toast.error(message);
      setState((prev) => (prev.status === "generating" ? { status: "idle" } : prev));
    }
  }, []);

  return { state, load, generate };
}
