import { cn } from "@echo/ui/lib/utils";

import { Label } from "./label";
import type { ReactNode } from "react";

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export const Field = ({ name, label, error, hint, className, children }: FieldProps) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={name} className="text-xs font-medium text-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
};
