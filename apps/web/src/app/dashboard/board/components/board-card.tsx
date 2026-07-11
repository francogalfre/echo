"use client";

import { Icons } from "@echo/ui/components/icons";
import { KanbanItemHandle } from "@echo/ui/components/reui/kanban";
import { cn } from "@echo/ui/lib/utils";

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
      className={cn(
        "group flex flex-col gap-2 rounded-lg border border-border bg-card p-3",
        "transition-shadow duration-150 hover:shadow-sm motion-reduce:transition-none",
        isDragging && "shadow-md ring-2 ring-violet-400",
      )}
    >
      <div className="flex items-center gap-1">
        <KanbanItemHandle
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          aria-label="Drag to move"
          className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground/40 transition-colors group-hover:text-muted-foreground"
        >
          <Icons.gripVertical className="size-3.5" />
        </KanbanItemHandle>

        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-snug">
          {item.name}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground/50 opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
          aria-label={`Remove ${item.name} from board`}
        >
          <Icons.cancelCircle className="size-3.5" />
        </button>
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {item.content}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <SentimentBadge sentiment={item.sentiment} />
        <SourceBadge source={item.source} />
        {item.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="truncate rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
