import { z } from "zod";

export const submitFeedbackSchema = z.object({
  name: z.string().min(1).max(100),
  feedback: z.string().min(1).max(5000),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});
