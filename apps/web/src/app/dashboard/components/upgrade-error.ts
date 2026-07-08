export function isUpgradeError(message: string): boolean {
  return message.includes("Upgrade to Pro");
}
