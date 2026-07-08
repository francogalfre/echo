"use client";

import { Tabs, TabsList, TabsTrigger } from "@echo/ui/components/tabs";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { BillingSection } from "./billing-section";
import { ProfileSection } from "./profile-section";

type SettingsTab = "account" | "billing";

function isSettingsTab(value: string | null): value is SettingsTab {
  return value === "account" || value === "billing";
}

export const SettingsTabs = (): React.ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: SettingsTab = isSettingsTab(rawTab) ? rawTab : "account";

  const setTab = useCallback(
    (value: string): void => {
      router.push(`/dashboard/settings?tab=${value}` as Route, { scroll: false });
    },
    [router],
  );

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={(value) => setTab(String(value))}>
        <TabsList variant="line">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "account" ? <ProfileSection /> : <BillingSection />}
    </div>
  );
};
