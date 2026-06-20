import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Enter a project name"),
  slug: z
    .string()
    .min(1, "Enter a slug")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;
