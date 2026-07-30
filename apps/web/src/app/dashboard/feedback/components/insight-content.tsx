import { cn } from "@echo/ui/lib/utils";

import type { AgentPersona } from "../../components/agent-personas";

type Props = {
  insight: string;
  agent?: AgentPersona;
};

export function InsightContent({ insight, agent }: Props): React.ReactElement {
  const AgentIcon = agent?.icon;

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed",
        "[&_strong]:font-semibold [&_strong]:text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:text-muted-foreground",
        agent?.color === "text-destructive" && "border-destructive/20",
        agent?.color === "text-info" && "border-info/20",
        agent?.color === "text-success" && "border-success/20",
      )}
    >
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

      {agent && AgentIcon && (
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span
            className={`flex size-5 items-center justify-center rounded-full ${agent.avatarBg}`}
          >
            <AgentIcon className={`size-2.5 ${agent.avatarText}`} />
          </span>
          <span>Analyzed by {agent.name}</span>
        </div>
      )}
    </div>
  );
}
