"use client";

import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
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

import type { FeedbackItem } from "../utils/map-feedback";
import { addToBoard, buildFeedbackMailto, copyFeedback } from "../utils/feedback-actions";
import { FeedbackDetailList } from "./feedback-detail-list";
import { InsightPanel } from "./insight-panel";

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
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent direction="right" className="max-w-3xl p-0">
        {item && (
          <>
            <DrawerHeader className="flex-row items-center gap-3.5 border-b p-6">
              <Avatar className="size-11 shrink-0">
                <AvatarFallback name={item.name} />
              </Avatar>
              <div className="min-w-0">
                <DrawerTitle className="text-base font-semibold">{item.name}</DrawerTitle>
                <DrawerDescription className="mt-1 break-all">
                  {item.email ?? `Submitted ${formatRelativeTime(item.createdAt)}`}
                </DrawerDescription>
              </div>
            </DrawerHeader>

            <div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto">
              <Stagger
                className={cn(
                  "flex flex-col gap-8 p-6",
                  "@2xl:grid @2xl:grid-cols-[200px_1fr] @2xl:items-start @2xl:gap-8",
                )}
                stagger={0.05}
              >
                <StaggerItem
                  className={cn(
                    "order-2 @2xl:order-1",
                    "@2xl:border-r @2xl:border-border @2xl:pr-6",
                  )}
                >
                  <FeedbackDetailList item={item} />
                </StaggerItem>

                <div className="order-1 flex flex-col gap-6 @2xl:order-2">
                  <StaggerItem>
                    <section className="flex flex-col gap-2.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Message
                      </h3>
                      <p className="rounded-xl bg-muted/40 p-5 text-sm leading-7 text-foreground">
                        {item.feedback}
                      </p>
                    </section>
                  </StaggerItem>

                  <StaggerItem>
                    <InsightPanel item={item} active={open} />
                  </StaggerItem>
                </div>
              </Stagger>
            </div>

            <DrawerFooter className="flex-row flex-wrap gap-2 border-t px-6 pb-6 pt-4">
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
