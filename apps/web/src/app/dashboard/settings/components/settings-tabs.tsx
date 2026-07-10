"use client";

import { Tabs, TabsList, TabsTrigger } from "@echo/ui/components/tabs";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { BillingSection } from "./billing-section";
import { ProfileSection } from "./profile-section";

type SettingsTab = "account" | "billing";

const SETTINGS_TAB_VALUES = ["account", "billing"] as const;

export const SettingsTabs = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringLiteral(SETTINGS_TAB_VALUES)
      .withDefault("account")
      .withOptions({ history: "push", scroll: false }),
  );

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => void setActiveTab(value as SettingsTab)}
      >
        <TabsList variant="line">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "account" ? <ProfileSection /> : <BillingSection />}
    </div>
  );
};
