import { Badge } from "@echo/ui/components/badge";
import { cn } from "@echo/ui/lib/utils";

type ErrorRow = {
  status: number;
  meaning: string;
};

const ERRORS: readonly ErrorRow[] = [
  { status: 400, meaning: "Invalid or malformed JSON request body." },
  { status: 401, meaning: "Missing or invalid Bearer token." },
  {
    status: 403,
    meaning:
      "Wrong key type for the operation, or the monthly feedback limit was reached on the " +
      "free plan. Upgrade to Pro to remove the limit.",
  },
];

function statusTone(status: number): string {
  if (status < 300) return "bg-pastel-green-bg text-pastel-green-text";
  if (status < 500) return "bg-pastel-amber-bg text-pastel-amber-text";
  return "bg-pastel-rose-bg text-pastel-rose-text";
}

export const ErrorTable = (): React.ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border bg-muted/30 text-left">
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </th>
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Meaning
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {ERRORS.map((row) => (
          <tr key={row.status} className="transition-colors hover:bg-muted/30">
            <td className="px-4 py-3">
              <Badge className={cn(statusTone(row.status), "font-mono tabular-nums")}>
                {row.status}
              </Badge>
            </td>
            <td className="px-4 py-3 text-muted-foreground">{row.meaning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
