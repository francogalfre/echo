export type Plan = "free" | "pro";

export function isPro(plan: Plan): boolean {
  return plan === "pro";
}
