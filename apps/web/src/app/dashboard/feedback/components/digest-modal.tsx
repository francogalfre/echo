"use client";

import { Button } from "@echo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@echo/ui/components/dialog";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { useEffect } from "react";

import { useDigest } from "../hooks/use-digest";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DigestModal({ open, onOpenChange }: Props): React.ReactElement {
  const { state, load, generate } = useDigest();

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const isGenerating = state.status === "generating";
  const isLoading = state.status === "loading";
  const data = state.status === "ready" ? state.data : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-accent/10">
              <Icons.aiMagic className="size-4 text-accent" />
            </span>
            <div>
              <DialogTitle>AI Summary</DialogTitle>
              {data && (
                <DialogDescription>
                  {data.feedbackCount} feedbacks ·{" "}
                  {formatRelativeTime(data.generatedAt.toISOString())}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {(isLoading || isGenerating) && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-6">
            <Icons.loading className="size-4 shrink-0 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isGenerating ? "Analyzing your feedback…" : "Loading…"}
            </p>
          </div>
        )}

        {state.status === "idle" && !isLoading && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-8 text-center">
            <Icons.aiMagic className="size-8 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium">No digest yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Generate an AI summary of your feedback. Free plan refreshes weekly.
              </p>
            </div>
            <Button size="sm" onClick={() => void generate()}>
              <Icons.aiMagic data-icon="inline-start" className="size-3.5" />
              Generate Digest
            </Button>
          </div>
        )}

        {data && !isGenerating && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {data.digest.executiveSummary}
              </p>
            </div>

            {data.digest.themes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Main Themes
                </p>
                <div className="flex flex-col gap-2">
                  {data.digest.themes.map((theme) => (
                    <div
                      key={theme.title}
                      className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                    >
                      <span className="mt-0.5 min-w-[1.75rem] rounded-full bg-muted px-1.5 py-0.5 text-center text-xs font-semibold text-muted-foreground">
                        {theme.count}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{theme.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {theme.insight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.digest.topIssues.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top Issues
                </p>
                <ul className="flex flex-col gap-1.5">
                  {data.digest.topIssues.map((issue) => (
                    <li
                      key={issue}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-500" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.digest.positiveHighlight && (
              <div className="rounded-xl border border-success/20 bg-success/10 p-3">
                <p className="text-xs font-semibold text-success">What users love</p>
                <p className="mt-1 text-sm text-success">{data.digest.positiveHighlight}</p>
              </div>
            )}

            {data.canRegenerate && (
              <button
                type="button"
                onClick={() => void generate()}
                className="flex items-center gap-1.5 self-start text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icons.loading className="size-3" />
                Regenerate
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
