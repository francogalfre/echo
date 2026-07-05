type Props = {
  insight: string;
};

export function InsightContent({ insight }: Props): React.ReactElement {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:text-muted-foreground">
      {insight.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <p key={i} className="font-semibold text-foreground">
              {trimmed.slice(2, -2)}
            </p>
          );
        }
        if (trimmed.startsWith("- **")) {
          const colonIdx = trimmed.indexOf("**:", 4);
          const heading = colonIdx > 0 ? trimmed.slice(4, colonIdx) : null;
          const rest = colonIdx > 0 ? trimmed.slice(colonIdx + 3).trim() : trimmed.slice(2);
          return (
            <p key={i} className="text-muted-foreground">
              {heading && <strong className="text-foreground">{heading}: </strong>}
              {rest}
            </p>
          );
        }
        return (
          <p key={i} className="text-muted-foreground">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
