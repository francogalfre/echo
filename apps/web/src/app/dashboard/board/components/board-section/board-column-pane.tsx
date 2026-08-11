"use client";

import {
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
} from "@echo/ui/components/reui/kanban";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { durations, easings, fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { AnimatePresence, motion } from "motion/react";

import type { BoardCard, BoardColumns } from "@echo/api/types";

import { BoardCardItem } from "../board-card";

type BoardColumnPaneProps = {
  id: keyof BoardColumns;
  label: string;
  dot: string;
  items: BoardCard[];
  removingIds: ReadonlySet<string>;
  shouldReduceMotion: boolean;
  showClear: boolean;
  onSelect: (item: BoardCard) => void;
  onRemove: (item: BoardCard) => void;
  onClearDone: () => void;
};

export function BoardColumnPane({
  id,
  label,
  dot,
  items,
  removingIds,
  shouldReduceMotion,
  showClear,
  onSelect,
  onRemove,
  onClearDone,
}: BoardColumnPaneProps): React.ReactElement {
  return (
    <KanbanColumn
      value={id}
      className="flex w-[85vw] max-w-80 shrink-0 snap-start flex-col gap-2.5 rounded-xl border border-border min-h-full bg-muted/30 p-3 md:w-auto md:max-w-none md:shrink"
    >
      <div className="flex items-center gap-1.5 px-1">
        <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${dot}`} />
        <span className="text-[13px] font-semibold">{label}</span>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {items.length}
        </span>
        {showClear && items.length > 0 && (
          <Button variant="ghost" size="xs" className="ml-auto" onClick={onClearDone}>
            Clear
          </Button>
        )}
      </div>

      <KanbanColumnContent value={id}>
        {shouldReduceMotion ? (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <KanbanItem key={item.id} value={item.id}>
                <BoardCardItem
                  item={item}
                  onRemove={() => onRemove(item)}
                  onClick={() => onSelect(item)}
                  isRemoving={removingIds.has(item.id)}
                />
              </KanbanItem>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-2"
            variants={staggerContainer(0.04)}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.div key={item.id} variants={fadeInUp}>
                <KanbanItem value={item.id}>
                  <BoardCardItem
                    item={item}
                    onRemove={() => onRemove(item)}
                    onClick={() => onSelect(item)}
                    isRemoving={removingIds.has(item.id)}
                  />
                </KanbanItem>
              </motion.div>
            ))}
          </motion.div>
        )}
      </KanbanColumnContent>

      <AnimatePresence>
        {items.length === 0 && (
          <motion.div
            key="empty-hint"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: durations.fast, ease: easings.out }}
            className="flex min-h-[16rem] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 py-8 text-center"
          >
            <Icons.board className="size-4 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground/60">Drop cards here</p>
          </motion.div>
        )}
      </AnimatePresence>
    </KanbanColumn>
  );
}
