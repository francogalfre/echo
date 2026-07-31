import { randomBytes } from "node:crypto";

import { db } from "@echo/db";
import { apiKeys } from "@echo/db/schema/feedback";
import { and, desc, eq, isNull, lt, or } from "drizzle-orm";

import { sha256 } from "../lib/crypto";

export type ApiKeyRow = typeof apiKeys.$inferSelect;

export type PublicKeyLookup = {
  publicKey: string;
  organizationId: string;
  name: string;
  logo: string | null;
  accentColor: string;
};

export type WidgetInstallInfo = {
  publicKey: string;
  orgSlug: string;
  name: string;
  logo: string | null;
  accentColor: string;
};

export type InsertApiKeyInput = {
  organizationId: string;
  name: string;
  publicKey: string;
  publicKeyHash: string;
  secretKeyHash: string;
  secretKeyPrefix: string;
  scopes: readonly string[];
  createdBy: string;
};

const DEFAULT_ACCENT_COLOR = "#7C3AED";
const LAST_USED_THROTTLE_MS = 5 * 60 * 1000;

export function generateRawKey(prefix: "echo_pk_" | "echo_sk_"): string {
  return `${prefix}${randomBytes(32).toString("hex")}`;
}

export function hashKey(key: string): string {
  return sha256(key);
}

export async function insertApiKey(input: InsertApiKeyInput): Promise<ApiKeyRow> {
  const [row] = await db
    .insert(apiKeys)
    .values({
      id: crypto.randomUUID(),
      organizationId: input.organizationId,
      name: input.name,
      publicKey: input.publicKey,
      publicKeyHash: input.publicKeyHash,
      secretKeyHash: input.secretKeyHash,
      secretKeyPrefix: input.secretKeyPrefix,
      scopes: [...input.scopes],
      createdBy: input.createdBy,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to insert API key");
  }

  return row;
}

export async function revokeApiKey(
  id: string,
  organizationId: string,
  revokedAt: Date,
): Promise<boolean> {
  const result = await db
    .update(apiKeys)
    .set({ revokedAt })
    .where(and(eq(apiKeys.id, id), eq(apiKeys.organizationId, organizationId)))
    .returning();

  return result.length > 0;
}

export function findKeysByOrganization(
  organizationId: string,
): Promise<readonly ApiKeyRow[]> {
  return db.query.apiKeys.findMany({
    where: (k) => eq(k.organizationId, organizationId),
    orderBy: (k) => desc(k.createdAt),
  });
}

export async function touchLastUsed(id: string): Promise<void> {
  const threshold = new Date(Date.now() - LAST_USED_THROTTLE_MS);

  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(
      and(
        eq(apiKeys.id, id),
        or(isNull(apiKeys.lastUsedAt), lt(apiKeys.lastUsedAt, threshold)),
      ),
    );
}

export function findByPublicKey(publicKey: string): Promise<ApiKeyRow | undefined> {
  return db.query.apiKeys.findFirst({
    where: (k) => eq(k.publicKeyHash, sha256(publicKey)),
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
    columns: { id: true, name: true, logo: true },
  });

  if (!org) return null;

  const [keys, config] = await Promise.all([
    db.query.apiKeys.findFirst({
      where: (k) => and(eq(k.organizationId, org.id), isNull(k.revokedAt)),
      orderBy: (k) => desc(k.createdAt),
      columns: { publicKey: true, organizationId: true },
    }),
    db.query.feedbackPageConfig.findFirst({
      where: (c) => eq(c.organizationId, org.id),
      columns: { accentColor: true },
    }),
  ]);

  if (!keys) return null;

  return {
    publicKey: keys.publicKey,
    organizationId: keys.organizationId,
    name: org.name,
    logo: org.logo,
    accentColor: config?.accentColor ?? DEFAULT_ACCENT_COLOR,
  };
}

export async function getWidgetInstallInfo(
  organizationId: string,
): Promise<WidgetInstallInfo | null> {
  const [org, keys, config] = await Promise.all([
    db.query.organization.findFirst({
      where: (o) => eq(o.id, organizationId),
      columns: { slug: true, name: true, logo: true },
    }),
    db.query.apiKeys.findFirst({
      where: (k) => and(eq(k.organizationId, organizationId), isNull(k.revokedAt)),
      orderBy: (k) => desc(k.createdAt),
      columns: { publicKey: true },
    }),
    db.query.feedbackPageConfig.findFirst({
      where: (c) => eq(c.organizationId, organizationId),
      columns: { accentColor: true },
    }),
  ]);

  if (!org || !keys) return null;

  return {
    orgSlug: org.slug,
    publicKey: keys.publicKey,
    name: org.name,
    logo: org.logo,
    accentColor: config?.accentColor ?? DEFAULT_ACCENT_COLOR,
  };
}
