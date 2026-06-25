import { createHash, randomBytes } from "node:crypto";

import { db } from "@echo/db";
import { apiKeys } from "@echo/db/schema/feedback";
import { eq } from "drizzle-orm";

export type ApiKeyRow = typeof apiKeys.$inferSelect;

export type PublicKeyLookup = {
  publicKey: string;
  organizationId: string;
};

export type WidgetInstallInfo = {
  publicKey: string;
  orgSlug: string;
};

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

export async function getPublicKeyByOrgSlug(slug: string): Promise<PublicKeyLookup | null> {
  const org = await db.query.organization.findFirst({
    where: (o) => eq(o.slug, slug),
    columns: { id: true },
  });

  if (!org) return null;

  const keys = await db.query.apiKeys.findFirst({
    where: (k) => eq(k.organizationId, org.id),
    columns: { publicKey: true, organizationId: true },
  });

  return keys ?? null;
}

export async function getWidgetInstallInfo(
  organizationId: string,
): Promise<WidgetInstallInfo | null> {
  const [org, keys] = await Promise.all([
    db.query.organization.findFirst({
      where: (o) => eq(o.id, organizationId),
      columns: { slug: true },
    }),
    db.query.apiKeys.findFirst({
      where: (k) => eq(k.organizationId, organizationId),
      columns: { publicKey: true },
    }),
  ]);

  if (!org || !keys) return null;

  return { orgSlug: org.slug, publicKey: keys.publicKey };
}
