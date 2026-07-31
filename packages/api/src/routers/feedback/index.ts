import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateFeedbackInsight } from "../../controllers/feedback/insight";
import { QuotaExceededError } from "../../controllers/quota";
import { organizationProcedure, router } from "../../index";
import { getErrorCode } from "../../lib/error-map";
import { paginateRows } from "../../lib/pagination";
import {
  countFeedbackBySentiment,
  getFeedbackListItemById,
  listFeedback,
} from "../../services/feedback";
import { FEEDBACK_SOURCE_VALUES, SENTIMENT_VALUES } from "../../types";

const ListFeedbackInput = z.object({
  sentiment: z.enum(SENTIMENT_VALUES).optional(),
  source: z.enum(FEEDBACK_SOURCE_VALUES).optional(),
  search: z.string().max(200).optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export const feedbackRouter = router({
  list: organizationProcedure.input(ListFeedbackInput).query(async ({ ctx, input }) => {
    const rows = await listFeedback(ctx.organizationId, {
      sentiment: input.sentiment,
      source: input.source,
      search: input.search,
      limit: input.limit + 1,
      offset: input.offset,
    });

    return paginateRows(rows, input.limit);
  }),

  counts: organizationProcedure.query(({ ctx }) => {
    return countFeedbackBySentiment(ctx.organizationId);
  }),

  byId: organizationProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return getFeedbackListItemById(ctx.organizationId, input.id);
    }),

  insight: organizationProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await generateFeedbackInsight(ctx.organizationId, input.id);

      if (!result.success) {
        throw new TRPCError({
          code: getErrorCode(result.status as 403 | 404 | 502),
          message: result.error,
          cause: new QuotaExceededError(result.error, result.upgrade),
        });
      }

      return { insight: result.insight, cached: result.cached };
    }),
});
