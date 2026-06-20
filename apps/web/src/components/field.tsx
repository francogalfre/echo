import { Label } from "@echo/ui/components/label";
import type { ReactNode } from "react";

interface FieldProps {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export const Field = ({ name, label, error, hint, children }: FieldProps) => {
  return (
    <div className="space-y-1.5">
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
