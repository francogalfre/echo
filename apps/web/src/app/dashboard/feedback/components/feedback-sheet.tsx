"use client";

import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
import { Badge } from "@echo/ui/components/badge";
import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@echo/ui/components/drawer";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

import { SentimentBadge, SourceBadge } from "@/app/dashboard/components/feedback-badges";

import type { FeedbackItem } from "../hooks/use-feedback";
import { addToBoard, buildFeedbackMailto, copyFeedback } from "../utils/feedback-actions";
import { StarDisplay } from "./star-display";

type FeedbackSheetProps = {
  item: FeedbackItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExplainWithAi: (item: FeedbackItem) => void;
};

export function FeedbackSheet({
  item,
  open,
  onOpenChange,
  onExplainWithAi,
}: FeedbackSheetProps): React.ReactElement {
  const mailto = item ? buildFeedbackMailto(item) : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0">
        {item && (
          <>
            <DrawerHeader className="gap-2 border-b pr-10">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback name={item.name} />
                </Avatar>
                <div>
                  <DrawerTitle>{item.name}</DrawerTitle>
                  <DrawerDescription>
                    {formatRelativeTime(item.createdAt.toISOString())}
                  </DrawerDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SentimentBadge sentiment={item.sentiment} />
                <SourceBadge source={item.source} />
              </div>
            </DrawerHeader>

            <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:grid sm:grid-cols-[1fr_260px] sm:gap-6">
              <div className="flex flex-col gap-5">
                <p className="rounded-md bg-muted/40 p-4 text-sm leading-relaxed">
                  {item.feedback}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => onExplainWithAi(item)}
                >
                  <Icons.aiMagic className="size-4 text-accent" />
                  Explain with AI
                </Button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:mt-0 sm:content-start">
                {item.rating && (
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <StarDisplay rating={item.rating} />
                  </div>
                )}

                {item.email && (
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <Icons.mail className="size-4 text-muted-foreground" />
                      <span className="truncate">{item.email}</span>
                    </div>
                  </div>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="col-span-2">
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

            <DrawerFooter className="flex-row border-t px-4 pb-8 pt-4">
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
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
