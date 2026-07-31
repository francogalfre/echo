import { z } from "zod";

export const inviteStepSchema = z.object({
  email: z.email("Enter a valid email"),
  role: z.enum(["admin", "member"]),
});

export type InviteStepValues = z.infer<typeof inviteStepSchema>;
