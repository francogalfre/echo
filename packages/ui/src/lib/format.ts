const countFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}
