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

function readUpgradeFlag(error: unknown): boolean | undefined {
  return readNestedUpgradeFlag(error) ?? readDirectUpgradeFlag(error);
}

export function isUpgradeError(error: unknown): boolean {
  const upgrade = readUpgradeFlag(error);
  if (upgrade !== undefined) return upgrade;

  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Upgrade to Pro");
}
