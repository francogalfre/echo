import { Icons } from "@echo/ui/components/icons";

import { SettingsCard } from "./settings-card";

export const BillingHistory = (): React.ReactElement => (
  <SettingsCard>
    <h3 className="text-sm font-semibold text-foreground">Billing history</h3>
    <p className="mt-0.5 text-xs text-muted-foreground">
      Your invoices and receipts will appear here.
    </p>

    <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Icons.creditCard className="size-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No invoices yet</p>
    </div>
  </SettingsCard>
);
