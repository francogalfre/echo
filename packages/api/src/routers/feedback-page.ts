import { organizationProcedure, router } from "../index";
import { feedbackPageConfigSchema } from "../schemas";
import { listFeedback } from "../services/feedback";
import { getFeedbackPageConfig, upsertFeedbackPageConfig } from "../services/feedback-page";

export const feedbackPageRouter = router({
  getConfig: organizationProcedure.query(({ ctx }) => {
    return getFeedbackPageConfig(ctx.organizationId).then((config) => config ?? null);
  }),

  recentFeedback: organizationProcedure.query(async ({ ctx }) => {
    const items = await listFeedback(ctx.organizationId, { limit: 12, offset: 0 });
    return items.map((item) => ({
      id: item.id,
      authorName: item.name,
      content: item.feedback,
      rating: item.rating,
    }));
  }),

  upsertConfig: organizationProcedure
    .input(feedbackPageConfigSchema)
    .mutation(async ({ input, ctx }) => {
      await upsertFeedbackPageConfig(ctx.organizationId, input);
    }),

  publish: organizationProcedure.mutation(async ({ ctx }) => {
    await upsertFeedbackPageConfig(ctx.organizationId, { published: true });
  }),
});
