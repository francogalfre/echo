import { PageContainer } from "../components/page-container";

const SettingsPage = (): React.ReactElement => (
  <PageContainer>
    <h1 className="text-2xl font-semibold">Settings</h1>
    <p className="mt-1.5 text-sm text-muted-foreground">
      Manage your organization, project, and account settings.
    </p>
  </PageContainer>
);

export default SettingsPage;
