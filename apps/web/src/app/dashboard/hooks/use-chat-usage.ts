"use client";

import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";

export type ChatUsage = Awaited<ReturnType<typeof trpc.chat.getUsage.query>>;

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: ChatUsage };

export function useChatUsage(reloadKey: number): { state: State } {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    trpc.chat.getUsage
      .query()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { state };
}
