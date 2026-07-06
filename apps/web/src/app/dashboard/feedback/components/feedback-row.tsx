"use client";

import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
import { Checkbox } from "@echo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { fadeInUp } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";

import { SentimentBadge, SourceBadge } from "../../components/feedback-badges";
import type { FeedbackItem } from "../hooks/use-feedback";
import { addToBoard, buildFeedbackMailto, copyFeedback } from "../utils/feedback-actions";
import { FEEDBACK_TABLE_GRID } from "./feedback-table-grid";

type FeedbackRowProps = {
  item: FeedbackItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (item: FeedbackItem) => void;
  onExplainWithAi: (item: FeedbackItem) => void;
};

export function FeedbackRow({
  item,
  selected,
  onToggleSelect,
  onViewDetails,
  onExplainWithAi,
}: FeedbackRowProps): React.ReactElement {
  const mailto = buildFeedbackMailto(item);

  return (
    <motion.div
      role="row"
      variants={fadeInUp}
      className={cn(
        FEEDBACK_TABLE_GRID,
        "group relative border-b border-border py-4 transition-colors last:border-0 hover:bg-muted/40",
        selected && "bg-accent/5",
      )}
    >
      <button
        type="button"
        aria-label={`View details for ${item.name}`}
        className="absolute inset-0 z-0"
        onClick={() => onViewDetails(item)}
      />

      <span role="cell" className="relative z-10">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(item.id)}
          aria-label={`Select feedback from ${item.name}`}
        />
      </span>

      <span role="cell" className="flex min-w-0 items-center gap-2.5">
        <Avatar className="size-7">
          <AvatarFallback name={item.name} />
        </Avatar>
        <span className="truncate text-[13px] font-medium">{item.name}</span>
      </span>

      <span role="cell" className="min-w-0 truncate text-[13px] text-muted-foreground">
        {item.feedback}
      </span>

      <span role="cell">
        <SentimentBadge sentiment={item.sentiment} />
      </span>

      <span role="cell">
        <SourceBadge source={item.source} />
      </span>

      <span role="cell" className="text-[11px] tabular-nums text-muted-foreground">
        {formatRelativeTime(item.createdAt.toISOString())}
      </span>

      <span role="cell" className="relative z-10 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open menu"
            className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100 aria-expanded:opacity-100 focus:outline-none"
          >
            <Icons.moreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(item)}>
              <Icons.eye className="size-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExplainWithAi(item)}>
              <Icons.aiMagic className="size-4 text-accent" />
              Explain with AI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => addToBoard(item)}>
              <Icons.board className="size-4" />
              Add to board
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyFeedback(item.feedback)}>
              <Icons.copy className="size-4" />
              Copy feedback
            </DropdownMenuItem>
            {mailto && (
              <DropdownMenuItem render={<a href={mailto} />}>
                <Icons.mail className="size-4" />
                Send email
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </motion.div>
  );
}
