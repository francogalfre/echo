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
import { useEffect, useState } from "react";

import { AiThinking } from "./ai-thinking";
import { ErrorCard } from "./error-card";
import { UpgradeDialog } from "./upgrade-dialog";
import { useDigest } from "../hooks/use-digest";
import { ANALYSIS_AGENTS, getAgent } from "./agent-personas";
import type { AgentId } from "./agent-personas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SentinelContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {digest.topIssues.length > 0 ? (
        <Stagger className="flex flex-col gap-2" stagger={0.04}>
          {digest.topIssues.map((issue) => (
            <StaggerItem key={issue}>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                <p className="text-sm text-muted-foreground">{issue}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <p className="text-sm text-muted-foreground">No issues detected.</p>
      )}
    </div>
  );
}

function CompassContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {digest.themes.length > 0 ? (
        <Stagger className="flex flex-col gap-2" stagger={0.04}>
          {digest.themes.map((theme) => (
            <StaggerItem key={theme.title}>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                <span className="mt-0.5 min-w-[1.75rem] rounded-md bg-muted px-1.5 py-0.5 text-center text-xs font-medium tabular-nums text-muted-foreground">
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
      ) : (
        <p className="text-sm text-muted-foreground">No themes identified yet.</p>
      )}
    </div>
  );
}

function PulseContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {digest.positiveHighlight ? (
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs text-muted-foreground">What users love</p>
          <p className="mt-1 text-sm">{digest.positiveHighlight}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No sentiment data yet.</p>
      )}
    </div>
  );
}

function DigestSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
          >
            <Skeleton className="mt-0.5 h-5 w-7 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="mt-1.5 h-3 w-full" />
            </div>
          </div>
        ))}
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
  const [activeAgent, setActiveAgent] = useState<AgentId>("sentinel");

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
        <DrawerContent className="max-h-[90vh] sm:max-h-[85vh]">
          <DrawerHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icons.aiMagic className="size-4 text-accent" />
                <div>
                  <DrawerTitle>AI Analysis</DrawerTitle>
                  {feedbackCount !== undefined && generatedAt && (
                    <DrawerDescription>
                      {feedbackCount} feedbacks ·{" "}
                      {formatRelativeTime(generatedAt.toISOString())}
                    </DrawerDescription>
                  )}
                </div>
              </div>
            </div>
          </DrawerHeader>

          {activeDigest && !isGenerating && (
            <div className="flex gap-1 border-b px-6">
              {ANALYSIS_AGENTS.map((agentId) => {
                const agent = getAgent(agentId);
                const AgentIcon = agent.icon;
                return (
                  <button
                    key={agentId}
                    type="button"
                    onClick={() => setActiveAgent(agentId)}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                      activeAgent === agentId
                        ? "border-accent text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={`flex size-5 items-center justify-center rounded-full ${agent.avatarBg}`}
                    >
                      <AgentIcon className={`size-2.5 ${agent.avatarText}`} />
                    </span>
                    <span>{agent.name}</span>
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      · {agent.role}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:grid sm:grid-cols-[1fr_200px] sm:gap-6">
            <div className="flex flex-col gap-4">
              {(isLoading || isGenerating) && (
                <AiThinking phrases={getAgent(activeAgent).thinkingPhrases}>
                  <DigestSkeleton />
                </AiThinking>
              )}

              {state.status === "error" && (
                <ErrorCard
                  message="Could not load analysis. Please try again."
                  onRetry={() => void load()}
                />
              )}

              {state.status === "idle" && !isLoading && !selectedEntry && (
                <EmptyState
                  icon={<Icons.aiMagic />}
                  title="No analysis yet"
                  description="Generate an AI analysis of your feedback."
                  action={
                    <Button size="sm" onClick={() => void generate()}>
                      <Icons.aiMagic data-icon="inline-start" className="size-3.5" />
                      Generate Analysis
                    </Button>
                  }
                />
              )}

              {activeDigest && !isGenerating && (
                <>
                  {activeAgent === "sentinel" && <SentinelContent digest={activeDigest} />}
                  {activeAgent === "compass" && <CompassContent digest={activeDigest} />}
                  {activeAgent === "pulse" && <PulseContent digest={activeDigest} />}
                </>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0">
              {history.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">History</p>
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
            <DrawerFooter className="flex-row border-t px-6 pb-6 pt-4">
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
