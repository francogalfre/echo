import { FadeIn } from "@echo/ui/components/fade-in";
import type { ReactNode } from "react";

import { PageContainer } from "../components/layout/page-container";
import { PageHeader } from "../components/layout/page-header";
import { SettingsNav } from "./components/settings-nav";

type SettingsLayoutProps = {
  children: ReactNode;
};

const SettingsLayout = ({ children }: SettingsLayoutProps): React.ReactElement => (
  <PageContainer>
    <PageHeader
      title="Settings"
      description="Manage your organization, project, and account settings."
    />
    <FadeIn delay={0.05}>
      <SettingsNav />
    </FadeIn>
    <div className="mt-8">{children}</div>
  </PageContainer>
);

export default SettingsLayout;
