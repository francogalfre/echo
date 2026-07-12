import { Suspense } from "react";

import { PageContainer } from "../components/page-container";
import { PageHeader } from "../components/page-header";
import { DigestButton } from "./components/digest-button";
import { FeedbackList } from "./components/feedback-list";

const FeedbackPage = (): React.ReactElement => {
  return (
    <PageContainer>
      <PageHeader
        title="Feedback"
        description="All feedback from your users in one place."
        actions={<DigestButton />}
      />
      <Suspense fallback={null}>
        <FeedbackList />
      </Suspense>
    </PageContainer>
  );
};

export default FeedbackPage;
