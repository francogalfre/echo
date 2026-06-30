"use client";

import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";

import { DigestModal } from "../feedback/components/digest-modal";

export function AiSummaryCard(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex items-center gap-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <Icons.aiMagic className="size-4 text-violet-600 dark:text-violet-400" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI Summary</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Get an instant overview of what your users are saying.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Icons.aiMagic className="size-3" />
          View summary
        </button>
      </div>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
