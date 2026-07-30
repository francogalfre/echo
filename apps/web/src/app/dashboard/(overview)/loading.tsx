import { PageContainer } from "../components/layout/page-container";
import { DashboardSkeleton } from "./components/dashboard-skeleton";

const DashboardLoading = (): React.ReactElement => (
  <PageContainer>
    <DashboardSkeleton />
  </PageContainer>
);

export default DashboardLoading;
