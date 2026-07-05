import { AnimatedCounter } from "@echo/ui/components/animated-counter";
import { Badge } from "@echo/ui/components/badge";
import { Sparkline } from "@echo/ui/components/sparkline";
import { cn } from "@echo/ui/lib/utils";

type MetricCardProps = {
  label: string;
  icon: React.ReactNode;
  iconClassName?: string;
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
      {positive ? "↑" : "↓"} {Math.abs(growth)}%
    </Badge>
  );
}

export function MetricCard({
  label,
  icon,
  iconClassName,
  value,
  growth,
  caption,
  sparklineData,
  sparklineColor,
}: MetricCardProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-card p-5 ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md",
            iconClassName,
          )}
        >
          {icon}
        </span>
      </div>
      <AnimatedCounter value={value} className="text-3xl font-semibold tracking-tight" />
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <TrendBadge growth={growth} />
        {caption}
      </div>
      <Sparkline data={sparklineData} color={sparklineColor} className="mt-1" />
    </div>
  );
}
