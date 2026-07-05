"use client";

import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
import { Badge } from "@echo/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";

import { SentimentBadge, SourceBadge } from "../../components/feedback-badges";
import type { FeedbackItem } from "../hooks/use-feedback";
import { addToBoard, buildFeedbackMailto, copyFeedback } from "../utils/feedback-actions";

type FeedbackRowProps = {
  item: FeedbackItem;
  onViewDetails: (item: FeedbackItem) => void;
  onExplainWithAi: (item: FeedbackItem) => void;
};

export function FeedbackRow({
  item,
  onViewDetails,
  onExplainWithAi,
}: FeedbackRowProps): React.ReactElement {
  const mailto = buildFeedbackMailto(item);
  const tags = item.tags?.slice(0, 2) ?? [];

  return (
    <li className="group relative flex items-center gap-3.5 border-b border-border px-5 py-3 last:border-0 transition-colors hover:bg-muted/40">
      <button
        type="button"
        aria-label={`View details for ${item.name}`}
        className="absolute inset-0 z-0"
        onClick={() => onViewDetails(item)}
      />

      <Avatar className="size-7">
        <AvatarFallback name={item.name} />
      </Avatar>

      <span className="w-36 shrink-0 truncate text-[13px] font-medium max-md:w-24">
        {item.name}
      </span>

      <p className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
        {item.feedback}
      </p>

      {tags.length > 0 && (
        <span className="hidden shrink-0 items-center gap-1 xl:flex">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </span>
      )}

      <SentimentBadge sentiment={item.sentiment} className="max-sm:hidden" />
      <SourceBadge source={item.source} className="max-sm:hidden" />

      <span className="w-14 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
        {formatRelativeTime(item.createdAt.toISOString())}
      </span>

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
    </li>
  );
}
