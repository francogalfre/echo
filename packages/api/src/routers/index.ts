import { router } from "../index";
import { apiKeysRouter } from "./api-keys";
import { billingRouter } from "./billing";
import { boardRouter } from "./board";
import { chatRouter } from "./chat";
import { dashboardRouter } from "./dashboard";
import { digestRouter } from "./digest";
import { feedbackRouter } from "./feedback";
import { feedbackPageRouter } from "./feedback-page";
import { publicFeedbackRouter } from "./public-feedback";
import { widgetRouter } from "./widget";

export const appRouter = router({
  apiKeys: apiKeysRouter,
  billing: billingRouter,
  board: boardRouter,
  chat: chatRouter,
  dashboard: dashboardRouter,
  digest: digestRouter,
  feedback: feedbackRouter,
  feedbackPage: feedbackPageRouter,
  publicFeedback: publicFeedbackRouter,
  widget: widgetRouter,
});

export type AppRouter = typeof appRouter;
