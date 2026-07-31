import { isKeyLive } from "../lib/api-key";
import {
  findKeysByOrganization,
  generateRawKey,
  hashKey,
  insertApiKey,
  revokeApiKey,
  type ApiKeyRow,
} from "../services/api-keys";

const gracePeriodMs = 24 * 60 * 60 * 1000;
const defaultScopes = ["feedback:write", "feedback:read"] as const;

export type ApiKeyListItem = {
  id: string;
  name: string;
  publicKey: string;
  hasSecret: boolean;
  scopes: readonly string[];
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};

export type IssuedKey = { id: string; name: string; publicKey: string; secretKey: string };

type Failure<Status extends number> = { success: false; status: Status; error: string };

export type GenerateApiKeyResult = { success: true; key: IssuedKey } | Failure<409>;
export type RollApiKeyResult = { success: true; key: IssuedKey } | Failure<404>;
export type RevokeApiKeyResult = { success: true } | Failure<404>;

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

export async function listApiKeys(organizationId: string): Promise<ApiKeyListItem[]> {
  const rows = await findKeysByOrganization(organizationId);
  return rows.filter(isKeyLive).map(toListItem);
}

export async function generateApiKey(
  organizationId: string,
  createdBy: string,
  name: string,
): Promise<GenerateApiKeyResult> {
  const existing = await findKeysByOrganization(organizationId);
  if (existing.some((row) => row.name === name && isKeyLive(row))) {
    return {
      success: false,
      status: 409,
      error: "A live key with this name already exists",
    };
  }

  return { success: true, key: await issueNamedKey(organizationId, createdBy, name) };
}

export async function rollApiKey(
  organizationId: string,
  createdBy: string,
  id: string,
): Promise<RollApiKeyResult> {
  const existing = await findKeysByOrganization(organizationId);
  const target = existing.find((row) => row.id === id && isKeyLive(row));
  if (!target) {
    return { success: false, status: 404, error: "No live API key to roll" };
  }

  await revokeApiKey(target.id, organizationId, new Date(Date.now() + gracePeriodMs));

  return {
    success: true,
    key: await issueNamedKey(organizationId, createdBy, target.name),
  };
}

export async function revokeApiKeyById(
  organizationId: string,
  id: string,
): Promise<RevokeApiKeyResult> {
  const revoked = await revokeApiKey(id, organizationId, new Date());
  if (!revoked) {
    return { success: false, status: 404, error: "API key not found" };
  }

  return { success: true };
}
