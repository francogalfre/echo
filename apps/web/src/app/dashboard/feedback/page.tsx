import { PageContainer } from "../components/page-container";

const FeedbackPage = (): React.ReactElement => {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Feedback</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Your feedback will appear here.
      </p>
    </PageContainer>
  );
};

export default FeedbackPage;
