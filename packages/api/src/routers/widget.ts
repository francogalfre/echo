import { TRPCError } from "@trpc/server";

import { protectedProcedure, router } from "../index";
import { resolveInstallInfo } from "../controllers/widget";

type SessionWithOrg = { activeOrganizationId?: string | null };

function getActiveOrgId(ctx: { session: { session: unknown } }): string {
  const orgId = (ctx.session.session as SessionWithOrg).activeOrganizationId;
  if (!orgId)
    throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
  return orgId;
}

export const widgetRouter = router({
  getInstallInfo: protectedProcedure.query(async ({ ctx }) => {
    const orgId = getActiveOrgId(ctx);
    return resolveInstallInfo(orgId);
  }),
});
