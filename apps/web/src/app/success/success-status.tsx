"use client";

import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";

type SyncState = "pending" | "done" | "error";

export function SuccessStatus(): React.ReactElement {
  const [state, setState] = useState<SyncState>("pending");

  useEffect(() => {
    trpc.billing.sync
      .mutate()
      .then(() => setState("done"))
      .catch(() => setState("error"));
  }, []);

  if (state === "error") {
    return (
      <p className="mt-2 max-w-xs text-sm text-pretty text-muted-foreground">
        Your payment went through. If your plan doesn&apos;t update in a minute, refresh the
        billing page.
      </p>
    );
  }

  return (
    <p className="mt-2 max-w-xs text-sm text-pretty text-muted-foreground">
      {state === "pending" ? "Activating your plan…" : "Your subscription is active."}
    </p>
  );
}
