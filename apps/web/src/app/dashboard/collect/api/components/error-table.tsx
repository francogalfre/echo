import { Badge } from "@echo/ui/components/badge";
import {
  DOCS_TABLE_HEAD_CELL,
  DocsTable,
  statusTone,
} from "@echo/ui/components/docs/docs-table";
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
    meaning: "Wrong key type, or the free plan's monthly limit was reached.",
  },
];

export const ErrorTable = (): React.ReactElement => (
  <DocsTable>
    <thead>
      <tr className="border-b border-border bg-muted/30 text-left">
        <th className={DOCS_TABLE_HEAD_CELL}>Status</th>
        <th className={DOCS_TABLE_HEAD_CELL}>Meaning</th>
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
  </DocsTable>
);
