"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@echo/ui/components/dialog";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { useEffect } from "react";

import type { FeedbackItem } from "../utils/map-feedback";
import { useFeedbackInsight } from "../hooks/use-feedback-insight";
import { AiThinking } from "../../components/ai-thinking";
import { ErrorCard } from "../../components/error-card";
import { UpgradeDialog } from "../../components/upgrade-dialog";
import { InsightContent } from "./insight-content";

const THINKING_PHRASES = [
  "Reading your feedback",
  "Finding patterns",
  "Writing the summary",
] as const;

type InsightDialogProps = {
  item: FeedbackItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InsightDialog({
  item,
  open,
  onOpenChange,
}: InsightDialogProps): React.ReactElement {
  const { state, generate, reset, upgradeReason, dismissUpgrade } = useFeedbackInsight();

  useEffect(() => {
    if (open && item && state.status === "idle") {
      void generate(item.id);
    }
    if (!open) {
      reset();
    }
  }, [open, item, state.status, generate, reset]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl gap-6 p-8">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent/10">
                <Icons.aiMagic className="size-4 text-accent" />
              </span>
              <div>
                <DialogTitle>AI Insight</DialogTitle>
                {item && (
                  <DialogDescription>
                    Explaining feedback from {item.name}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {state.status === "loading" && (
            <AiThinking phrases={THINKING_PHRASES}>
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-4/5 rounded" />
                <Skeleton className="h-3 w-3/5 rounded" />
              </div>
            </AiThinking>
          )}

          {state.status === "ready" && <InsightContent insight={state.insight} />}

          {state.status === "error" && (
            <ErrorCard
              message="We couldn't generate this insight. Please try again."
              onRetry={() => {
                if (item) void generate(item.id);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
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
