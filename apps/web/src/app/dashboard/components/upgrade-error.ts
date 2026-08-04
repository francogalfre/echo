function readNestedQuotaCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("data" in error)) return undefined;

  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== "object" || !("code" in data)) return undefined;

  const code = (data as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

function readNestedUpgradeFlag(error: unknown): boolean | undefined {
  if (!error || typeof error !== "object" || !("data" in error)) return undefined;

  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== "object" || !("upgrade" in data)) return undefined;

  const upgrade = (data as { upgrade?: unknown }).upgrade;
  return typeof upgrade === "boolean" ? upgrade : undefined;
}

function readDirectUpgradeFlag(error: unknown): boolean | undefined {
  if (!error || typeof error !== "object" || !("upgrade" in error)) return undefined;

  const upgrade = (error as { upgrade?: unknown }).upgrade;
  return typeof upgrade === "boolean" ? upgrade : undefined;
}

export function isUpgradeError(error: unknown): boolean {
  const code = readNestedQuotaCode(error);
  if (code !== undefined) return code === "QUOTA_EXCEEDED";

  return readNestedUpgradeFlag(error) ?? readDirectUpgradeFlag(error) ?? false;
}
