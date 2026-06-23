import { getFeedback, submitFeedback } from "@echo/api/controllers/external-feedback";
import { Hono } from "hono";
import { z } from "zod";

export const feedbackApi = new Hono();

const submitSchema = z.object({
  name: z.string().min(1).max(100),
  feedback: z.string().min(1).max(5000),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

feedbackApi.post("/", async (c) => {
  const authorization = c.req.header("Authorization");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid request body" }, 400);
  }

  try {
    const result = await submitFeedback({ authorization, ...parsed.data });
    if (!result.success) return c.json({ error: result.error }, result.status);
    return c.json({ success: true }, 201);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

feedbackApi.get("/", async (c) => {
  const authorization = c.req.header("Authorization");

  try {
    const result = await getFeedback({ authorization });
    if (!result.success) return c.json({ error: result.error }, result.status);
    return c.json({ feedback: result.feedback });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});
