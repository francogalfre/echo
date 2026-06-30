"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";
import { useFeedback, type FeedbackItem } from "../hooks/use-feedback";
import { DetailModal } from "./detail-modal";
import { InsightModal } from "./insight-modal";
import { SentimentBadge } from "./sentiment-badge";
import { SourceBadge } from "./source-badge";
import { TagBadge } from "./tag-badge";

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

const TABS: { value: SentimentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type RowProps = {
  item: FeedbackItem;
  onDetail: (item: FeedbackItem) => void;
  onInsight: (item: FeedbackItem) => void;
  onAddToBoard: (item: FeedbackItem) => void;
};

function FeedbackRow({
  item,
  onDetail,
  onInsight,
  onAddToBoard,
}: RowProps): React.ReactElement {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border px-4 py-3.5 last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-xs font-semibold text-foreground">
          {item.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium text-foreground">{item.name}</span>
            {item.sentiment && <SentimentBadge sentiment={item.sentiment} />}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{item.feedback}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <SourceBadge source={item.source} />
            {item.tags?.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            <span className="text-xs text-muted-foreground">
              {formatDate(item.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open menu"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
        >
          <Icons.moreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem onClick={() => onDetail(item)}>
            <Icons.eye className="size-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsight(item)}>
            <Icons.aiMagic className="size-4" />
            Explain
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddToBoard(item)}>
            <Icons.board className="size-4" />
            Add to board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function addToBoard(item: FeedbackItem): void {
  trpc.board.add
    .mutate({ feedbackId: item.id })
    .then(() => toast.success("Added to board"))
    .catch((error: unknown) => {
      const msg = error instanceof Error ? error.message : "Failed";
      toast.error(msg.includes("Already") ? "Already on board" : "Failed to add to board");
    });
}

export function FeedbackTable(): React.ReactElement {
  const feedbackState = useFeedback();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<SentimentFilter>("all");
  const [detailItem, setDetailItem] = useState<FeedbackItem | null>(null);
  const [insightItem, setInsightItem] = useState<FeedbackItem | null>(null);

  const items = feedbackState.status === "ready" ? feedbackState.items : [];

  const filtered = items.filter((item) => {
    const matchesTab = tab === "all" || item.sentiment === tab;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.feedback.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  const counts: Record<SentimentFilter, number> = {
    all: items.length,
    positive: items.filter((i) => i.sentiment === "positive").length,
    neutral: items.filter((i) => i.sentiment === "neutral").length,
    negative: items.filter((i) => i.sentiment === "negative").length,
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto">
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  tab === value
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full sm:w-auto">
          <Icons.search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search feedback…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card">
        {feedbackState.status === "loading" && (
          <div className="flex items-center justify-center py-16">
            <Icons.loading className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {feedbackState.status === "error" && (
          <div className="px-4 py-16 text-center">
            <Icons.alertCircle className="mx-auto size-8 text-destructive/50" />
            <p className="mt-2 text-sm font-medium text-foreground">
              Could not load feedback
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Please refresh the page.</p>
          </div>
        )}

        {feedbackState.status === "ready" && filtered.length === 0 && (
          <div className="px-4 py-16 text-center">
            <Icons.message className="mx-auto size-8 text-muted-foreground/30" />
            <p className="mt-2 text-sm font-medium text-foreground">No feedback found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search
                ? "Try a different search term."
                : "Feedback will appear here once received."}
            </p>
          </div>
        )}

        {feedbackState.status === "ready" &&
          filtered.map((item) => (
            <FeedbackRow
              key={item.id}
              item={item}
              onDetail={setDetailItem}
              onInsight={setInsightItem}
              onAddToBoard={addToBoard}
            />
          ))}
      </div>

      <DetailModal
        open={detailItem !== null}
        onOpenChange={(open) => {
          if (!open) setDetailItem(null);
        }}
        item={detailItem}
      />

      <InsightModal
        open={insightItem !== null}
        onOpenChange={(open) => {
          if (!open) setInsightItem(null);
        }}
        item={insightItem}
      />
    </>
  );
}
