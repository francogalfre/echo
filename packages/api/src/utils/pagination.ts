export function paginateRows<T>(
  rows: readonly T[],
  limit: number,
): { items: T[]; hasMore: boolean } {
  const hasMore = rows.length > limit;

  return { items: hasMore ? rows.slice(0, limit) : [...rows], hasMore };
}
