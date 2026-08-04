"use client";

import { useState } from "react";
import { Button } from "@echo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@echo/ui/components/dialog";
import { Icons } from "@echo/ui/components/icons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type FeedbackSelectionBarProps = {
  count: number;
  onAddToBoard: () => void;
  onDelete: () => void;
  onClear: () => void;
};

export function FeedbackSelectionBar({
  count,
  onAddToBoard,
  onDelete,
  onClear,
}: FeedbackSelectionBarProps): React.ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <AnimatePresence initial={false}>
        {count > 0 && (
          <motion.div
            role="toolbar"
            aria-label="Bulk actions"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-3 rounded-full bg-foreground px-4 py-2.5 text-background shadow-lg"
          >
            <span className="text-xs font-medium tabular-nums">{count} selected</span>

            <div className="h-4 w-px bg-background/20" />

            <button
              type="button"
              aria-label="Add selected feedback to board"
              onClick={onAddToBoard}
              className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
            >
              <Icons.board className="size-3.5" />
              Add to board
            </button>

            <button
              type="button"
              aria-label="Delete selected feedback"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 transition-opacity hover:opacity-70"
            >
              <Icons.trash className="size-3.5" />
              Delete
            </button>

            <button
              type="button"
              aria-label="Clear selection"
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
            >
              <Icons.x className="size-3.5" />
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="gap-6 p-8 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {count} feedback?</DialogTitle>
            <DialogDescription>
              This permanently deletes the selected feedback and cannot be undone. Any of
              them currently on the board will be removed from there too.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setConfirmOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
