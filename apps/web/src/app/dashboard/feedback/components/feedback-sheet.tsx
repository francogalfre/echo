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
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

import { SentimentBadge, SourceBadge } from "@/app/dashboard/components/feedback-badges";

import type { FeedbackItem } from "../utils/map-feedback";
import { addToBoard, buildFeedbackMailto, copyFeedback } from "../utils/feedback-actions";
import { InsightPanel } from "./insight-panel";
import { StarDisplay } from "./star-display";

type FeedbackSheetProps = {
  item: FeedbackItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeedbackSheet({
  item,
  open,
  onOpenChange,
}: FeedbackSheetProps): React.ReactElement {
  const mailto = item ? buildFeedbackMailto(item) : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0">
        {item && (
          <>
            <DrawerHeader className="flex-row items-start justify-between gap-4 border-b p-8">
              <div className="flex min-w-0 items-start gap-3.5">
                <Avatar className="size-11">
                  <AvatarFallback name={item.name} />
                </Avatar>
                <div className="min-w-0 pt-0.5">
                  <DrawerTitle className="text-base font-semibold">{item.name}</DrawerTitle>
                  {item.email ? (
                    <DrawerDescription className="mt-1 break-all">
                      {item.email}
                    </DrawerDescription>
                  ) : (
                    <DrawerDescription className="mt-1 tabular-nums">
                      {formatRelativeTime(item.createdAt)}
                    </DrawerDescription>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-row items-center gap-2.5">
                <SentimentBadge
                  sentiment={item.sentiment}
                  className="px-2.5 py-1 text-xs"
                />
                <SourceBadge source={item.source} className="px-2.5 py-1 text-xs" />
              </div>
            </DrawerHeader>

            <Stagger
              className="flex flex-1 flex-col gap-7 overflow-y-auto p-8"
              stagger={0.05}
            >
              <StaggerItem>
                <p className="rounded-xl bg-muted/40 p-6 text-sm leading-7 text-foreground">
                  {item.feedback}
                </p>
              </StaggerItem>

              <StaggerItem>
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm",
                    "text-muted-foreground",
                  )}
                >
                  {item.rating && <StarDisplay rating={item.rating} />}
                  <div className="flex items-center gap-1.5 tabular-nums">
                    <Icons.clock className="size-3.5" />
                    {formatRelativeTime(item.createdAt)}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </StaggerItem>

              <StaggerItem>
                <InsightPanel item={item} active={open} />
              </StaggerItem>
            </Stagger>

            <DrawerFooter className="flex-row flex-wrap gap-2 border-t px-6 pb-8 pt-4">
              <Button variant="ghost" size="lg" onClick={() => copyFeedback(item.feedback)}>
                <Icons.copy className="size-4" />
                Copy
              </Button>
              <Button variant="ghost" size="lg" onClick={() => addToBoard(item)}>
                <Icons.board className="size-4" />
                Add to board
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
