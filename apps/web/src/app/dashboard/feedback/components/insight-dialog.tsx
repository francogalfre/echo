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
import { UpgradeDialog } from "../../components/upgrade-dialog";
import { InsightContent } from "./insight-content";

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
        <DialogContent className="max-w-lg">
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
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-4/5 rounded" />
              <Skeleton className="h-3 w-3/5 rounded" />
            </div>
          )}

          {state.status === "ready" && <InsightContent insight={state.insight} />}
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
