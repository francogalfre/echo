"use client";

import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";

import { DigestModal } from "./digest-modal";

export function DigestButton(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <Icons.aiMagic className="size-4 text-violet-500" />
        Weekly Digest
      </button>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
