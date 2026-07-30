import { Suspense } from "react";

import { PageContainer } from "../../components/layout/page-container";
import { WidgetData } from "./components/widget-data";
import { WidgetPageSkeleton } from "./components/widget-page-skeleton";

const WidgetPage = (): React.ReactElement => (
  <PageContainer>
    <Suspense fallback={<WidgetPageSkeleton />}>
      <WidgetData />
    </Suspense>
  </PageContainer>
);

export default WidgetPage;
