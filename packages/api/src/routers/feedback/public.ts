import { TRPCError } from "@trpc/server";

import { resolvePublicFeedbackPage } from "../../controllers/feedback/page";
import { submitPublicFeedback } from "../../controllers/feedback/submit-public";
import { publicProcedure, router } from "../../index";
import { getErrorCode } from "../../lib/error-map";
import { publicFeedbackSchema, slugSchema } from "../../schemas";

export const publicFeedbackRouter = router({
  getPage: publicProcedure.input(slugSchema).query(({ input }) => {
    return resolvePublicFeedbackPage(input.slug);
  }),

  submit: publicProcedure.input(publicFeedbackSchema).mutation(async ({ input, ctx }) => {
    const result = await submitPublicFeedback(input, ctx.ip);

    if (!result.success) {
      throw new TRPCError({ code: getErrorCode(result.status), message: result.error });
    }
  }),
});
