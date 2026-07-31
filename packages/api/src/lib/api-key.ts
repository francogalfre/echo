import type { ApiKeyRow } from "../services/api-keys";

export function isKeyLive(row: ApiKeyRow): boolean {
  return row.revokedAt === null || row.revokedAt > new Date();
}
