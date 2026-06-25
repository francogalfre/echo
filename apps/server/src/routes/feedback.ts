import { getFeedback, submitFeedback } from "@echo/api/controllers/external-feedback";
import { Hono } from "hono";

import { createSubmitHandler } from "../lib/submit";

export const feedbackRoutes = new Hono();

feedbackRoutes.post("/", createSubmitHandler(submitFeedback));

feedbackRoutes.get("/", async (c) => {
  const result = await getFeedback({ authorization: c.req.header("Authorization") });
  if (!result.success) return c.json({ error: result.error }, result.status);

  return c.json({ feedback: result.feedback });
});
