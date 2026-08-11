import { initTRPC, TRPCError } from "@trpc/server";

import { QuotaExceededError } from "./controllers/quota";
import type { Context } from "./context";
import { resolveOrganizationContext } from "./lib/organization";
import { guardAiOrganization } from "./lib/rate-limit";

export type { AppRouter } from "./routers/index";

type SessionWithOrg = { activeOrganizationId?: string | null };

type OrgRole = "owner" | "admin" | "member";

function toOrgRole(role: string): OrgRole {
  if (role === "owner" || role === "admin") return role;
  return "member";
}

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    const isQuotaExceeded = error.cause instanceof QuotaExceededError;
    const upgrade = isQuotaExceeded ? error.cause.upgrade : false;
    const code = isQuotaExceeded ? "QUOTA_EXCEEDED" : undefined;

    return { ...shape, data: { ...shape.data, upgrade, code } };
  },
});

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
  const result = await resolveOrganizationContext(
    ctx.session.user.id,
    activeOrganizationId,
  );

  if (!result) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Not a member of this organization",
    });
  }

  return next({
    ctx: { ...ctx, organizationId: result.organizationId, role: toOrgRole(result.role) },
  });
});

export const aiProcedure = organizationProcedure.use(async ({ ctx, next }) => {
  const guard = await guardAiOrganization(ctx.organizationId);

  if (!guard.allowed) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: guard.message });
  }

  return next();
});

export const ownerProcedure = organizationProcedure.use(({ ctx, next }) => {
  if (ctx.role !== "owner") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Owner role required" });
  }

  return next();
});

export const adminProcedure = organizationProcedure.use(({ ctx, next }) => {
  if (ctx.role !== "owner" && ctx.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin role required" });
  }

  return next();
});
