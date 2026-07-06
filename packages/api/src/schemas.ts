import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const feedbackPageConfigSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  accentColor: hexColor.optional(),
  backgroundColor: z.string().max(200).optional(),
  enableEmail: z.boolean().optional(),
  enableRating: z.boolean().optional(),
  enableCoverBanner: z.boolean().optional(),
  coverBannerUrl: z.string().max(2000).optional(),
  showFeedback: z.boolean().optional(),
});

export const publicFeedbackSchema = z.object({
  slug: z.string().min(1),
  authorName: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  email: z.email().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  _hp: z.string().optional(),
});

export const slugSchema = z.object({ slug: z.string().min(1) });

export type FeedbackPageConfigInput = z.infer<typeof feedbackPageConfigSchema>;
export type PublicFeedbackInput = z.infer<typeof publicFeedbackSchema>;
