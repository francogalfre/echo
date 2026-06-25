import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

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

export const organizationProcedure = protectedProcedure.use(({ ctx, next }) => {
  const { activeOrganizationId } = ctx.session.session as SessionWithOrg;

  if (!activeOrganizationId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
  }

  return next({ ctx: { ...ctx, organizationId: activeOrganizationId } });
});
