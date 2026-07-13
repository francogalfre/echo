import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateFeedbackInsight } from "../controllers/feedback-insight";
import { organizationProcedure, router } from "../index";
import { countFeedbackBySentiment, listFeedback } from "../services/feedback";
import { getErrorCode } from "../utils/error-map";
import { paginateRows } from "../utils/pagination";

const ListFeedbackInput = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
  source: z.enum(["api", "form", "widget"]).optional(),
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
