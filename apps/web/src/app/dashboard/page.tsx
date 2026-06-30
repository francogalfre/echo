import { PageContainer } from "./components/page-container";
import { DashboardClient } from "./components/dashboard-client";

const DashboardPage = (): React.ReactElement => {
  return (
    <PageContainer>
      <DashboardClient />
    </PageContainer>
  );
};

export default DashboardPage;
