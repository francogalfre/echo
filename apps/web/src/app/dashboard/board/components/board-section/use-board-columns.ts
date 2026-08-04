"use client";

import { useCallback, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { KanbanMoveEvent } from "@echo/ui/components/reui/kanban";
import { toast } from "@echo/ui/components/toast";
import { useReducedMotion } from "motion/react";

import { trpc } from "@/lib/trpc";
import type { BoardCard, BoardColumns } from "@echo/api/types";

const REMOVE_FADE_MS = 200;

type UseBoardColumnsResult = {
  columns: BoardColumns;
  setColumns: (columns: BoardColumns) => void;
  removingIds: ReadonlySet<string>;
  shouldReduceMotion: boolean;
  handleMove: (event: KanbanMoveEvent) => void;
  handleRemove: (item: BoardCard) => void;
  handleClearDone: () => void;
};

export function useBoardColumns(initialItems: BoardColumns): UseBoardColumnsResult {
  const [columns, setColumns] = useState<BoardColumns>(initialItems);
  const [removingIds, setRemovingIds] = useState<ReadonlySet<string>>(new Set());
  const shouldReduceMotion = useReducedMotion() ?? false;

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

  return {
    columns,
    setColumns,
    removingIds,
    shouldReduceMotion,
    handleMove,
    handleRemove,
    handleClearDone,
  };
}
