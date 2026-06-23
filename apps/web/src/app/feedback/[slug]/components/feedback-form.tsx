"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@/lib/trpc";

const schema = z.object({
  authorName: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Feedback is required").max(5000),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).optional(),
});

type FormValues = z.infer<typeof schema>;

type FeedbackFormProps = {
  slug: string;
  accentColor: string;
  enableEmail: boolean;
  enableRating: boolean;
};

const StarRating = ({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}): React.ReactElement => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className={`text-xl transition-colors ${n <= (value ?? 0) ? "text-amber-400" : "text-muted-foreground/30"}`}
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
      <div className="py-8 text-center">
        <p className="text-2xl">🎉</p>
        <p className="mt-2 font-medium">Thanks for your feedback!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We appreciate you taking the time.
        </p>
      </div>
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
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
          <label className="mb-1 block text-sm font-medium">Rating</label>
          <StarRating value={watch("rating")} onChange={(v) => setValue("rating", v)} />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {isSubmitting ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
};
