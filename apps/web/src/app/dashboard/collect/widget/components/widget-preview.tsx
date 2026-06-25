"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useState, type FormEvent } from "react";

export const WidgetPreview = (): React.ReactElement => {
  const [open, setOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_1px_1px,theme(colors.border)_1px,transparent_0)] [background-size:16px_16px]">
      {open && (
        <div className="w-80 rounded-2xl border border-border bg-background p-5 shadow-xl shadow-black/5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Share your feedback</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.cancelCircle className="size-4" />
            </button>
          </div>

          {submitted ? (
            <div className="py-6 text-center">
              <Icons.circleCheck className="mx-auto size-6 text-emerald-500" />
              <p className="mt-2 text-sm font-medium">Thanks for your feedback!</p>
              <p className="mt-1 text-xs text-muted-foreground">
                We appreciate you taking the time.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <Labelled label="Name">
                <input
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none transition focus:ring-1 focus:ring-ring"
                  placeholder="Your name"
                />
              </Labelled>
              <Labelled label="Feedback">
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm outline-none transition focus:ring-1 focus:ring-ring"
                  placeholder="What's on your mind?"
                />
              </Labelled>
              <button
                type="submit"
                className="w-full rounded-lg bg-foreground py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Send feedback
              </button>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSubmitted(false);
        }}
        className={cn(
          "absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-foreground px-4 py-2",
          "text-sm font-medium text-background shadow-lg transition-opacity hover:opacity-90",
        )}
      >
        <Icons.message className="size-4" />
        Feedback
      </button>
    </div>
  );
};

const Labelled = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-muted-foreground">{label}</label>
    {children}
  </div>
);
