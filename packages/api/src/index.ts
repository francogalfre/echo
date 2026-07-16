import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";
import { findFirstOrganizationId, findMembership } from "./services/organization";

export type { AppRouter } from "./routers/index";

type SessionWithOrg = { activeOrganizationId?: string | null };

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }

  return next({ ctx: { ...ctx, session: ctx.session } });
});

export const organizationProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const { activeOrganizationId } = ctx.session.session as SessionWithOrg;
  const organizationId =
    activeOrganizationId ?? (await findFirstOrganizationId(ctx.session.user.id));

  if (!organizationId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
  }

  const membership = await findMembership(ctx.session.user.id, organizationId);

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Not a member of this organization",
    });
  }

  return next({ ctx: { ...ctx, organizationId } });
});
