"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icons } from "@echo/ui/components/icons";

import type { FeedbackItem } from "../hooks/use-feedback";
import { SentimentBadge } from "./sentiment-badge";
import { SourceBadge } from "./source-badge";
import { StarDisplay } from "./star-display";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FeedbackItem | null;
};

export function DetailModal({ open, onOpenChange, item }: Props): React.ReactElement {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-200 data-closed:opacity-0 data-open:opacity-100" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/10 outline-none transition-all duration-200 data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                Feedback details
              </Dialog.Title>
              {item && (
                <p className="mt-0.5 text-sm text-muted-foreground">From {item.name}</p>
              )}
            </div>
            <Dialog.Close
              aria-label="Close"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.cancelCircle className="size-5" />
            </Dialog.Close>
          </div>

          {item && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {item.sentiment && <SentimentBadge sentiment={item.sentiment} />}
                <SourceBadge source={item.email ? "email" : "form"} />
                {item.rating && <StarDisplay rating={item.rating} />}
              </div>

              <p className="rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
                {item.feedback}
              </p>

              {item.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icons.mail className="size-4" />
                  <span>{item.email}</span>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
