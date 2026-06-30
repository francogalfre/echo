import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateFeedbackInsight } from "../controllers/feedback-insight";
import { organizationProcedure, router } from "../index";
import { listFeedback } from "../services/feedback";
import { getErrorCode } from "../utils/error-map";

export const feedbackRouter = router({
  list: organizationProcedure.query(({ ctx }) => {
    return listFeedback(ctx.organizationId);
  }),

  insight: organizationProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await generateFeedbackInsight(ctx.organizationId, input.id);

      if (!result.success) {
        throw new TRPCError({
          code: getErrorCode(result.status as 403 | 404 | 502),
          message: result.error,
        });
      }

      return { insight: result.insight, cached: result.cached };
    }),
});
