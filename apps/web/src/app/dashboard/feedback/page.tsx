import { PageContainer } from "../components/page-container";
import { DigestButton } from "./components/digest-button";
import { FeedbackTable } from "./components/feedback-table";

const FeedbackPage = (): React.ReactElement => {
  return (
    <PageContainer>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All feedback from your users in one place.
          </p>
        </div>
        <DigestButton />
      </div>
      <FeedbackTable />
    </PageContainer>
  );
};

export default FeedbackPage;
