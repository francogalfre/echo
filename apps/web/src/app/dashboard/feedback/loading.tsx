import { Skeleton } from "@echo/ui/components/skeleton";

import { PageContainer } from "../components/layout/page-container";
import { PageHeader } from "../components/layout/page-header";
import { FeedbackListSkeleton } from "./components/feedback-list-skeleton";

const FeedbackLoading = (): React.ReactElement => (
  <PageContainer>
    <PageHeader
      title="Feedback"
      description="All feedback from your users in one place."
      actions={<Skeleton className="h-9 w-[130px] rounded-lg" />}
    />
    <FeedbackListSkeleton />
  </PageContainer>
);

export default FeedbackLoading;
