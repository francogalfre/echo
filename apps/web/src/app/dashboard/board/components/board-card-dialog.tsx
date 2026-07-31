"use client";

import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
import { Badge } from "@echo/ui/components/badge";
import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@echo/ui/components/dialog";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

import { SentimentBadge, SourceBadge } from "@/app/dashboard/components/feedback-badges";
import {
  buildFeedbackMailto,
  copyFeedback,
} from "@/app/dashboard/feedback/utils/feedback-actions";

import type { BoardCard } from "@echo/api/types";

import { StarDisplay } from "../../feedback/components/star-display";

type BoardCardDialogProps = {
  item: BoardCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (item: BoardCard) => void;
};

export function BoardCardDialog({
  item,
  open,
  onOpenChange,
  onRemove,
}: BoardCardDialogProps): React.ReactElement {
  const mailto = item ? buildFeedbackMailto(item) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {item && (
          <>
            <DialogHeader className="gap-2 pr-6">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback name={item.name} />
                </Avatar>
                <div>
                  <DialogTitle>{item.name}</DialogTitle>
                  <DialogDescription>
                    {formatRelativeTime(item.createdAt)}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SentimentBadge sentiment={item.sentiment} />
                <SourceBadge source={item.source} />
              </div>
            </DialogHeader>

            <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
              <p className="rounded-md bg-muted/40 p-4 text-sm leading-relaxed">
                {item.content}
              </p>

              {item.rating && (
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <div className="mt-1">
                    <StarDisplay rating={item.rating} />
                  </div>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Tags</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.email && (
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Icons.mail className="size-4 text-muted-foreground" />
                    <span>{item.email}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <div className="mt-1">
                  <SourceBadge source={item.source} />
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="mt-1 text-sm">{formatRelativeTime(item.createdAt)}</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onRemove(item);
                  onOpenChange(false);
                }}
              >
                <Icons.cancelCircle className="size-4" />
                Remove from board
              </Button>
              <Button variant="ghost" size="sm" onClick={() => copyFeedback(item.content)}>
                <Icons.copy className="size-4" />
                Copy
              </Button>
              {mailto && (
                <a
                  href={mailto}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  <Icons.mail className="size-4" />
                  Send email
                </a>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
