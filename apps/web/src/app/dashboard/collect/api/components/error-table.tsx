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

export const ErrorTable = (): React.ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border bg-muted/30 text-left">
          <th className="px-4 py-2.5 font-medium text-muted-foreground">Status</th>
          <th className="px-4 py-2.5 font-medium text-muted-foreground">Meaning</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {ERRORS.map((row) => (
          <tr key={row.status}>
            <td className="px-4 py-2.5 font-mono text-xs">{row.status}</td>
            <td className="px-4 py-2.5 text-muted-foreground">{row.meaning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
