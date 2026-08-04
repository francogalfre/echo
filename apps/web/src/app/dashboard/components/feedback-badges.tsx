import { Badge } from "@echo/ui/components/badge";
import { cn } from "@echo/ui/lib/utils";

const SENTIMENT_STYLE: Record<string, string> = {
  positive: "bg-success/20 text-success",
  neutral: "bg-muted text-muted-foreground",
  negative: "bg-destructive/20 text-destructive",
};

const NEUTRAL_STYLE = "bg-muted text-muted-foreground";

const SOURCE_LABEL: Record<string, string> = {
  api: "API",
  form: "Form",
  widget: "Widget",
};

const SOURCE_STYLE: Record<string, string> = {
  api: "bg-accent text-white",
  form: "bg-accent-soft text-white",
  widget: "bg-accent-deep text-white",
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
  const style = SENTIMENT_STYLE[value] ?? NEUTRAL_STYLE;

  return <Badge className={cn(style, "capitalize", className)}>{value}</Badge>;
}

type SourceBadgeProps = {
  source: string;
  className?: string;
};

export function SourceBadge({ source, className }: SourceBadgeProps): React.ReactElement {
  const style = SOURCE_STYLE[source] ?? NEUTRAL_STYLE;

  return <Badge className={cn(style, className)}>{SOURCE_LABEL[source] ?? source}</Badge>;
}

type TagPillProps = {
  label: string;
  className?: string;
};

export function TagPill({ label, className }: TagPillProps): React.ReactElement {
  return (
    <Badge className={cn(NEUTRAL_STYLE, "max-w-[8rem] truncate", className)}>{label}</Badge>
  );
}
