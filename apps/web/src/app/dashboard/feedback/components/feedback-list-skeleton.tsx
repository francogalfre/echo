import { Skeleton } from "@echo/ui/components/skeleton";
import { cn } from "@echo/ui/lib/utils";

import { FEEDBACK_TABLE_GRID } from "./feedback-table-grid";

export function FeedbackListSkeleton(): React.ReactElement {
  return (
    <div>
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className={cn(FEEDBACK_TABLE_GRID, "border-b border-border py-4 last:border-0")}
        >
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-3 w-24 shrink-0 rounded" />
          <Skeleton className="h-3 flex-1 rounded" />
          <Skeleton className="h-4 w-14 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-12 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-10 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-10 shrink-0 rounded" />
          <Skeleton className="size-4 shrink-0 rounded" />
        </div>
      ))}
    </div>
  );
}
