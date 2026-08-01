import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";

import type { DigestHistoryItem } from "../../../hooks/use-digest";

const HISTORY_ACTIVE_SPRING = { type: "spring", stiffness: 500, damping: 40 } as const;

type DigestHistoryPanelProps = {
  readonly history: DigestHistoryItem[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string | null) => void;
};

export function DigestHistoryPanel({
  history,
  selectedId,
  onSelect,
}: DigestHistoryPanelProps): React.ReactElement | null {
  if (history.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">History</p>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "relative rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selectedId === null ? "font-medium" : "hover:bg-muted",
          )}
        >
          {selectedId === null && (
            <motion.span
              layoutId="digest-history-active"
              transition={HISTORY_ACTIVE_SPRING}
              className="absolute inset-0 rounded-lg bg-muted"
            />
          )}
          <span className="relative">Latest</span>
        </button>
        {history.map((entry) => {
          const isActive = selectedId === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry.id)}
              className={cn(
                "relative flex flex-col items-start rounded-lg px-2 py-1.5 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !isActive && "hover:bg-muted",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="digest-history-active"
                  transition={HISTORY_ACTIVE_SPRING}
                  className="absolute inset-0 rounded-lg bg-muted"
                />
              )}
              <span className="relative text-sm">
                {formatRelativeTime(entry.generatedAt.toISOString())}
              </span>
              <span className="relative text-xs text-muted-foreground">
                {entry.feedbackCount} feedbacks
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
