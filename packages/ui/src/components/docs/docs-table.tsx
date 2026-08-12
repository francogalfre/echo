import { cn } from "@echo/ui/lib/utils";
import type { ReactNode } from "react";

export const DOCS_TABLE_HEAD_CELL =
  "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap";

export function statusTone(status: number): string {
  if (status < 300) return "bg-pastel-green-bg text-pastel-green-text";
  if (status < 500) return "bg-pastel-amber-bg text-pastel-amber-text";
  return "bg-pastel-rose-bg text-pastel-rose-text";
}

type DocsTableProps = {
  children: ReactNode;
  className?: string;
};

export function DocsTable({ children, className }: DocsTableProps): React.ReactElement {
  return (
    <div className={cn("overflow-x-auto rounded-lg ring-1 ring-foreground/10", className)}>
      <table className="w-full text-xs">{children}</table>
    </div>
  );
}
