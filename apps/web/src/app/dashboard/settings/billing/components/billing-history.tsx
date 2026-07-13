import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";

import { SettingsCard } from "../../components/settings-card";

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

    <div className="border-t border-border">
      <EmptyState
        icon={<Icons.creditCard />}
        title="No invoices yet"
        description="Your first invoice will show up here once you're billed."
      />
    </div>
  </SettingsCard>
);
