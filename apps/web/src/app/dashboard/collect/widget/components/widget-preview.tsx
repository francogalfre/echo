"use client";

import { Icons } from "@echo/ui/components/icons";
import { Rating } from "@echo/ui/components/reui/rating";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";

type WidgetPreviewProps = {
  accentColor: string;
  logoUrl: string | null;
  projectName: string;
};

export const WidgetPreview = ({
  accentColor,
  logoUrl,
  projectName,
}: WidgetPreviewProps): React.ReactElement => {
  const [open, setOpen] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (rating === null) return;
    setSubmitted(true);
  };

  const toggleOpen = (): void => {
    setOpen((o) => !o);
    setSubmitted(false);
    setRating(null);
    setComment("");
  };

  return (
    <div
      className="relative flex min-h-96 items-center justify-center overflow-hidden rounded-xl border border-border"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
        backgroundSize: "16px 16px",
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-5 bottom-20 w-80 rounded-2xl border border-border bg-background p-5 shadow-xl shadow-black/5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={projectName}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex size-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {projectName.charAt(0).toUpperCase()}
                  </span>
                )}
                <p className="text-sm font-semibold">Send us feedback</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icons.cancelCircle className="size-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Icons.circleCheck className="mx-auto size-6 text-success" />
                  </motion.div>
                  <p className="mt-2 text-sm font-medium">Thanks for your feedback!</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We appreciate you taking the time.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={onSubmit}
                  className="space-y-3"
                >
                  <Rating
                    rating={rating ?? 0}
                    accentColor={accentColor}
                    editable
                    onRatingChange={setRating}
                    size="lg"
                    className="justify-between"
                  />

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Tell us more… (optional)"
                    className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm outline-none transition focus:ring-1 focus:ring-ring"
                  />

                  <motion.button
                    type="submit"
                    disabled={rating === null}
                    whileTap={{ scale: 0.98 }}
                    style={{ backgroundColor: accentColor }}
                    className={cn(
                      "w-full rounded-lg py-2 text-sm font-medium text-white transition-opacity",
                      "hover:opacity-90 disabled:opacity-50",
                    )}
                  >
                    Send feedback
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={cn(
          "absolute right-5 bottom-5 flex items-center gap-2 rounded-full bg-foreground px-4 py-2",
          "text-sm font-medium text-background shadow-lg transition-opacity hover:opacity-90",
        )}
      >
        <Icons.message className="size-4" />
        Feedback
      </motion.button>
    </div>
  );
};
