import { Suspense } from "react";

import { PageContainer } from "../../components/page-container";
import { ApiData } from "./components/api-data";
import { ApiPageSkeleton } from "./components/api-page-skeleton";

const CollectApiPage = (): React.ReactElement => (
  <PageContainer>
    <Suspense fallback={<ApiPageSkeleton />}>
      <ApiData />
    </Suspense>
  </PageContainer>
);

export default CollectApiPage;
