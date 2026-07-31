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
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import { durations, easings } from "@echo/ui/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { AiThinking } from "../ai-thinking";
import { ErrorCard } from "../../error-card";
import { UpgradeDialog } from "../../dialogs/upgrade-dialog";
import { useDigest } from "../../../hooks/use-digest";
import { DIGEST_SECTIONS, type DigestSectionId } from "../../chat/agent-personas";
import { DigestHistoryPanel } from "./digest-history";
import { IssuesContent, MoodContent, DigestSkeleton } from "./digest-summary";
import { ThemesContent } from "./digest-themes";

const SECTION_THINKING_PHRASES = [
  "Reading feedback",
  "Finding patterns",
  "Analyzing mood",
] as const;

const SECTION_TRANSITION = { duration: durations.fast, ease: easings.out };

type DigestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DigestModal({ open, onOpenChange }: DigestModalProps): React.ReactElement {
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
              <DigestHistoryPanel
                history={history}
                selectedId={selectedId}
                onSelect={selectHistoryEntry}
              />
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
