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

import { SentimentBadge, SourceBadge, TagPill } from "../../components/feedback-badges";
import type { FeedbackItem } from "../hooks/use-feedback";
import {
  addToBoard,
  buildFeedbackMailto,
  copyEmail,
  copyFeedback,
  copyFeedbackLink,
} from "../utils/feedback-actions";
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
  const email = item.email;

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
        <Avatar className="size-8">
          <AvatarFallback name={item.name} />
        </Avatar>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] font-medium leading-tight">
            {item.name}
          </span>
          {item.email && (
            <span className="truncate text-[11px] leading-tight text-muted-foreground">
              {item.email}
            </span>
          )}
        </span>
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

      <span role="cell" className="flex min-w-0 items-center gap-1 overflow-hidden">
        {item.tags && item.tags.length > 0 ? (
          <>
            <TagPill label={item.tags[0]} />
            {item.tags.length > 1 && (
              <TagPill label={`+${item.tags.length - 1}`} className="tabular-nums" />
            )}
          </>
        ) : item.rating ? (
          <span className="flex items-center gap-1 text-[11px] font-medium tabular-nums text-foreground/80">
            <Icons.star className="size-3 text-warning" />
            {item.rating.toFixed(1)}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground/50">—</span>
        )}
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
            <DropdownMenuItem onClick={() => copyFeedback(item.feedback)}>
              <Icons.copy className="size-4" />
              Copy feedback
            </DropdownMenuItem>
            {email && (
              <DropdownMenuItem onClick={() => copyEmail(email)}>
                <Icons.mail className="size-4" />
                Copy email
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => copyFeedbackLink(item.id)}>
              <Icons.copy className="size-4" />
              Copy link
            </DropdownMenuItem>
            {mailto && (
              <DropdownMenuItem render={<a href={mailto} />}>
                <Icons.mail className="size-4" />
                Send email
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => addToBoard(item)}>
              <Icons.board className="size-4" />
              Add to board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </motion.div>
  );
}
