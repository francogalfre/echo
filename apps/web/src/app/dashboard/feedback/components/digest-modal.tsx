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
import type { DigestOutput } from "@echo/ai";
import { useEffect, useState } from "react";

import { useDigest } from "../hooks/use-digest";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DigestContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {digest.executiveSummary}
        </p>
      </div>

      {digest.themes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Themes
          </p>
          <div className="flex flex-col gap-2">
            {digest.themes.map((theme) => (
              <div
                key={theme.title}
                className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
              >
                <span className="mt-0.5 min-w-[1.75rem] rounded-full bg-muted px-1.5 py-0.5 text-center text-xs font-semibold text-muted-foreground">
                  {theme.count}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{theme.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{theme.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {digest.topIssues.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Issues
          </p>
          <ul className="flex flex-col gap-1.5">
            {digest.topIssues.map((issue) => (
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

      {digest.positiveHighlight && (
        <div className="rounded-xl border border-success/20 bg-success/10 p-3">
          <p className="text-xs font-semibold text-success">What users love</p>
          <p className="mt-1 text-sm text-success">{digest.positiveHighlight}</p>
        </div>
      )}
    </div>
  );
}

export function DigestModal({ open, onOpenChange }: Props): React.ReactElement {
  const { state, load, generate, history, selectedId, selectHistoryEntry } = useDigest();
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) {
      setHistoryOpen(false);
    }
  }, [open]);

  const isGenerating = state.status === "generating";
  const isLoading = state.status === "loading";
  const data = state.status === "ready" ? state.data : null;

  const selectedEntry = selectedId
    ? (history.find((entry) => entry.id === selectedId) ?? null)
    : null;

  const feedbackCount = selectedEntry ? selectedEntry.feedbackCount : data?.feedbackCount;
  const generatedAt = selectedEntry ? selectedEntry.generatedAt : data?.generatedAt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent/10">
                <Icons.aiMagic className="size-4 text-accent" />
              </span>
              <div>
                <DialogTitle>AI Summary</DialogTitle>
                {feedbackCount !== undefined && generatedAt && (
                  <DialogDescription>
                    {feedbackCount} feedbacks ·{" "}
                    {formatRelativeTime(generatedAt.toISOString())}
                  </DialogDescription>
                )}
              </div>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistoryOpen((prev) => !prev)}
                className="shrink-0"
              >
                <Icons.clock data-icon="inline-start" className="size-3.5" />
                History
              </Button>
            )}
          </div>
        </DialogHeader>

        {historyOpen && history.length > 0 && (
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-2">
            {history.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  selectHistoryEntry(entry.id);
                  setHistoryOpen(false);
                }}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-background"
              >
                <span className="text-foreground">
                  {formatRelativeTime(entry.generatedAt.toISOString())}
                </span>
                <span className="text-xs text-muted-foreground">
                  {entry.feedbackCount} feedbacks
                </span>
              </button>
            ))}
          </div>
        )}

        {(isLoading || isGenerating) && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-6">
            <Icons.loading className="size-4 shrink-0 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isGenerating ? "Analyzing your feedback…" : "Loading…"}
            </p>
          </div>
        )}

        {state.status === "idle" && !isLoading && !selectedEntry && (
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

        {selectedEntry && !isGenerating && (
          <div className="flex flex-col gap-4">
            <DigestContent digest={selectedEntry.digest} />
            <button
              type="button"
              onClick={() => selectHistoryEntry(null)}
              className="flex items-center gap-1.5 self-start text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.arrowLeft className="size-3" />
              Back to latest
            </button>
          </div>
        )}

        {data && !selectedEntry && !isGenerating && (
          <div className="flex flex-col gap-4">
            <DigestContent digest={data.digest} />

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
