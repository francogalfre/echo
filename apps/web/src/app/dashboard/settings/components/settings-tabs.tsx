"use client";

import { Tabs, TabsList, TabsTrigger } from "@echo/ui/components/tabs";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { AccountSection } from "./account-section";
import { BillingSection } from "./billing-section";
import { TeamSection } from "./team-section";

type SettingsTab = "account" | "team" | "billing";

const SETTINGS_TAB_VALUES = ["account", "team", "billing"] as const;

function renderTab(tab: SettingsTab): React.ReactElement {
  if (tab === "team") return <TeamSection />;
  if (tab === "billing") return <BillingSection />;
  return <AccountSection />;
}

export const SettingsTabs = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringLiteral(SETTINGS_TAB_VALUES)
      .withDefault("account")
      .withOptions({ history: "push", scroll: false }),
  );

  return (
    <div className="flex w-full flex-col gap-8">
      <Tabs
        value={activeTab}
        onValueChange={(value) => void setActiveTab(value as SettingsTab)}
      >
        <TabsList variant="line">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
      </Tabs>

      {renderTab(activeTab)}
    </div>
  );
};
