"use client";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

export type ChatUsage = Awaited<ReturnType<typeof trpc.chat.getUsage.query>>;

type ChatUsageState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: ChatUsage };

export function useChatUsage(reloadKey: number): { state: ChatUsageState } {
  const { state } = useAsyncResource(() => trpc.chat.getUsage.query(), {
    deps: [reloadKey],
  });

  const mapped: ChatUsageState =
    state.status === "error"
      ? { status: "error" }
      : state.status === "ready"
        ? { status: "ready", data: state.data }
        : { status: "loading" };

  return { state: mapped };
}
