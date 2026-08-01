export const TABLE_HEAD_CELL =
  "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

export function statusTone(status: number): string {
  if (status < 300) return "bg-pastel-green-bg text-pastel-green-text";
  if (status < 500) return "bg-pastel-amber-bg text-pastel-amber-text";
  return "bg-pastel-rose-bg text-pastel-rose-text";
}
