import { PageContainer } from "../components/page-container";
import { FeedbackTable } from "./components/feedback-table";

const FeedbackPage = (): React.ReactElement => {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All feedback from your users in one place.
        </p>
      </div>
      <FeedbackTable />
    </PageContainer>
  );
};

export default FeedbackPage;
