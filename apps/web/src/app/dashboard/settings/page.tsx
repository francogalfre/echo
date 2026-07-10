import { FadeIn } from "@echo/ui/components/fade-in";
import { Suspense } from "react";

import { PageContainer } from "../components/page-container";
import { PageHeader } from "../components/page-header";
import { SettingsTabs } from "./components/settings-tabs";

const SettingsPage = (): React.ReactElement => (
  <PageContainer>
    <PageHeader
      title="Settings"
      description="Manage your organization, project, and account settings."
    />
    <FadeIn delay={0.05}>
      <Suspense fallback={null}>
        <SettingsTabs />
      </Suspense>
    </FadeIn>
  </PageContainer>
);

export default SettingsPage;
