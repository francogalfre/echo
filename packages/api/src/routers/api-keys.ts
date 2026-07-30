import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { organizationProcedure, ownerProcedure, router } from "../index";
import {
  findKeysByOrganization,
  generateRawKey,
  hashKey,
  insertApiKey,
  revokeApiKey,
  type ApiKeyRow,
} from "../services/api-keys";

const gracePeriodMs = 24 * 60 * 60 * 1000;
const defaultKeyName = "Default";
const defaultScopes = ["feedback:write", "feedback:read"] as const;

type ApiKeyListItem = {
  id: string;
  name: string;
  publicKey: string;
  hasSecret: boolean;
  scopes: readonly string[];
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};

type IssuedKey = { id: string; name: string; publicKey: string; secretKey: string };

function isLive(row: ApiKeyRow): boolean {
  return row.revokedAt === null || row.revokedAt > new Date();
}

function toListItem(row: ApiKeyRow): ApiKeyListItem {
  return {
    id: row.id,
    name: row.name,
    publicKey: row.publicKey,
    hasSecret: true,
    scopes: row.scopes,
    createdAt: row.createdAt,
    lastUsedAt: row.lastUsedAt,
    revokedAt: row.revokedAt,
  };
}

async function issueNamedKey(
  organizationId: string,
  createdBy: string,
  name: string,
): Promise<IssuedKey> {
  const publicKey = generateRawKey("echo_pk_");
  const secretKey = generateRawKey("echo_sk_");
  const secretKeyHash = hashKey(secretKey);

  const row = await insertApiKey({
    organizationId,
    name,
    publicKey,
    publicKeyHash: hashKey(publicKey),
    secretKeyHash,
    secretKeyPrefix: secretKeyHash.slice(0, 12),
    scopes: defaultScopes,
    createdBy,
  });

  return { id: row.id, name: row.name, publicKey, secretKey };
}

export const apiKeysRouter = router({
  get: organizationProcedure.query(async ({ ctx }) => {
    const rows = await findKeysByOrganization(ctx.organizationId);
    return rows.filter(isLive).map(toListItem);
  }),

  generate: ownerProcedure
    .input(z.object({ name: z.string().min(1).max(100).default(defaultKeyName) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await findKeysByOrganization(ctx.organizationId);
      if (existing.some((row) => row.name === input.name && isLive(row))) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A live key with this name already exists",
        });
      }

      return issueNamedKey(ctx.organizationId, ctx.session.user.id, input.name);
    }),

  roll: ownerProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await findKeysByOrganization(ctx.organizationId);
      const target = existing.find((row) => row.id === input.id && isLive(row));
      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No live API key to roll" });
      }

      await revokeApiKey(
        target.id,
        ctx.organizationId,
        new Date(Date.now() + gracePeriodMs),
      );

      return issueNamedKey(ctx.organizationId, ctx.session.user.id, target.name);
    }),

  revoke: ownerProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const revoked = await revokeApiKey(input.id, ctx.organizationId, new Date());
      if (!revoked) {
        throw new TRPCError({ code: "NOT_FOUND", message: "API key not found" });
      }
    }),
});
