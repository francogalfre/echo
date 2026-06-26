import { cn } from "@echo/ui/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: Props): React.ReactElement {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 py-10", className)}>{children}</div>
  );
}
