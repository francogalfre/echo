"use client";

import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { durations, easings } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

import type { DigestHistoryItem } from "../../../hooks/use-digest";
import { AnalysisContent } from "./analysis-content";

const CARD_TRANSITION = { duration: durations.base, ease: easings.out };

function historyPreview(entry: DigestHistoryItem): string {
  if (entry.digest.topIssues[0]) return entry.digest.topIssues[0];
  return entry.digest.executiveSummary;
}

type HistoryCardProps = {
  entry: DigestHistoryItem;
  expanded: boolean;
  onToggle: () => void;
};

function HistoryCard({ entry, expanded, onToggle }: HistoryCardProps): React.ReactElement {
  return (
    <motion.div
      layout
      transition={CARD_TRANSITION}
      className={cn(
        "shrink-0 overflow-hidden rounded-lg border border-border bg-background",
        expanded ? "w-[28rem] max-h-[24rem] overflow-y-auto" : "w-52",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full flex-col items-start gap-1 p-3 text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(entry.generatedAt.toISOString())}
          </span>
          {expanded ? (
            <Icons.x className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <Icons.chevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {entry.feedbackCount} feedbacks
        </span>
        {!expanded && (
          <p className="mt-1 line-clamp-1 text-sm text-foreground">
            {historyPreview(entry)}
          </p>
        )}
      </button>
      {expanded && (
        <div className="border-t border-border p-3">
          <AnalysisContent digest={entry.digest} />
        </div>
      )}
    </motion.div>
  );
}

type DigestHistoryRowProps = {
  history: DigestHistoryItem[];
};

export function DigestHistoryRow({
  history,
}: DigestHistoryRowProps): React.ReactElement | null {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (history.length === 0) return null;

  return (
    <div className="border-t border-border px-6 py-4">
      <p className="mb-3 text-xs text-muted-foreground">Past analyses</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {history.map((entry) => (
          <HistoryCard
            key={entry.id}
            entry={entry}
            expanded={expandedId === entry.id}
            onToggle={() => setExpandedId((prev) => (prev === entry.id ? null : entry.id))}
          />
        ))}
      </div>
    </div>
  );
}
