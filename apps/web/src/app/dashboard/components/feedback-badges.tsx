import { Badge } from "@echo/ui/components/badge";
import { cn } from "@echo/ui/lib/utils";

const PILL_STYLES = {
  green: "bg-success/10 text-success",
  slate: "bg-muted text-muted-foreground",
  rose: "bg-destructive/10 text-destructive",
  blue: "bg-info/10 text-info",
  violet: "bg-accent/10 text-accent",
  amber: "bg-warning/10 text-warning",
} as const;

type PillStyle = keyof typeof PILL_STYLES;

const SENTIMENT_STYLE: Record<string, PillStyle> = {
  positive: "green",
  neutral: "slate",
  negative: "rose",
};

const SOURCE_STYLE: Record<string, PillStyle> = {
  api: "blue",
  form: "violet",
  widget: "amber",
};

type SentimentBadgeProps = {
  sentiment: string | null;
  className?: string;
};

export function SentimentBadge({
  sentiment,
  className,
}: SentimentBadgeProps): React.ReactElement {
  const value = sentiment ?? "neutral";
  const style = SENTIMENT_STYLE[value] ?? "slate";

  return <Badge className={cn(PILL_STYLES[style], "capitalize", className)}>{value}</Badge>;
}

type SourceBadgeProps = {
  source: string;
  className?: string;
};

export function SourceBadge({ source, className }: SourceBadgeProps): React.ReactElement {
  const style = SOURCE_STYLE[source] ?? "slate";

  return (
    <Badge className={cn(PILL_STYLES[style], "capitalize", className)}>{source}</Badge>
  );
}

type TagPillProps = {
  label: string;
  className?: string;
};

export function TagPill({ label, className }: TagPillProps): React.ReactElement {
  return (
    <Badge className={cn(PILL_STYLES.slate, "max-w-[8rem] truncate", className)}>
      {label}
    </Badge>
  );
}
