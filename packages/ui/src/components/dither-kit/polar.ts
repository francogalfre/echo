type Row = Record<string, unknown>;

const TOP = -Math.PI / 2;
const TAU = Math.PI * 2;

export type PieSlice = {
  name: string;
  value: number;
  start: number; // radians
  end: number;
  mid: number;
};

/** Slice angles from each data row's value under `dataKey`, named by `nameKey`. */
export function pieSlices(data: Row[], dataKey: string, nameKey: string): PieSlice[] {
  const vals = data.map((r) => Math.max(0, Number(r[dataKey]) || 0));
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  let a = TOP;
  return data.map((r, i) => {
    const value = vals[i] ?? 0;
    const span = (value / total) * TAU;
    const slice = {
      name: String(r[nameKey] ?? i),
      value,
      start: a,
      end: a + span,
      mid: a + span / 2,
    };
    a += span;
    return slice;
  });
}

/** Which slice a pointer angle falls in (or -1). */
export function sliceAtAngle(slices: PieSlice[], angle: number): number {
  // Normalize so comparisons against [start, end) (which begin at TOP) work.
  let a = angle;
  while (a < TOP) a += TAU;
  while (a >= TOP + TAU) a -= TAU;
  return slices.findIndex((s) => a >= s.start && a < s.end);
}

export type RadarAxis = { label: string; angle: number };

/** Evenly-spaced spokes, one per data row, labelled by `nameKey`. */
export function radarAxes(data: Row[], nameKey: string): RadarAxis[] {
  const n = Math.max(data.length, 1);
  return data.map((r, i) => ({
    label: String(r[nameKey] ?? i),
    angle: TOP + (i / n) * TAU,
  }));
}

/** Nearest radar spoke to a pointer angle. */
export function axisAtAngle(axes: RadarAxis[], angle: number): number {
  let best = 0;
  let bestD = Infinity;
  axes.forEach((ax, i) => {
    let d = Math.abs(((angle - ax.angle + Math.PI * 3) % TAU) - Math.PI);
    d = Math.abs(d);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}
