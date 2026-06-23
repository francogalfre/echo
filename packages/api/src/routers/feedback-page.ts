import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";
import { getFeedbackPageConfig, upsertFeedbackPageConfig } from "../services/feedback-page";

const updateConfigInput = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  enableEmail: z.boolean().optional(),
  enableRating: z.boolean().optional(),
  enableCoverBanner: z.boolean().optional(),
});

type SessionWithOrg = { activeOrganizationId?: string | null };

function getActiveOrgId(ctx: { session: { session: unknown } }): string {
  const orgId = (ctx.session.session as SessionWithOrg).activeOrganizationId;
  if (!orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
  }
  return orgId;
}

export const feedbackPageRouter = router({
  getConfig: protectedProcedure.query(async ({ ctx }) => {
    const orgId = getActiveOrgId(ctx);
    return (await getFeedbackPageConfig(orgId)) ?? null;
  }),

  upsertConfig: protectedProcedure
    .input(updateConfigInput)
    .mutation(async ({ input, ctx }) => {
      const orgId = getActiveOrgId(ctx);
      await upsertFeedbackPageConfig(orgId, input);
    }),

  publish: protectedProcedure.mutation(async ({ ctx }) => {
    const orgId = getActiveOrgId(ctx);
    await upsertFeedbackPageConfig(orgId, { published: true });
  }),
});
