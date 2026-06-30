"use client";

import { Icons } from "@echo/ui/components/icons";

import type { BoardCard } from "@echo/api/services/board";

const SENTIMENT_DOT: Record<string, string> = {
  positive: "bg-emerald-500",
  negative: "bg-red-500",
  neutral: "bg-gray-400",
};

type Props = {
  item: BoardCard;
  onRemove: () => void;
  isDragging?: boolean;
};

export function BoardCardItem({ item, onRemove, isDragging }: Props): React.ReactElement {
  return (
    <div
      className={`group flex flex-col gap-2 rounded-lg border border-border bg-card p-3 ${isDragging ? "ring-2 ring-violet-400" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`mt-0.5 size-2 shrink-0 rounded-full ${SENTIMENT_DOT[item.sentiment ?? ""] ?? "bg-muted-foreground/30"}`}
          />
          <span className="truncate text-sm font-medium">{item.name}</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Remove from board"
        >
          <Icons.cancelCircle className="size-3.5" />
        </button>
      </div>

      <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
        {item.content}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <span className="rounded border border-border px-1 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {item.source}
        </span>
        {item.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
