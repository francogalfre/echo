"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@echo/ui/components/icons";
import { Rating } from "@echo/ui/components/reui/rating";
import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@/lib/trpc";

const CONTENT_MAX_LENGTH = 5000;

const schema = z.object({
  authorName: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Feedback is required").max(CONTENT_MAX_LENGTH),
  email: z.email("Invalid email").optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).optional(),
  _hp: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type FeedbackFormProps = {
  slug: string;
  accentColor: string;
  enableEmail: boolean;
  enableRating: boolean;
};

export const FeedbackForm = ({
  slug,
  accentColor,
  enableEmail,
  enableRating,
}: FeedbackFormProps): React.ReactElement => {
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const ratingValue = watch("rating") ?? 0;
  const contentLength = watch("content")?.length ?? 0;

  const inputClassName =
    "h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none " +
    "transition-all duration-150 focus:ring-2 focus:ring-[var(--accent-color)] " +
    "focus:border-[var(--accent-color)]";

  const onSubmit = handleSubmit(async (values) => {
    await trpc.publicFeedback.submit.mutate({
      slug,
      authorName: values.authorName,
      content: values.content,
      email: values.email || undefined,
      rating: values.rating,
      _hp: values._hp,
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
    <motion.form
      onSubmit={onSubmit}
      className="space-y-4"
      style={{ "--accent-color": accentColor } as React.CSSProperties}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      variants={staggerContainer()}
    >
      <div aria-hidden="true" className="absolute -left-[9999px] overflow-hidden opacity-0">
        <input type="text" tabIndex={-1} autoComplete="off" {...register("_hp")} />
      </div>

      <motion.div variants={fadeInUp}>
        <label className="mb-1 block text-sm font-medium" htmlFor="authorName">
          Name
        </label>
        <input
          id="authorName"
          className={inputClassName}
          placeholder="Your name"
          {...register("authorName")}
        />
        {errors.authorName && (
          <p className="mt-1 text-xs text-destructive">{errors.authorName.message}</p>
        )}
      </motion.div>

      <motion.div variants={fadeInUp}>
        <label className="mb-1 block text-sm font-medium" htmlFor="content">
          Your feedback
        </label>
        <textarea
          id="content"
          rows={4}
          className="field-sizing-content w-full resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-all duration-150 focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]"
          placeholder="Tell us what you think..."
          {...register("content")}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
        )}
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {contentLength}/{CONTENT_MAX_LENGTH}
        </p>
      </motion.div>

      {enableEmail && (
        <motion.div variants={fadeInUp}>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputClassName}
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </motion.div>
      )}

      {enableRating && (
        <motion.div variants={fadeInUp}>
          <span className="mb-1 block text-sm font-medium">Rating</span>
          <Rating
            rating={ratingValue}
            accentColor={accentColor}
            editable
            onRatingChange={(r) => setValue("rating", r)}
            size="lg"
          />
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        variants={fadeInUp}
        className="h-11 w-full rounded-lg text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {isSubmitting ? "Sending…" : "Send feedback"}
      </motion.button>
    </motion.form>
  );
};
