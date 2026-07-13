import { redirect } from "next/navigation";

type FeedbackDetailPageProps = { params: Promise<{ id: string }> };

const FeedbackDetailPage = async ({ params }: FeedbackDetailPageProps): Promise<never> => {
  const { id } = await params;
  redirect(`/dashboard/feedback?feedback=${encodeURIComponent(id)}`);
};

export default FeedbackDetailPage;
