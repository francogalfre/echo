import { organizationProcedure, router } from "../index";
import { feedbackPageConfigSchema } from "../schemas";
import { getFeedbackPageConfig, upsertFeedbackPageConfig } from "../services/feedback-page";

export const feedbackPageRouter = router({
  getConfig: organizationProcedure.query(({ ctx }) => {
    return getFeedbackPageConfig(ctx.organizationId).then((config) => config ?? null);
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
