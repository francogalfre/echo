import { cn } from "@echo/ui/lib/utils";
import type { ReactNode } from "react";

type DocsSectionHeadingProps = {
  title: string;
  description?: ReactNode;
  className?: string;
};

export function DocsSectionHeading({
  title,
  description,
  className,
}: DocsSectionHeadingProps): React.ReactElement {
  return (
    <div className={cn("mb-5", className)}>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
