import { Badge } from "@echo/ui/components/badge";
import { cn } from "@echo/ui/lib/utils";

export type HttpMethod = "GET" | "POST";

const METHOD_TONE: Record<HttpMethod, string> = {
  GET: "bg-pastel-blue-bg text-pastel-blue-text",
  POST: "bg-pastel-violet-bg text-pastel-violet-text",
};

type MethodBadgeProps = {
  method: HttpMethod;
  className?: string;
};

export function MethodBadge({ method, className }: MethodBadgeProps): React.ReactElement {
  return (
    <Badge className={cn(METHOD_TONE[method], "font-mono font-bold uppercase", className)}>
      {method}
    </Badge>
  );
}
