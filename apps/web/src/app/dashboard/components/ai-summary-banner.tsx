"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import * as React from "react";

import { DigestModal } from "../feedback/components/digest-modal";

export function AiSummaryBanner(): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg bg-card px-5 py-4 ring-1 ring-foreground/10">
        <div className="flex items-center gap-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent/10">
            <Icons.aiMagic className="size-4 text-accent" />
          </span>
          <div>
            <p className="text-sm font-medium">AI Summary</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Get an instant overview of what your users are saying.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Icons.aiMagic data-icon="inline-start" className="size-3.5" />
          View summary
        </Button>
      </div>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
