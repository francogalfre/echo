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
    return <span className="text-xs text-muted-foreground">--</span>;
  }
  const positive = growth >= 0;
  return (
    <Badge variant={positive ? "success" : "destructive"}>
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
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <p className="text-xs text-muted-foreground">{label}</p>
      <AnimatedCounter value={value} className="text-2xl font-semibold tracking-tight" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <TrendBadge growth={growth} />
        <span>{caption}</span>
      </div>
      <Sparkline data={sparklineData} color={sparklineColor} className="mt-1" />
    </div>
  );
}
