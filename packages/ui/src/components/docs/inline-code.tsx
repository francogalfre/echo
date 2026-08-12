import { cn } from "@echo/ui/lib/utils";
import type { ReactNode } from "react";

type InlineCodeProps = {
  children: ReactNode;
  className?: string;
};

export function InlineCode({ children, className }: InlineCodeProps): React.ReactElement {
  return (
    <code
      className={cn(
        "rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground",
        className,
      )}
    >
      {children}
    </code>
  );
}
