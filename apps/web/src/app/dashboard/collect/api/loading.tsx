import { PageContainer } from "../../components/layout/page-container";
import { ApiPageSkeleton } from "./components/api-page-skeleton";

const CollectApiLoading = (): React.ReactElement => (
  <PageContainer>
    <ApiPageSkeleton />
  </PageContainer>
);

export default CollectApiLoading;
