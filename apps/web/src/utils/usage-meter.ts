export function usageBarColorClass(used: number, limit: number): string {
  const ratio = Math.min(used / Math.max(limit, 1), 1);
  if (ratio >= 1) return "bg-destructive";
  if (ratio >= 0.8) return "bg-warning";
  return "bg-accent";
}
