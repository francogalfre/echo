"use client";

import { useState } from "react";
import { Kanban, KanbanBoard, KanbanOverlay } from "@echo/ui/components/reui/kanban";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import Link from "next/link";

import type { BoardCard, BoardColumns } from "@echo/api/types";

import { FeedbackDialog } from "../../../feedback/components/feedback-dialog";
import { toFeedbackItem } from "../../utils/to-feedback-item";
import { BoardCardItem } from "../board-card";
import { BoardColumnPane } from "./board-column-pane";
import { useBoardColumns } from "./use-board-columns";

const COLUMNS: { id: keyof BoardColumns; label: string; dot: string }[] = [
  { id: "backlog", label: "Backlog", dot: "bg-muted-foreground" },
  { id: "in_progress", label: "In Progress", dot: "bg-info" },
  { id: "done", label: "Done", dot: "bg-success" },
];

type BoardSectionProps = {
  readonly initialItems: BoardColumns;
};

export function BoardSection({ initialItems }: BoardSectionProps): React.ReactElement {
  const {
    columns,
    setColumns,
    removingIds,
    shouldReduceMotion,
    handleMove,
    handleRemove,
    handleClearDone,
  } = useBoardColumns(initialItems);
  const [selected, setSelected] = useState<BoardCard | null>(null);

  const totalItems = Object.values(columns).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-2xl font-medium tracking-tight">Board</h1>
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

      <div>
        {totalItems === 0 ? (
          <div className="flex min-h-[24rem] items-center justify-center rounded-xl border border-dashed border-border">
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
            className="flex flex-col"
          >
            <KanbanBoard className="grid grid-cols-3 items-start gap-4">
              {COLUMNS.map((col) => (
                <BoardColumnPane
                  key={col.id}
                  id={col.id}
                  label={col.label}
                  dot={col.dot}
                  items={columns[col.id]}
                  removingIds={removingIds}
                  shouldReduceMotion={shouldReduceMotion}
                  showClear={col.id === "done"}
                  onSelect={setSelected}
                  onRemove={handleRemove}
                  onClearDone={handleClearDone}
                />
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

      <FeedbackDialog
        item={selected ? toFeedbackItem(selected) : null}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        onRemoveFromBoard={
          selected
            ? () => {
                handleRemove(selected);
                setSelected(null);
              }
            : undefined
        }
      />
    </div>
  );
}
