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
import { Icons } from "@echo/ui/components/icons";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { trpc } from "@/lib/trpc";
import type { BoardCard, BoardColumns } from "@echo/api/services/board";

import { PageContainer } from "../components/page-container";
import { BoardCardDialog } from "./components/board-card-dialog";
import { BoardCardItem } from "./components/board-card";

const COLUMNS: { id: keyof BoardColumns; label: string; dot: string }[] = [
  { id: "backlog", label: "Backlog", dot: "bg-muted-foreground" },
  { id: "in_progress", label: "In Progress", dot: "bg-info" },
  { id: "done", label: "Done", dot: "bg-success" },
];

const EMPTY: BoardColumns = { backlog: [], in_progress: [], done: [] };

type BoardItemsResult = Awaited<ReturnType<typeof trpc.board.items.query>>;

function hydrateCard(card: BoardItemsResult["backlog"][number]): BoardCard {
  return { ...card, createdAt: new Date(card.createdAt) };
}

export default function BoardPage(): React.ReactElement {
  const [columns, setColumns] = useState<BoardColumns>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BoardCard | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 3;

    const load = (): void => {
      trpc.board.items
        .query()
        .then((data) => {
          if (cancelled) return;
          setColumns({
            backlog: data.backlog.map(hydrateCard),
            in_progress: data.in_progress.map(hydrateCard),
            done: data.done.map(hydrateCard),
          });
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          attempt += 1;
          if (attempt < maxAttempts) {
            setTimeout(load, attempt * 800);
          } else {
            toast.error("Failed to load board");
            setLoading(false);
          }
        });
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleMove = useCallback(
    ({ activeContainer, activeIndex, overContainer, overIndex }: KanbanMoveEvent) => {
      const item = columns[activeContainer as keyof BoardColumns]?.[activeIndex];
      if (!item) return;

      if (activeContainer === overContainer) {
        setColumns((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(
            prev[activeContainer as keyof BoardColumns],
            activeIndex,
            overIndex,
          ),
        }));
        return;
      }

      setColumns((prev) => {
        const fromItems = [...prev[activeContainer as keyof BoardColumns]];
        fromItems.splice(activeIndex, 1);
        const toItems = [...prev[overContainer as keyof BoardColumns]];
        toItems.splice(overIndex, 0, item);
        return { ...prev, [activeContainer]: fromItems, [overContainer]: toItems };
      });

      trpc.board.move
        .mutate({
          id: item.id,
          column: overContainer as "backlog" | "in_progress" | "done",
        })
        .catch(() => toast.error("Failed to move item"));
    },
    [columns],
  );

  const handleRemove = useCallback((item: BoardCard) => {
    setColumns((prev) => {
      const next = { ...prev };
      for (const col of Object.keys(next) as Array<keyof BoardColumns>) {
        next[col] = next[col].filter((i) => i.id !== item.id);
      }
      return next;
    });
    trpc.board.remove
      .mutate({ id: item.id })
      .catch(() => toast.error("Failed to remove item"));
  }, []);

  const handleClearDone = useCallback(() => {
    setColumns((prev) => ({ ...prev, done: [] }));
    trpc.board.clearColumn
      .mutate({ column: "done" })
      .catch(() => toast.error("Failed to clear done"));
  }, []);

  const totalItems = Object.values(columns).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <PageContainer className="flex flex-col gap-6 h-full">
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

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Icons.loading className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Icons.board className="size-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">Your board is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Go to Feedback and click ··· → Add to board on any item.
          </p>
          <Link
            href="/dashboard/feedback"
            className="mt-4 rounded-lg bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-80"
          >
            Browse feedback
          </Link>
        </div>
      ) : (
        <Kanban
          value={columns}
          onValueChange={(v) => setColumns(v as BoardColumns)}
          getItemValue={(item: BoardCard) => item.id}
          onMove={handleMove}
        >
          <KanbanBoard className="grid grid-cols-3 gap-4 items-start">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                value={col.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-2 px-1 py-0.5">
                  <span
                    aria-hidden
                    className={`size-1.5 shrink-0 rounded-full ${col.dot}`}
                  />
                  <span className="text-sm font-semibold">{col.label}</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
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
                  className="flex flex-col gap-2 min-h-16"
                >
                  {columns[col.id].map((item) => (
                    <KanbanItem key={item.id} value={item.id}>
                      <BoardCardItem
                        item={item}
                        onRemove={() => handleRemove(item)}
                        onClick={() => setSelected(item)}
                      />
                    </KanbanItem>
                  ))}
                </KanbanColumnContent>

                {columns[col.id].length === 0 && (
                  <div className="flex items-center justify-center py-6 text-xs text-muted-foreground/50">
                    Drop here
                  </div>
                )}
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

      <BoardCardDialog
        item={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        onRemove={handleRemove}
      />
    </PageContainer>
  );
}
