import { FadeIn } from "@echo/ui/components/fade-in";
import { cn } from "@echo/ui/lib/utils";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps): React.ReactElement {
  return (
    <FadeIn className={cn("mb-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-pixel text-2xl font-medium tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
    </FadeIn>
  );
}
