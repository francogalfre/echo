import type { SentimentBreakdown } from "@echo/api/services/dashboard";

type Props = {
  breakdown: SentimentBreakdown;
};

const SEGMENTS = [
  { key: "positive" as const, label: "Positive", color: "#10B981" },
  { key: "negative" as const, label: "Negative", color: "#EF4444" },
  { key: "neutral" as const, label: "Neutral", color: "#6B7280" },
  { key: "none" as const, label: "Unanalyzed", color: "#D1D5DB" },
];

export function SentimentBreakdown({ breakdown }: Props): React.ReactElement {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Feedback
          </p>
          <h2 className="mt-0.5 text-base font-semibold">Sentiments</h2>
        </div>
        <div className="flex items-center gap-3">
          {SEGMENTS.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {total > 0 &&
          SEGMENTS.map((s) => {
            const pct = (breakdown[s.key] / total) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={s.key}
                style={{ width: `${pct}%`, backgroundColor: s.color }}
                title={`${s.label}: ${breakdown[s.key]}`}
              />
            );
          })}
        {total === 0 && <div className="h-full w-full rounded-full bg-muted" />}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {SEGMENTS.map((s) => {
          const pct = total > 0 ? Math.round((breakdown[s.key] / total) * 100) : 0;
          return (
            <div key={s.key}>
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {breakdown[s.key].toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{pct}% of total</p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground/50">
        Chart visualization coming soon
      </p>
    </div>
  );
}
