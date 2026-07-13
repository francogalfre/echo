"use client";

import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";

export type ApiKeys = {
  publicKey: string;
  secretKey: string | null;
  hasSecret: boolean;
  justGenerated: boolean;
};

export type ApiKeysInitial = { publicKey: string; hasSecret: boolean } | null;

type State = { status: "empty" } | { status: "ready"; keys: ApiKeys };

type Pending = "generate" | "roll" | null;

function toState(initial: ApiKeysInitial): State {
  return initial
    ? {
        status: "ready",
        keys: {
          publicKey: initial.publicKey,
          secretKey: null,
          hasSecret: true,
          justGenerated: false,
        },
      }
    : { status: "empty" };
}

export function useApiKeys(initial: ApiKeysInitial): {
  state: State;
  pending: Pending;
  generate: () => Promise<void>;
  roll: () => Promise<void>;
} {
  const [state, setState] = useState<State>(() => toState(initial));
  const [pending, setPending] = useState<Pending>(null);

  const issue = async (action: "generate" | "roll"): Promise<void> => {
    setPending(action);
    try {
      const data = await trpc.apiKeys[action].mutate();
      setState({
        status: "ready",
        keys: { ...data, hasSecret: true, justGenerated: true },
      });
      toast.success(
        action === "generate"
          ? "API keys generated"
          : "Keys rolled — previous keys are now invalid",
      );
    } catch {
      toast.error(
        action === "generate" ? "Failed to generate keys" : "Failed to roll keys",
      );
    } finally {
      setPending(null);
    }
  };

  return {
    state,
    pending,
    generate: () => issue("generate"),
    roll: () => issue("roll"),
  };
}
