import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Enter a project name").max(100, "Keep it under 100 characters"),
  slug: z
    .string()
    .min(1, "Enter a slug")
    .max(100, "Keep it under 100 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;
