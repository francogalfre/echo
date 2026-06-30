"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icons } from "@echo/ui/components/icons";
import { useEffect } from "react";

import { useDigest } from "../hooks/use-digest";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  return `${diffD}d ago`;
}

export function DigestModal({ open, onOpenChange }: Props): React.ReactElement {
  const { state, load, generate } = useDigest();

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const isGenerating = state.status === "generating";
  const isLoading = state.status === "loading";
  const data = state.status === "ready" ? state.data : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-200 data-closed:opacity-0 data-open:opacity-100" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/10 outline-none transition-all duration-200 data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <Icons.aiMagic className="size-4 text-violet-600 dark:text-violet-400" />
              </span>
              <div>
                <Dialog.Title className="text-base font-semibold tracking-tight">
                  AI Summary
                </Dialog.Title>
                {data && (
                  <p className="text-xs text-muted-foreground">
                    {data.feedbackCount} feedbacks · {formatRelative(data.generatedAt)}
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
              <button
                type="button"
                onClick={() => void generate()}
                className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <Icons.aiMagic className="size-3.5" />
                Generate Digest
              </button>
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
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    What users love
                  </p>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                    {data.digest.positiveHighlight}
                  </p>
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
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
