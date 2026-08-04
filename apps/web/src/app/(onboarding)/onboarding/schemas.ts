import { z } from "zod";

export const teamSizes = ["solo", "small", "medium", "large"] as const;

export type TeamSize = (typeof teamSizes)[number];

export const inviteSchema = z.object({
  email: z.email("Enter a valid email"),
  role: z.enum(["admin", "member"]),
});

export type InviteValues = z.infer<typeof inviteSchema>;
