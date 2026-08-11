import { z } from "zod";

export const JOB_KINDS = [
  "feedback.enrich",
  "feedback.enrich.sweep",
  "digest.weekly.sweep",
  "digest.generate",
] as const;

export type JobKind = (typeof JOB_KINDS)[number];

export const feedbackEnrichPayloadSchema = z.object({
  feedbackId: z.string().min(1),
  content: z.string().min(1),
});

export const feedbackEnrichSweepPayloadSchema = z.object({});

export const digestWeeklySweepPayloadSchema = z.object({});

export const digestGeneratePayloadSchema = z.object({
  organizationId: z.string().min(1),
});

export const JOB_PAYLOAD_SCHEMAS = {
  "feedback.enrich": feedbackEnrichPayloadSchema,
  "feedback.enrich.sweep": feedbackEnrichSweepPayloadSchema,
  "digest.weekly.sweep": digestWeeklySweepPayloadSchema,
  "digest.generate": digestGeneratePayloadSchema,
} satisfies Record<JobKind, z.ZodType>;
