import { AnimatedCounter } from "@echo/ui/components/animated-counter";
import { Badge } from "@echo/ui/components/badge";
import { Icons } from "@echo/ui/components/icons";
import { Sparkline } from "@echo/ui/components/sparkline";

type MetricCardProps = {
  label: string;
  value: number;
  growth: number | null;
  caption: string;
  sparklineData: readonly number[];
  sparklineColor?: string;
};

function TrendBadge({ growth }: { growth: number | null }): React.ReactElement {
  if (growth === null) {
    return <span className="text-[11px] font-medium text-muted-foreground/70">—</span>;
  }
  const positive = growth >= 0;
  return (
    <Badge variant={positive ? "success" : "destructive"} dot>
      {positive ? (
        <Icons.trendUp className="size-3" />
      ) : (
        <Icons.trendDown className="size-3" />
      )}
      {Math.abs(growth)}%
    </Badge>
  );
}

export function MetricCard({
  label,
  value,
  growth,
  caption,
  sparklineData,
  sparklineColor,
}: MetricCardProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-card p-5 ring-1 ring-foreground/10 transition-colors hover:ring-foreground/15">
      <p className="micro-label">{label}</p>
      <AnimatedCounter value={value} className="text-3xl font-semibold tracking-tight" />
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <TrendBadge growth={growth} />
        {caption}
      </div>
      <Sparkline data={sparklineData} color={sparklineColor} className="mt-1" />
    </div>
  );
}
