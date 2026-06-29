import { TRPCError } from "@trpc/server";

import { publicProcedure, router } from "../index";
import { publicFeedbackSchema, slugSchema } from "../schemas";
import { createFeedback } from "../controllers/create-feedback";
import { getFeedbackPageBySlug } from "../services/feedback-page";

export const publicFeedbackRouter = router({
  getPage: publicProcedure.input(slugSchema).query(({ input }) => {
    return getFeedbackPageBySlug(input.slug);
  }),

  submit: publicProcedure.input(publicFeedbackSchema).mutation(async ({ input }) => {
    const page = await getFeedbackPageBySlug(input.slug);
    if (!page) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Feedback page not found or not published",
      });
    }

    const { email, rating, slug: _slug, ...rest } = input;
    await createFeedback({
      ...rest,
      organizationId: page.org.id,
      email: page.config.enableEmail ? email : undefined,
      rating: page.config.enableRating ? rating : undefined,
      source: "form",
    });
  }),
});
