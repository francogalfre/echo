"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icons } from "@echo/ui/components/icons";
import { useEffect } from "react";

import type { FeedbackItem } from "../hooks/use-feedback";
import { useFeedbackInsight } from "../hooks/use-feedback-insight";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FeedbackItem | null;
};

export function InsightModal({ open, onOpenChange, item }: Props): React.ReactElement {
  const { state, generate, reset } = useFeedbackInsight();

  useEffect(() => {
    if (open && item) {
      void generate(item.id);
    }
    if (!open) {
      reset();
    }
  }, [open, item, generate, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-200 data-closed:opacity-0 data-open:opacity-100" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/10 outline-none transition-all duration-200 data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <Icons.aiMagic className="size-4 text-violet-600 dark:text-violet-400" />
              </span>
              <div>
                <Dialog.Title className="text-base font-semibold tracking-tight">
                  AI Insight
                </Dialog.Title>
                {item && (
                  <p className="text-xs text-muted-foreground">
                    Based on feedback from {item.name}
                  </p>
                )}
              </div>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.cancelCircle className="size-5" />
            </Dialog.Close>
          </div>

          {state.status === "loading" && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-6">
              <Icons.loading className="size-4 shrink-0 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Analyzing feedback…</p>
            </div>
          )}

          {state.status === "ready" && (
            <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:text-muted-foreground">
              {state.insight.split("\n").map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                  return (
                    <p key={i} className="font-semibold text-foreground">
                      {trimmed.slice(2, -2)}
                    </p>
                  );
                }
                if (trimmed.startsWith("- **")) {
                  const colonIdx = trimmed.indexOf("**:", 4);
                  const heading = colonIdx > 0 ? trimmed.slice(4, colonIdx) : null;
                  const rest =
                    colonIdx > 0 ? trimmed.slice(colonIdx + 3).trim() : trimmed.slice(2);
                  return (
                    <p key={i} className="text-muted-foreground">
                      {heading && <strong className="text-foreground">{heading}: </strong>}
                      {rest}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-muted-foreground">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
