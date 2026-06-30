import { TRPCError } from "@trpc/server";

import { generateFeedbackDigest, getFeedbackDigest } from "../controllers/generate-digest";
import { organizationProcedure, router } from "../index";
import { getErrorCode } from "../utils/error-map";

export const digestRouter = router({
  get: organizationProcedure.query(async ({ ctx }) => {
    return getFeedbackDigest(ctx.organizationId);
  }),

  generate: organizationProcedure.mutation(async ({ ctx }) => {
    const result = await generateFeedbackDigest(ctx.organizationId);

    if (!result.success) {
      throw new TRPCError({
        code: getErrorCode(result.status),
        message: result.error,
      });
    }

    return result;
  }),
});
