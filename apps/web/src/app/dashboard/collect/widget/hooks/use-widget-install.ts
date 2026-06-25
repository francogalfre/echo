"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

export type WidgetInstall = {
  publicKey: string;
  orgSlug: string;
};

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; info: WidgetInstall };

export function useWidgetInstall(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    trpc.widget.getInstallInfo
      .query()
      .then((info) => setState(info ? { status: "ready", info } : { status: "empty" }))
      .catch(() => {
        toast.error("Failed to load widget configuration");
        setState({ status: "empty" });
      });
  }, []);

  return state;
}
