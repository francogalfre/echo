"use client";

import { Button } from "@echo/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@echo/ui/components/drawer";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import type { DigestOutput } from "@echo/ai";
import { useEffect } from "react";

import { AiThinking } from "./ai-thinking";
import { ErrorCard } from "./error-card";
import { UpgradeDialog } from "./upgrade-dialog";
import { useDigest } from "../hooks/use-digest";

const THINKING_PHRASES = [
  "Reading your feedback",
  "Grouping themes",
  "Writing the summary",
] as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ThemesAndIssues({ digest }: { digest: DigestOutput }): React.ReactElement {
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
          <Stagger className="flex flex-col gap-2">
            {digest.themes.map((theme) => (
              <StaggerItem key={theme.title}>
                <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                  <span className="mt-0.5 min-w-[1.75rem] rounded-full bg-muted px-1.5 py-0.5 text-center text-xs font-semibold text-muted-foreground">
                    {theme.count}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{theme.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{theme.insight}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}

      {digest.topIssues.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Issues
          </p>
          <Stagger className="flex flex-col gap-1.5">
            {digest.topIssues.map((issue) => (
              <StaggerItem key={issue}>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                  {issue}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}
    </div>
  );
}

function DigestSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-11/12" />
        <Skeleton className="mt-2 h-3.5 w-2/3" />
      </div>

      <div>
        <Skeleton className="mb-2 h-3 w-24" />
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
            >
              <Skeleton className="mt-0.5 h-5 w-7 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="mt-1.5 h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="mb-2 h-3 w-20" />
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <Skeleton className="mt-1.5 size-1.5 shrink-0 rounded-full" />
              <Skeleton className="h-3.5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DigestModal({ open, onOpenChange }: Props): React.ReactElement {
  const {
    state,
    load,
    generate,
    history,
    selectedId,
    selectHistoryEntry,
    upgradeReason,
    dismissUpgrade,
  } = useDigest();

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const isGenerating = state.status === "generating";
  const isLoading = state.status === "loading";
  const data = state.status === "ready" ? state.data : null;

  const selectedEntry = selectedId
    ? (history.find((entry) => entry.id === selectedId) ?? null)
    : null;
  const activeDigest = selectedEntry ? selectedEntry.digest : data?.digest;
  const feedbackCount = selectedEntry ? selectedEntry.feedbackCount : data?.feedbackCount;
  const generatedAt = selectedEntry ? selectedEntry.generatedAt : data?.generatedAt;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-0">
          <DrawerHeader className="gap-1 border-b px-8 py-6">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent/10">
                <Icons.aiMagic className="size-4 text-accent" />
              </span>
              <div>
                <DrawerTitle>AI Summary</DrawerTitle>
                {feedbackCount !== undefined && generatedAt && (
                  <DrawerDescription>
                    {feedbackCount} feedbacks ·{" "}
                    {formatRelativeTime(generatedAt.toISOString())}
                  </DrawerDescription>
                )}
              </div>
            </div>
          </DrawerHeader>

          <div className="flex flex-1 flex-col overflow-y-auto p-8 sm:grid sm:grid-cols-[1fr_260px] sm:gap-8">
            <div className="flex flex-col gap-5">
              {(isLoading || isGenerating) && (
                <AiThinking phrases={THINKING_PHRASES}>
                  <DigestSkeleton />
                </AiThinking>
              )}

              {state.status === "error" && (
                <ErrorCard
                  message="We couldn't load your digest. Please try again."
                  onRetry={() => void load()}
                />
              )}

              {state.status === "idle" && !isLoading && !selectedEntry && (
                <EmptyState
                  icon={<Icons.aiMagic />}
                  title="No digest yet"
                  description="Generate an AI summary of your feedback. Free plan refreshes weekly."
                  action={
                    <Button size="sm" onClick={() => void generate()}>
                      <Icons.aiMagic data-icon="inline-start" className="size-3.5" />
                      Generate Digest
                    </Button>
                  }
                />
              )}

              {activeDigest && !isGenerating && <ThemesAndIssues digest={activeDigest} />}
            </div>

            <div className="mt-6 flex flex-col gap-5 sm:mt-0">
              {activeDigest?.positiveHighlight && (
                <div className="rounded-xl border border-success/20 bg-success/10 p-3">
                  <p className="text-xs font-semibold text-success">What users love</p>
                  <p className="mt-1 text-sm text-success">
                    {activeDigest.positiveHighlight}
                  </p>
                </div>
              )}

              {history.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    History
                  </p>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => selectHistoryEntry(null)}
                      className={cn(
                        "rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                        selectedId === null && "bg-muted font-medium",
                      )}
                    >
                      Latest
                    </button>
                    {history.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => selectHistoryEntry(entry.id)}
                        className={cn(
                          "flex flex-col items-start rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted",
                          selectedId === entry.id && "bg-muted",
                        )}
                      >
                        <span className="text-sm">
                          {formatRelativeTime(entry.generatedAt.toISOString())}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.feedbackCount} feedbacks
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {activeDigest && !isGenerating && (
            <DrawerFooter className="flex-row border-t px-8 pb-8 pt-5">
              {selectedEntry ? (
                <Button variant="ghost" size="sm" onClick={() => selectHistoryEntry(null)}>
                  <Icons.arrowLeft className="size-3.5" />
                  Back to latest
                </Button>
              ) : (
                data?.canRegenerate && (
                  <Button variant="outline" size="sm" onClick={() => void generate()}>
                    <Icons.loading className="size-3.5" />
                    Regenerate
                  </Button>
                )
              )}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
      <UpgradeDialog
        open={upgradeReason !== null}
        onOpenChange={(next) => {
          if (!next) dismissUpgrade();
        }}
        reason={upgradeReason ?? ""}
      />
    </>
  );
}
