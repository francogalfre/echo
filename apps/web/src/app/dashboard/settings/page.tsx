import { FadeIn } from "@echo/ui/components/fade-in";
import { Suspense } from "react";

import { PageContainer } from "../components/page-container";
import { SettingsTabs } from "./components/settings-tabs";

const SettingsPage = (): React.ReactElement => (
  <PageContainer>
    <FadeIn>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your organization, project, and account settings.
        </p>
      </header>
    </FadeIn>
    <FadeIn delay={0.05}>
      <Suspense fallback={null}>
        <SettingsTabs />
      </Suspense>
    </FadeIn>
  </PageContainer>
);

export default SettingsPage;
