type SparklineProps = {
  data: number[];
  color: string;
};

function Sparkline({ data, color }: SparklineProps): React.ReactElement {
  const max = Math.max(...data, 1);
  const w = 80;
  const h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 4) - 2;
    return { x, y };
  });
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = [
    `M ${pts[0]?.x ?? 0},${h}`,
    ...pts.map((p) => `L ${p.x},${p.y}`),
    `L ${pts[pts.length - 1]?.x ?? w},${h}`,
    "Z",
  ].join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  growth: number | null;
  subtitle: string;
  sparkline: number[];
  color?: string;
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function StatCard({
  label,
  value,
  growth,
  subtitle,
  sparkline,
  color = "#7C3AED",
}: StatCardProps): React.ReactElement {
  const isPositive = growth !== null && growth >= 0;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="mt-1.5 flex items-baseline gap-2.5">
            <span className="text-2xl font-semibold tracking-tight">
              {formatNumber(value)}
            </span>
            {growth !== null && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {isPositive ? "↑" : "↓"} {Math.abs(growth)}%
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Sparkline data={sparkline} color={color} />
      </div>
    </div>
  );
}
