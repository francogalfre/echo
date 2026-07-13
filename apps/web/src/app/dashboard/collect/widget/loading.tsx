import { PageContainer } from "../../components/page-container";
import { WidgetPageSkeleton } from "./components/widget-page-skeleton";

const WidgetLoading = (): React.ReactElement => (
  <PageContainer>
    <WidgetPageSkeleton />
  </PageContainer>
);

export default WidgetLoading;
