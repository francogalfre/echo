"use client";

import { Badge } from "@echo/ui/components/badge";
import { Icons } from "@echo/ui/components/icons";
import { KanbanItemHandle } from "@echo/ui/components/reui/kanban";

import { SentimentBadge, SourceBadge } from "@/app/dashboard/components/feedback-badges";

import type { BoardCard } from "@echo/api/services/board";

type Props = {
  item: BoardCard;
  onRemove: () => void;
  isDragging?: boolean;
  onClick?: () => void;
};

export function BoardCardItem({
  item,
  onRemove,
  isDragging,
  onClick,
}: Props): React.ReactElement {
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col gap-2 rounded-lg border border-border bg-card p-3.5 transition-shadow hover:shadow-sm ${isDragging ? "ring-2 ring-violet-400" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <SentimentBadge sentiment={item.sentiment} className="shrink-0" />
          <span className="truncate text-sm font-medium">{item.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <KanbanItemHandle>
            <span
              onClick={(e) => e.stopPropagation()}
              className="flex size-5 cursor-grab items-center justify-center rounded text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Drag to move"
            >
              <Icons.gripVertical className="size-3.5" />
            </span>
          </KanbanItemHandle>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
            aria-label="Remove from board"
          >
            <Icons.cancelCircle className="size-3.5" />
          </button>
        </div>
      </div>

      <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
        {item.content}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <SourceBadge source={item.source} />
        {item.tags?.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
