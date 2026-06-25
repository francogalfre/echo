"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

export type ApiKeys = {
  publicKey: string;
  secretKey: string | null;
  hasSecret: boolean;
  justGenerated: boolean;
};

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; keys: ApiKeys };

type Pending = "generate" | "roll" | null;

export function useApiKeys(): {
  state: State;
  pending: Pending;
  generate: () => Promise<void>;
  roll: () => Promise<void>;
} {
  const [state, setState] = useState<State>({ status: "loading" });
  const [pending, setPending] = useState<Pending>(null);

  useEffect(() => {
    trpc.apiKeys.get
      .query()
      .then((data) => {
        setState(
          data
            ? {
                status: "ready",
                keys: {
                  publicKey: data.publicKey,
                  secretKey: null,
                  hasSecret: true,
                  justGenerated: false,
                },
              }
            : { status: "empty" },
        );
      })
      .catch(() => {
        toast.error("Failed to load API keys");
        setState({ status: "empty" });
      });
  }, []);

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
