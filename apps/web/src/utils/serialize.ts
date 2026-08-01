export function reviveDate(value: string | Date): Date {
  return typeof value === "string" ? new Date(value) : value;
}
