"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { formatCount } from "@echo/ui/lib/format";
import * as React from "react";

import { DigestModal } from "../feedback/components/digest-modal";

type AiSummaryBannerProps = {
  total: number;
};

function summaryDescription(total: number): string {
  if (total === 0) return "Connect a source to start generating AI insights.";
  return `We analyzed ${formatCount(total)} piece${total === 1 ? "" : "s"} of feedback and identified key insights.`;
}

export function AiSummaryBanner({ total }: AiSummaryBannerProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg bg-card p-5 ring-1 ring-foreground/10">
        <div className="flex items-center gap-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <Icons.aiMagic className="size-4 text-accent" />
          </span>
          <div>
            <p className="text-sm font-medium">AI Summary</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {summaryDescription(total)}
            </p>
          </div>
        </div>
        <Button size="lg" onClick={() => setOpen(true)}>
          <Icons.aiMagic data-icon="inline-start" className="size-4" />
          View summary
        </Button>
      </div>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
