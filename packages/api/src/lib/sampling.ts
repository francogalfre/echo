export function sampleProportional<T extends { tags?: readonly string[] | null }>(
  items: readonly T[],
  max: number,
): T[] {
  if (items.length <= max) return [...items];

  const byTag = new Map<string, T[]>();
  const untagged: T[] = [];

  for (const item of items) {
    const tag = item.tags?.[0] ?? null;
    if (!tag) {
      untagged.push(item);
    } else {
      const bucket = byTag.get(tag) ?? [];
      bucket.push(item);
      byTag.set(tag, bucket);
    }
  }

  const buckets = [...byTag.values(), untagged].filter((b) => b.length > 0);
  const basePerBucket = Math.floor(max / buckets.length);
  const remainder = max % buckets.length;
  const result: T[] = [];

  buckets.forEach((bucket, index) => {
    const capacity = max - result.length;
    if (capacity <= 0) return;
    const share = basePerBucket + (index < remainder ? 1 : 0);
    const take = Math.max(1, Math.min(share, capacity));
    result.push(...bucket.slice(0, take));
  });

  const remaining = max - result.length;
  if (remaining > 0) {
    const used = new Set(result);
    for (const item of items) {
      if (!used.has(item) && result.length < max) result.push(item);
    }
  }

  return result;
}
