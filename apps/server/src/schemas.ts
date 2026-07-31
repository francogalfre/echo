import { feedbackContentSchema } from "@echo/api/schemas";
import { z } from "zod";

export const submitFeedbackSchema = z.object({
  name: z.string().min(1).max(100),
  feedback: feedbackContentSchema,
  email: z.email().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});
