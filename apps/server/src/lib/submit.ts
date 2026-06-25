import type { Context } from "hono";

import { submitFeedbackSchema } from "../schemas";

type SubmitResult =
  | { success: true }
  | { success: false; status: 400 | 401 | 403; error: string };

type SubmitFn = (input: {
  authorization: string | undefined;
  name: string;
  feedback: string;
  email?: string;
  rating?: number;
}) => Promise<SubmitResult>;

export function createSubmitHandler(submit: SubmitFn) {
  return async (c: Context): Promise<Response> => {
    const authorization = c.req.header("Authorization");

    let body: unknown;

    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const parsed = submitFeedbackSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: "Invalid request body" }, 400);

    const result = await submit({ authorization, ...parsed.data });
    if (!result.success) return c.json({ error: result.error }, result.status);

    return c.json({ success: true }, 201);
  };
}
