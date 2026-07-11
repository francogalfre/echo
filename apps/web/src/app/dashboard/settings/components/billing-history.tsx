import { Icons } from "@echo/ui/components/icons";

import { SettingsCard } from "./settings-card";

const COLUMNS = ["Plan", "Amount", "Date", "Status"] as const;

export const BillingHistory = (): React.ReactElement => (
  <SettingsCard className="flex flex-col p-0">
    <div className="p-6 sm:p-8">
      <h3 className="text-sm font-semibold text-foreground">Billing history</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Your invoices and receipts will appear here.
      </p>
    </div>

    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-t border-border px-6 py-3 sm:grid sm:px-8">
      {COLUMNS.map((column) => (
        <span key={column} className="micro-label">
          {column}
        </span>
      ))}
    </div>

    <div className="flex flex-col items-center justify-center gap-3 border-t border-border px-6 py-14 text-center sm:px-8">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-muted">
        <Icons.creditCard className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">No invoices yet</p>
        <p className="text-xs text-muted-foreground">
          Your first invoice will show up here once you're billed.
        </p>
      </div>
    </div>
  </SettingsCard>
);
