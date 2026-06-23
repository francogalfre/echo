import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../index";
import { getFeedbackPageBySlug } from "../services/feedback-page";
import { insertFeedback } from "../services/feedback";

export const publicFeedbackRouter = router({
  getPage: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      return getFeedbackPageBySlug(input.slug);
    }),

  submit: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        authorName: z.string().min(1).max(100),
        content: z.string().min(1).max(5000),
        email: z.string().email().optional(),
        rating: z.number().int().min(1).max(5).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const page = await getFeedbackPageBySlug(input.slug);
      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feedback page not found or not published",
        });
      }

      const { email, rating, slug: _, ...rest } = input;
      await insertFeedback({
        ...rest,
        organizationId: page.org.id,
        email: page.config.enableEmail ? email : undefined,
        rating: page.config.enableRating ? rating : undefined,
        source: "form",
      });
    }),
});
