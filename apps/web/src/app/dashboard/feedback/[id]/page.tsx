type FeedbackDetailPageProps = { params: Promise<{ id: string }> };

const FeedbackDetailPage = async ({
  params,
}: FeedbackDetailPageProps): Promise<React.ReactElement> => {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Feedback #{id}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Feedback detail view.</p>
    </div>
  );
};

export default FeedbackDetailPage;
