import { protectedProcedure, publicProcedure, router } from "../index";
import { apiKeysRouter } from "./api-keys";
import { feedbackPageRouter } from "./feedback-page";
import { publicFeedbackRouter } from "./public-feedback";

export const appRouter = router({
  apiKeys: apiKeysRouter,
  feedbackPage: feedbackPageRouter,
  publicFeedback: publicFeedbackRouter,
  healthCheck: publicProcedure.query(() => "OK"),
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
});

export type AppRouter = typeof appRouter;
