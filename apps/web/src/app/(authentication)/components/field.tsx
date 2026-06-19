import { Label } from "@echo/ui/components/label";
import type { ReactNode } from "react";

interface FieldProps {
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export const Field = ({ name, label, error, children }: FieldProps) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-medium text-foreground">
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
};
