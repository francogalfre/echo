"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@echo/ui/components/icons";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@/lib/trpc";

const schema = z.object({
  authorName: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Feedback is required").max(5000),
  email: z.email("Invalid email").optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).optional(),
});

type FormValues = z.infer<typeof schema>;

type FeedbackFormProps = {
  slug: string;
  accentColor: string;
  enableEmail: boolean;
  enableRating: boolean;
};

const RATING_STARS = [1, 2, 3, 4, 5] as const;

const StarRating = ({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (rating: number) => void;
}): React.ReactElement => (
  <div className="flex gap-1">
    {RATING_STARS.map((star) => (
      <button
        key={star}
        type="button"
        aria-label={`Rate ${star} of 5`}
        onClick={() => onChange(star)}
        className={`text-xl transition-colors ${star <= (value ?? 0) ? "text-amber-400" : "text-muted-foreground/30"}`}
      >
        ★
      </button>
    ))}
  </div>
);

export const FeedbackForm = ({
  slug,
  accentColor,
  enableEmail,
  enableRating,
}: FeedbackFormProps): React.ReactElement => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    await trpc.publicFeedback.submit.mutate({
      slug,
      authorName: values.authorName,
      content: values.content,
      email: values.email || undefined,
      rating: values.rating,
    });
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center py-10 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
          className="flex size-14 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          <Icons.check className="size-7" />
        </motion.span>
        <p className="mt-4 text-lg font-semibold text-foreground">Feedback received</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Thanks for taking the time — we read every note.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="authorName">
          Name
        </label>
        <input
          id="authorName"
          className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your name"
          {...register("authorName")}
        />
        {errors.authorName && (
          <p className="mt-1 text-xs text-destructive">{errors.authorName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="content">
          Your feedback
        </label>
        <textarea
          id="content"
          rows={4}
          className="w-full resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tell us what you think..."
          {...register("content")}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      {enableEmail && (
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      )}

      {enableRating && (
        <div>
          <span className="mb-1 block text-sm font-medium">Rating</span>
          <StarRating
            value={watch("rating")}
            onChange={(rating) => setValue("rating", rating)}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {isSubmitting ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
};
