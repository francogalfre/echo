import { PageContainer } from "../../components/page-container";
import { ApiPageSkeleton } from "./components/api-page-skeleton";

const CollectApiLoading = (): React.ReactElement => (
  <PageContainer>
    <ApiPageSkeleton />
  </PageContainer>
);

export default CollectApiLoading;
