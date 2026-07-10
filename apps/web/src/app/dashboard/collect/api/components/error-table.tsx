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
  if (status < 300) return "bg-success/10 text-success";
  if (status < 500) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

export const ErrorTable = (): React.ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border bg-muted/30 text-left">
          <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </th>
          <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Meaning
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {ERRORS.map((row) => (
          <tr key={row.status}>
            <td className="px-4 py-2.5">
              <span
                className={cn(
                  "inline-flex rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold",
                  statusTone(row.status),
                )}
              >
                {row.status}
              </span>
            </td>
            <td className="px-4 py-2.5 text-muted-foreground">{row.meaning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
