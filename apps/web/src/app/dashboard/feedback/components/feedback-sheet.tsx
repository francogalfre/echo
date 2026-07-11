"use client";

import { motion } from "motion/react";

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
import { fadeInUp } from "@echo/ui/lib/motion";
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
            <DrawerHeader className="flex-row items-start justify-between gap-4 border-b pr-12">
              <div className="flex min-w-0 items-start gap-3">
                <Avatar className="size-10">
                  <AvatarFallback name={item.name} />
                </Avatar>
                <div className="min-w-0 pt-0.5">
                  <DrawerTitle className="text-base font-semibold">{item.name}</DrawerTitle>
                  {item.email ? (
                    <DrawerDescription className="mt-0.5 break-all">
                      {item.email}
                    </DrawerDescription>
                  ) : (
                    <DrawerDescription className="mt-0.5">
                      {formatRelativeTime(item.createdAt.toISOString())}
                    </DrawerDescription>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <SentimentBadge sentiment={item.sentiment} />
                <SourceBadge source={item.source} />
              </div>
            </DrawerHeader>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex flex-1 flex-col gap-5 overflow-y-auto p-6"
            >
              <p className="rounded-xl bg-muted/40 p-5 text-sm leading-7 text-foreground">
                {item.feedback}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {item.rating && <StarDisplay rating={item.rating} />}
                <div className="flex items-center gap-1.5">
                  <Icons.clock className="size-3.5" />
                  {formatRelativeTime(item.createdAt.toISOString())}
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
            </motion.div>

            <DrawerFooter className="flex-row flex-wrap border-t px-4 pb-8 pt-4">
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
              <Button variant="ghost" size="lg" onClick={() => onExplainWithAi(item)}>
                <Icons.aiMagic className="size-4 text-accent" />
                Explain with AI
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
