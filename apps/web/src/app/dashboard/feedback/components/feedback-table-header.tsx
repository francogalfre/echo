"use client";

import { Checkbox } from "@echo/ui/components/checkbox";
import { cn } from "@echo/ui/lib/utils";

import { FEEDBACK_TABLE_GRID } from "./feedback-table-grid";

type FeedbackTableHeaderProps = {
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
};

export function FeedbackTableHeader({
  allSelected,
  someSelected,
  onToggleSelectAll,
}: FeedbackTableHeaderProps): React.ReactElement {
  return (
    <div role="row" className={cn(FEEDBACK_TABLE_GRID, "border-b border-border py-2.5")}>
      <span role="columnheader">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={onToggleSelectAll}
          aria-label="Select all"
        />
      </span>
      <span role="columnheader" className="text-xs font-medium text-muted-foreground">
        Name
      </span>
      <span role="columnheader" className="text-xs font-medium text-muted-foreground">
        Feedback Comment
      </span>
      <span role="columnheader" className="text-xs font-medium text-muted-foreground">
        Sentiment
      </span>
      <span role="columnheader" className="text-xs font-medium text-muted-foreground">
        Source
      </span>
      <span role="columnheader" className="text-xs font-medium text-muted-foreground">
        Date
      </span>
      <span role="columnheader" className="sr-only">
        Actions
      </span>
    </div>
  );
}
