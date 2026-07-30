"use client";

import echoIdle from "@echo/assets/character/idle.webp";
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
import { durations, easings } from "@echo/ui/lib/motion";
import type { DigestOutput } from "@echo/ai";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { AiThinking } from "./ai-thinking";
import { ErrorCard } from "./error-card";
import { UpgradeDialog } from "./upgrade-dialog";
import { useDigest } from "../hooks/use-digest";
import { DIGEST_SECTIONS, type DigestSectionId } from "./agent-personas";

const SECTION_THINKING_PHRASES = [
  "Reading feedback",
  "Finding patterns",
  "Analyzing mood",
] as const;

const SECTION_TRANSITION = { duration: durations.fast, ease: easings.out };
const HISTORY_ACTIVE_SPRING = { type: "spring", stiffness: 500, damping: 40 } as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function IssuesContent({ digest }: { digest: DigestOutput }): React.ReactElement {
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

function ThemesContent({ digest }: { digest: DigestOutput }): React.ReactElement {
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

function MoodContent({ digest }: { digest: DigestOutput }): React.ReactElement {
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
  const [activeSection, setActiveSection] = useState<DigestSectionId>("issues");

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
                <Image
                  src={echoIdle}
                  alt="Echo"
                  className="size-8 shrink-0 rounded-full object-cover"
                  priority
                />
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
              {DIGEST_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "border-accent text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <section.icon className="size-4" />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:grid sm:grid-cols-[1fr_200px] sm:gap-6">
            <div className="flex flex-col gap-4">
              {(isLoading || isGenerating) && (
                <AiThinking phrases={SECTION_THINKING_PHRASES}>
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
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={SECTION_TRANSITION}
                  >
                    {activeSection === "issues" && <IssuesContent digest={activeDigest} />}
                    {activeSection === "themes" && <ThemesContent digest={activeDigest} />}
                    {activeSection === "mood" && <MoodContent digest={activeDigest} />}
                  </motion.div>
                </AnimatePresence>
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
                        "relative rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                        selectedId === null ? "font-medium" : "hover:bg-muted",
                      )}
                    >
                      {selectedId === null && (
                        <motion.span
                          layoutId="digest-history-active"
                          transition={HISTORY_ACTIVE_SPRING}
                          className="absolute inset-0 rounded-lg bg-muted"
                        />
                      )}
                      <span className="relative">Latest</span>
                    </button>
                    {history.map((entry) => {
                      const isActive = selectedId === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => selectHistoryEntry(entry.id)}
                          className={cn(
                            "relative flex flex-col items-start rounded-lg px-2 py-1.5 text-left transition-colors",
                            !isActive && "hover:bg-muted",
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="digest-history-active"
                              transition={HISTORY_ACTIVE_SPRING}
                              className="absolute inset-0 rounded-lg bg-muted"
                            />
                          )}
                          <span className="relative text-sm">
                            {formatRelativeTime(entry.generatedAt.toISOString())}
                          </span>
                          <span className="relative text-xs text-muted-foreground">
                            {entry.feedbackCount} feedbacks
                          </span>
                        </button>
                      );
                    })}
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
                    <Icons.refresh className="size-3.5" />
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
