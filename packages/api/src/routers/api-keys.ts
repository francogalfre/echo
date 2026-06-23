import { TRPCError } from "@trpc/server";

import { protectedProcedure, router } from "../index";
import { generateRawKey, getApiKeys, hashKey, upsertApiKeys } from "../services/api-keys";

type SessionWithOrg = { activeOrganizationId?: string | null };

function getActiveOrgId(ctx: { session: { session: unknown } }): string {
  const orgId = (ctx.session.session as SessionWithOrg).activeOrganizationId;
  if (!orgId)
    throw new TRPCError({ code: "BAD_REQUEST", message: "No active organization" });
  return orgId;
}

export const apiKeysRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const orgId = getActiveOrgId(ctx);
    const keys = await getApiKeys(orgId);
    if (!keys) return null;
    return {
      publicKey: keys.publicKey,
      hasSecret: true,
      createdAt: keys.createdAt,
    };
  }),

  generate: protectedProcedure.mutation(async ({ ctx }) => {
    const orgId = getActiveOrgId(ctx);
    const publicKey = generateRawKey("echo_pk_");
    const secretKey = generateRawKey("echo_sk_");
    await upsertApiKeys(orgId, publicKey, hashKey(secretKey));
    return { publicKey, secretKey };
  }),

  roll: protectedProcedure.mutation(async ({ ctx }) => {
    const orgId = getActiveOrgId(ctx);
    if (!(await getApiKeys(orgId))) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No API keys to roll" });
    }
    const publicKey = generateRawKey("echo_pk_");
    const secretKey = generateRawKey("echo_sk_");
    await upsertApiKeys(orgId, publicKey, hashKey(secretKey));
    return { publicKey, secretKey };
  }),
});
