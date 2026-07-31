import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  generateApiKey,
  listApiKeys,
  revokeApiKeyById,
  rollApiKey,
} from "../controllers/api-keys";
import { organizationProcedure, ownerProcedure, router } from "../index";
import { getErrorCode } from "../lib/error-map";

const defaultKeyName = "Default";

export const apiKeysRouter = router({
  get: organizationProcedure.query(({ ctx }) => listApiKeys(ctx.organizationId)),

  generate: ownerProcedure
    .input(z.object({ name: z.string().min(1).max(100).default(defaultKeyName) }))
    .mutation(async ({ ctx, input }) => {
      const result = await generateApiKey(
        ctx.organizationId,
        ctx.session.user.id,
        input.name,
      );
      if (!result.success) {
        throw new TRPCError({ code: getErrorCode(result.status), message: result.error });
      }
      return result.key;
    }),

  roll: ownerProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await rollApiKey(ctx.organizationId, ctx.session.user.id, input.id);
      if (!result.success) {
        throw new TRPCError({ code: getErrorCode(result.status), message: result.error });
      }
      return result.key;
    }),

  revoke: ownerProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await revokeApiKeyById(ctx.organizationId, input.id);
      if (!result.success) {
        throw new TRPCError({ code: getErrorCode(result.status), message: result.error });
      }
    }),
});
