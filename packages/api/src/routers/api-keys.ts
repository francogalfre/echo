import { TRPCError } from "@trpc/server";

import { organizationProcedure, router } from "../index";
import { generateRawKey, getApiKeys, hashKey, upsertApiKeys } from "../services/api-keys";

function createKeyPair(): { publicKey: string; secretKey: string } {
  return {
    publicKey: generateRawKey("echo_pk_"),
    secretKey: generateRawKey("echo_sk_"),
  };
}

export const apiKeysRouter = router({
  get: organizationProcedure.query(async ({ ctx }) => {
    const keys = await getApiKeys(ctx.organizationId);
    if (!keys) return null;

    return { publicKey: keys.publicKey, hasSecret: true, createdAt: keys.createdAt };
  }),

  generate: organizationProcedure.mutation(async ({ ctx }) => {
    const { publicKey, secretKey } = createKeyPair();
    await upsertApiKeys(ctx.organizationId, publicKey, hashKey(secretKey));
    return { publicKey, secretKey };
  }),

  roll: organizationProcedure.mutation(async ({ ctx }) => {
    if (!(await getApiKeys(ctx.organizationId))) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No API keys to roll" });
    }

    const { publicKey, secretKey } = createKeyPair();
    await upsertApiKeys(ctx.organizationId, publicKey, hashKey(secretKey));
    return { publicKey, secretKey };
  }),
});
