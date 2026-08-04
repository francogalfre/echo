"use client";

import Link from "next/link";

import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import type { FeedbackItem } from "../../utils/map-feedback";
import { ErrorCard } from "../../../components/error-card";
import { FeedbackListSkeleton } from "../feedback-list-skeleton";
import { FeedbackRow } from "../feedback-row";
import { FeedbackTableHeader } from "../feedback-table-header";
import type { SentimentFilter } from "../feedback-toolbar";

type FeedbackListBodyProps = {
  status: "loading" | "ready" | "error";
  items: FeedbackItem[];
  counts: Record<SentimentFilter, number>;
  pending: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  filtersActive: boolean;
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetails: (item: FeedbackItem) => void;
  onDelete: (item: FeedbackItem) => void;
  onClearFilters: () => void;
};

export function FeedbackListBody({
  status,
  items,
  counts,
  pending,
  hasMore,
  loadingMore,
  loadMore,
  filtersActive,
  selected,
  allSelected,
  someSelected,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onDelete,
  onClearFilters,
}: FeedbackListBodyProps): React.ReactElement {
  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-lg bg-card ring-1 ring-foreground/10">
      <div
        className={cn(
          "min-w-[48rem] transition-opacity duration-200",
          pending && "pointer-events-none opacity-50",
        )}
      >
        {status === "loading" && <FeedbackListSkeleton />}

        {status === "error" && (
          <ErrorCard
            title="Could not load feedback"
            message="Please refresh the page."
            className="rounded-none ring-0"
          />
        )}

        {status === "ready" && counts.all === 0 && (
          <EmptyState
            icon={<Icons.message />}
            title="No feedback yet"
            description="Once people share feedback through your API, form, or widget, it shows up here."
            action={
              <Link
                href="/dashboard/collect"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Start collecting
              </Link>
            }
          />
        )}

        {status === "ready" && counts.all > 0 && items.length === 0 && (
          <EmptyState
            icon={<Icons.search />}
            title="No matching feedback"
            description="Nothing matches your current search or filters. Try adjusting them."
            action={
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear filters
              </Button>
            }
          />
        )}

        {status === "ready" && items.length > 0 && (
          <>
            <FeedbackTableHeader
              allSelected={allSelected}
              someSelected={someSelected}
              onToggleSelectAll={onToggleSelectAll}
            />

            <div role="table" className="animate-in fade-in duration-300 ease-out">
              {items.map((item) => (
                <FeedbackRow
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  onToggleSelect={onToggleSelect}
                  onViewDetails={onViewDetails}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex flex-col items-center gap-2 border-t border-border py-4">
                <span className="text-xs text-muted-foreground">
                  {filtersActive
                    ? `Showing ${items.length}`
                    : `Showing ${items.length} of ${counts.all}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loadingMore}
                  onClick={loadMore}
                >
                  {loadingMore && <Icons.loading className="size-4 animate-spin" />}
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
