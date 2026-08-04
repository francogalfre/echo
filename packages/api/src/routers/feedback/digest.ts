import { TRPCError } from "@trpc/server";

import {
  generateFeedbackDigest,
  getDigestHistory,
  getFeedbackDigest,
} from "../../controllers/feedback/digest";
import { QuotaExceededError } from "../../controllers/quota";
import { organizationProcedure, router } from "../../index";
import { getErrorCode } from "../../lib/error-map";

export const digestRouter = router({
  get: organizationProcedure.query(async ({ ctx }) => {
    return getFeedbackDigest(ctx.organizationId);
  }),

  history: organizationProcedure.query(async ({ ctx }) => {
    return getDigestHistory(ctx.organizationId);
  }),

  generate: organizationProcedure.mutation(async ({ ctx }) => {
    const result = await generateFeedbackDigest(ctx.organizationId);

    if (!result.success) {
      throw new TRPCError({
        code: getErrorCode(result.status),
        message: result.error,
        cause: new QuotaExceededError(result.error, result.upgrade),
      });
    }

    return result;
  }),
});
