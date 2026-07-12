"use client";

import { useCallback, useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";
import type { DigestOutput } from "@echo/ai";

import { isUpgradeError } from "../../components/upgrade-error";

export type DigestItem = {
  digest: DigestOutput;
  generatedAt: Date;
  feedbackCount: number;
  canRegenerate: boolean;
};

export type DigestHistoryItem = {
  id: string;
  digest: DigestOutput;
  generatedAt: Date;
  feedbackCount: number;
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
  history: DigestHistoryItem[];
  selectedId: string | null;
  selectHistoryEntry: (id: string | null) => void;
  upgradeReason: string | null;
  dismissUpgrade: () => void;
} {
  const [state, setState] = useState<State>({ status: "idle" });
  const [history, setHistory] = useState<DigestHistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null);

  const dismissUpgrade = useCallback((): void => setUpgradeReason(null), []);

  const loadHistory = useCallback(async (): Promise<void> => {
    try {
      const result = await trpc.digest.history.query();
      setHistory(
        result.map((entry) => ({
          id: entry.id,
          digest: entry.digest,
          generatedAt: new Date(entry.generatedAt),
          feedbackCount: entry.feedbackCount,
        })),
      );
    } catch {
      // History is a secondary, non-blocking feature — ignore load failures
    }
  }, []);

  const load = useCallback(async (): Promise<void> => {
    setState({ status: "loading" });
    void loadHistory();
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
  }, [loadHistory]);

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
      setSelectedId(null);
      void loadHistory();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to generate digest.";
      if (isUpgradeError(message)) {
        setUpgradeReason(message);
      } else {
        toast.error(message);
      }
      setState((prev) => (prev.status === "generating" ? { status: "idle" } : prev));
    }
  }, [loadHistory]);

  const selectHistoryEntry = useCallback((id: string | null): void => {
    setSelectedId(id);
  }, []);

  return {
    state,
    load,
    generate,
    history,
    selectedId,
    selectHistoryEntry,
    upgradeReason,
    dismissUpgrade,
  };
}
