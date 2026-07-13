import { Suspense } from "react";

import { PageContainer } from "../components/page-container";
import { DashboardOverviewData } from "./components/dashboard-overview-data";
import { DashboardSkeleton } from "./components/dashboard-skeleton";

const DashboardPage = (): React.ReactElement => {
  return (
    <PageContainer>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardOverviewData />
      </Suspense>
    </PageContainer>
  );
};

export default DashboardPage;
