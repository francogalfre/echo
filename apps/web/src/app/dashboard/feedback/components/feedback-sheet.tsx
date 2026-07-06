"use client";

import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
import { Badge } from "@echo/ui/components/badge";
import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@echo/ui/components/sheet";
import { Skeleton } from "@echo/ui/components/skeleton";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import { useEffect } from "react";

import { SentimentBadge, SourceBadge } from "@/app/dashboard/components/feedback-badges";

import type { FeedbackItem } from "../hooks/use-feedback";
import { useFeedbackInsight } from "../hooks/use-feedback-insight";
import { addToBoard, buildFeedbackMailto, copyFeedback } from "../utils/feedback-actions";
import { InsightContent } from "./insight-content";
import { StarDisplay } from "./star-display";

type FeedbackSheetProps = {
  item: FeedbackItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  autoGenerateInsight?: boolean;
};

export function FeedbackSheet({
  item,
  open,
  onOpenChange,
  autoGenerateInsight = false,
}: FeedbackSheetProps): React.ReactElement {
  const { state, generate, reset } = useFeedbackInsight();

  useEffect(() => {
    if (open && item && autoGenerateInsight && state.status === "idle") {
      void generate(item.id);
    }
    if (!open) {
      reset();
    }
  }, [open, item, autoGenerateInsight, state.status, generate, reset]);

  const mailto = item ? buildFeedbackMailto(item) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[85vh] flex-col rounded-t-2xl p-0">
        {item && (
          <>
            <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-muted" />

            <SheetHeader className="gap-2 border-b pr-10">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback name={item.name} />
                </Avatar>
                <div>
                  <SheetTitle>{item.name}</SheetTitle>
                  <SheetDescription>
                    {formatRelativeTime(item.createdAt.toISOString())}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SentimentBadge sentiment={item.sentiment} />
                <SourceBadge source={item.source} />
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:grid sm:grid-cols-[1fr_260px] sm:gap-6">
              <div className="flex flex-col gap-5">
                <p className="rounded-md bg-muted/40 p-4 text-sm leading-relaxed">
                  {item.feedback}
                </p>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Icons.aiMagic className="size-4 text-accent" />
                    <span>AI insight</span>
                  </div>

                  {state.status === "idle" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-start"
                      onClick={() => void generate(item.id)}
                    >
                      Explain with AI
                    </Button>
                  )}

                  {state.status === "loading" && (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-full rounded" />
                      <Skeleton className="h-3 w-4/5 rounded" />
                      <Skeleton className="h-3 w-3/5 rounded" />
                    </div>
                  )}

                  {state.status === "ready" && <InsightContent insight={state.insight} />}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:mt-0">
                {item.rating && (
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <StarDisplay rating={item.rating} />
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
                  <p className="mt-1 text-sm">
                    {formatRelativeTime(item.createdAt.toISOString())}
                  </p>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-row border-t">
              <Button variant="outline" size="lg" onClick={() => addToBoard(item)}>
                <Icons.board className="size-4" />
                Add to board
              </Button>
              <Button variant="ghost" size="lg" onClick={() => copyFeedback(item.feedback)}>
                <Icons.copy className="size-4" />
                Copy
              </Button>
              {mailto && (
                <a
                  href={mailto}
                  className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
                >
                  <Icons.mail className="size-4" />
                  Send email
                </a>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
