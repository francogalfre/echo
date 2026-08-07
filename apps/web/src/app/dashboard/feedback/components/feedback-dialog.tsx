"use client";

import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@echo/ui/components/dialog";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";

import { AccentAvatar } from "../../components/accent-avatar";
import type { FeedbackItem } from "../utils/map-feedback";
import { addToBoard, buildFeedbackMailto, copyFeedback } from "../utils/feedback-actions";
import { FeedbackDetailList } from "./feedback-detail-list";
import { InsightPanel } from "./insight-panel";

type FeedbackDialogProps = {
  item: FeedbackItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveFromBoard?: () => void;
  onAddToBoard?: () => void;
};

export function FeedbackDialog({
  item,
  open,
  onOpenChange,
  onRemoveFromBoard,
  onAddToBoard,
}: FeedbackDialogProps): React.ReactElement {
  const mailto = item ? buildFeedbackMailto(item) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[calc(100%-2rem)] gap-0 rounded-[28px] bg-muted/40 p-1.5 sm:max-w-xl"
      >
        {item && (
          <div className="overflow-hidden rounded-[22px] bg-card ring-1 ring-border">
            <DialogTitle className="sr-only">Feedback from {item.name}</DialogTitle>
            <DialogDescription className="sr-only">{item.feedback}</DialogDescription>

            <div className="flex items-center gap-3.5 border-b border-border bg-muted/40 px-5 py-3.5">
              <AccentAvatar name={item.name} className="size-11 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-foreground">
                  {item.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {item.email ?? `Submitted ${formatRelativeTime(item.createdAt)}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
                className="shrink-0"
              >
                <Icons.x className="size-4" />
              </Button>
            </div>

            <div className="flex max-h-[70vh] flex-col overflow-y-auto">
              <motion.div
                className="flex flex-col"
                variants={staggerContainer(0.05)}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeInUp} className="px-5 py-5">
                  <p className="text-sm leading-7 text-foreground">{item.feedback}</p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="border-t border-border px-2 py-3"
                >
                  <FeedbackDetailList item={item} />
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="border-t border-border px-5 py-5"
                >
                  <InsightPanel item={item} active={open} bare />
                </motion.div>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-5 py-3">
              <Button variant="ghost" size="sm" onClick={() => copyFeedback(item.feedback)}>
                <Icons.copy className="size-4" />
                Copy
              </Button>
              {onRemoveFromBoard ? (
                <Button variant="ghost" size="sm" onClick={onRemoveFromBoard}>
                  <Icons.cancelCircle className="size-4" />
                  Remove from board
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddToBoard ?? (() => addToBoard(item))}
                >
                  <Icons.board className="size-4" />
                  Add to board
                </Button>
              )}
              {mailto && (
                <a
                  href={mailto}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  <Icons.mail className="size-4" />
                  Send email
                </a>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
