import { cn } from "@echo/ui/lib/utils";
import type { ReactNode } from "react";

type SettingsRowProps = {
  label: string;
  htmlFor?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export const SettingsRow = ({
  label,
  htmlFor,
  description,
  children,
  className,
}: SettingsRowProps): React.ReactElement => (
  <div
    className={cn(
      "grid grid-cols-1 gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[280px_minmax(0,1fr)] sm:gap-8",
      className,
    )}
  >
    <div className="space-y-1">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
    </div>
    <div className="min-w-0">{children}</div>
  </div>
);
