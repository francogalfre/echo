import { TRPCError } from "@trpc/server";

import { createFeedback } from "../controllers/create-feedback";
import { publicProcedure, router } from "../index";
import { guardSubmission } from "../lib/rate-limit";
import { publicFeedbackSchema, slugSchema } from "../schemas";
import { getFeedbackPageBySlug } from "../services/feedback-page";

export const publicFeedbackRouter = router({
  getPage: publicProcedure.input(slugSchema).query(({ input }) => {
    return getFeedbackPageBySlug(input.slug);
  }),

  submit: publicProcedure.input(publicFeedbackSchema).mutation(async ({ input, ctx }) => {
    if (input._hp) return;

    const page = await getFeedbackPageBySlug(input.slug);
    if (!page) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Feedback page not found or not published",
      });
    }

    const guard = await guardSubmission(ctx.ip, input.slug, input.content);

    if (!guard.allowed) {
      if (guard.silent) return;
      throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: guard.message });
    }

    const { email, rating, slug: _slug, _hp: _honeypot, ...rest } = input;
    await createFeedback({
      ...rest,
      organizationId: page.org.id,
      email: page.config.enableEmail ? email : undefined,
      rating: page.config.enableRating ? rating : undefined,
      source: "form",
    });
  }),
});
