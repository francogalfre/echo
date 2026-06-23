import { createHash, randomBytes } from "node:crypto";

import { db } from "@echo/db";
import { apiKeys } from "@echo/db/schema/feedback";
import { eq } from "drizzle-orm";

export type ApiKeyRow = typeof apiKeys.$inferSelect;

export function generateRawKey(prefix: "echo_pk_" | "echo_sk_"): string {
  return `${prefix}${randomBytes(32).toString("hex")}`;
}

export function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function getApiKeys(organizationId: string): Promise<ApiKeyRow | undefined> {
  return db.query.apiKeys.findFirst({
    where: (k) => eq(k.organizationId, organizationId),
  });
}

export async function upsertApiKeys(
  organizationId: string,
  publicKey: string,
  secretKeyHash: string,
): Promise<void> {
  await db
    .insert(apiKeys)
    .values({ id: crypto.randomUUID(), organizationId, publicKey, secretKeyHash })
    .onConflictDoUpdate({
      target: apiKeys.organizationId,
      set: { publicKey, secretKeyHash, updatedAt: new Date() },
    });
}

export function findByPublicKey(publicKey: string): Promise<ApiKeyRow | undefined> {
  return db.query.apiKeys.findFirst({
    where: (k) => eq(k.publicKey, publicKey),
  });
}

export function findBySecretKeyHash(secretKeyHash: string): Promise<ApiKeyRow | undefined> {
  return db.query.apiKeys.findFirst({
    where: (k) => eq(k.secretKeyHash, secretKeyHash),
  });
}
