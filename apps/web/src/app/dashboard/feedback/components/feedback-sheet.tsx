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

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps): React.ReactElement {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="border-b border-border bg-muted/40 px-5 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function FeedbackSheet({
  item,
  open,
  onOpenChange,
}: FeedbackSheetProps): React.ReactElement {
  const mailto = item ? buildFeedbackMailto(item) : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent direction="right" className="max-w-2xl p-0">
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

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <Stagger className="flex flex-col gap-5 p-6" stagger={0.05}>
                <StaggerItem>
                  <Section title="Message">
                    <p className="text-sm leading-7 text-foreground">{item.feedback}</p>
                  </Section>
                </StaggerItem>

                <StaggerItem>
                  <Section title="Details">
                    <FeedbackDetailList item={item} />
                  </Section>
                </StaggerItem>

                <StaggerItem>
                  <InsightPanel item={item} active={open} />
                </StaggerItem>
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
