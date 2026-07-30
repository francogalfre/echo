"use client";

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanOverlay,
  type KanbanMoveEvent,
} from "@echo/ui/components/reui/kanban";
import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { durations, easings } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";
import { arrayMove } from "@dnd-kit/sortable";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "@echo/ui/components/toast";
import Link from "next/link";

import { trpc } from "@/lib/trpc";
import type { BoardCard, BoardColumns } from "@echo/api/services/board";

import { BoardCardDialog } from "./board-card-dialog";
import { BoardCardItem } from "./board-card";

const COLUMNS: { id: keyof BoardColumns; label: string; dot: string }[] = [
  { id: "backlog", label: "Backlog", dot: "bg-muted-foreground" },
  { id: "in_progress", label: "In Progress", dot: "bg-info" },
  { id: "done", label: "Done", dot: "bg-success" },
];

const REMOVE_FADE_MS = 200;

type BoardSectionProps = {
  readonly initialItems: BoardColumns;
};

export function BoardSection({ initialItems }: BoardSectionProps): React.ReactElement {
  const [columns, setColumns] = useState<BoardColumns>(initialItems);
  const [selected, setSelected] = useState<BoardCard | null>(null);
  const [removingIds, setRemovingIds] = useState<ReadonlySet<string>>(new Set());
  const shouldReduceMotion = useReducedMotion();

  const handleMove = useCallback(
    ({ activeContainer, activeIndex, overContainer, overIndex }: KanbanMoveEvent) => {
      const fromColumn = activeContainer as keyof BoardColumns;
      const toColumn = overContainer as keyof BoardColumns;
      const item = columns[fromColumn]?.[activeIndex];
      if (!item) return;

      if (fromColumn === toColumn) {
        const reordered = arrayMove(columns[fromColumn], activeIndex, overIndex);
        setColumns((prev) => ({ ...prev, [fromColumn]: reordered }));

        trpc.board.reorder
          .mutate({ column: fromColumn, orderedIds: reordered.map((i) => i.id) })
          .catch(() => toast.error("Failed to reorder board"));
        return;
      }

      const fromItems = [...columns[fromColumn]];
      fromItems.splice(activeIndex, 1);
      const toItems = [...columns[toColumn]];
      toItems.splice(overIndex, 0, item);

      setColumns((prev) => ({ ...prev, [fromColumn]: fromItems, [toColumn]: toItems }));

      trpc.board.move
        .mutate({ id: item.id, column: toColumn, position: overIndex })
        .then(() =>
          Promise.all([
            trpc.board.reorder.mutate({
              column: fromColumn,
              orderedIds: fromItems.map((i) => i.id),
            }),
            trpc.board.reorder.mutate({
              column: toColumn,
              orderedIds: toItems.map((i) => i.id),
            }),
          ]),
        )
        .catch(() => toast.error("Failed to move item"));
    },
    [columns],
  );

  const removeIds = useCallback(
    (ids: readonly string[]) => {
      const idSet = new Set(ids);
      setRemovingIds((prev) => new Set([...prev, ...ids]));

      const commit = (): void => {
        setColumns((prev) => {
          const next = { ...prev };
          for (const col of Object.keys(next) as (keyof BoardColumns)[]) {
            next[col] = next[col].filter((i) => !idSet.has(i.id));
          }
          return next;
        });
        setRemovingIds((prev) => {
          const next = new Set(prev);
          for (const id of ids) next.delete(id);
          return next;
        });
      };

      if (shouldReduceMotion) {
        commit();
      } else {
        setTimeout(commit, REMOVE_FADE_MS);
      }
    },
    [shouldReduceMotion],
  );

  const handleRemove = useCallback(
    (item: BoardCard) => {
      removeIds([item.id]);
      trpc.board.remove
        .mutate({ id: item.id })
        .catch(() => toast.error("Failed to remove item"));
    },
    [removeIds],
  );

  const handleClearDone = useCallback(() => {
    removeIds(columns.done.map((item) => item.id));
    trpc.board.clearColumn
      .mutate({ column: "done" })
      .catch(() => toast.error("Failed to clear done"));
  }, [columns.done, removeIds]);

  const totalItems = Object.values(columns).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalItems === 0
              ? "Add feedback from the Feedback page."
              : `${totalItems} item${totalItems === 1 ? "" : "s"} across ${COLUMNS.length} columns.`}
          </p>
        </div>
        <Link
          href="/dashboard/feedback"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Icons.message className="size-3.5" />
          Feedback
        </Link>
      </div>

      <div className="flex-1 min-h-0">
        {totalItems === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border">
            <EmptyState
              icon={<Icons.board />}
              title="Your board is empty"
              description="Add feedback to the board from the Feedback page — open an item's menu and choose Add to board."
              action={
                <Link
                  href="/dashboard/feedback"
                  className={cn(buttonVariants({ size: "sm" }), "active:scale-[0.96]")}
                >
                  Browse feedback
                </Link>
              }
            />
          </div>
        ) : (
          <Kanban
            value={columns}
            onValueChange={(v) => setColumns(v as BoardColumns)}
            getItemValue={(item: BoardCard) => item.id}
            onMove={handleMove}
            className="flex h-full flex-col"
          >
            <KanbanBoard className="grid flex-1 min-h-0 grid-cols-3 gap-4">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  value={col.id}
                  className="flex h-full flex-col gap-2.5 rounded-xl border border-border bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-1.5 px-1">
                    <span
                      aria-hidden
                      className={`size-1.5 shrink-0 rounded-full ${col.dot}`}
                    />
                    <span className="text-[13px] font-semibold">{col.label}</span>
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {columns[col.id].length}
                    </span>
                    {col.id === "done" && columns.done.length > 0 && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="ml-auto"
                        onClick={handleClearDone}
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  <KanbanColumnContent
                    value={col.id}
                    className="flex-1 min-h-0 overflow-y-auto"
                  >
                    <Stagger className="flex flex-col gap-2" stagger={0.04}>
                      {columns[col.id].map((item) => (
                        <StaggerItem key={item.id}>
                          <KanbanItem value={item.id}>
                            <BoardCardItem
                              item={item}
                              onRemove={() => handleRemove(item)}
                              onClick={() => setSelected(item)}
                              isRemoving={removingIds.has(item.id)}
                            />
                          </KanbanItem>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </KanbanColumnContent>

                  <AnimatePresence>
                    {columns[col.id].length === 0 && (
                      <motion.div
                        key="empty-hint"
                        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: durations.fast, ease: easings.out }}
                        className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 py-8 text-center"
                      >
                        <Icons.board className="size-4 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground/60">Drop cards here</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </KanbanColumn>
              ))}
            </KanbanBoard>

            <KanbanOverlay>
              {({ value }) => {
                const item = Object.values(columns)
                  .flat()
                  .find((i) => i.id === value);
                return item ? (
                  <BoardCardItem item={item} onRemove={() => {}} isDragging />
                ) : null;
              }}
            </KanbanOverlay>
          </Kanban>
        )}
      </div>

      <BoardCardDialog
        item={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        onRemove={handleRemove}
      />
    </div>
  );
}
