import { createServerTrpc } from "@/lib/trpc-server";

import { FeedbackPageEditor } from "./feedback-page-editor";

export async function FeedbackPageData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const [config, recentFeedback] = await Promise.all([
    api.feedbackPage.getConfig.query(),
    api.feedbackPage.recentFeedback.query(),
  ]);

  return (
    <FeedbackPageEditor initialConfig={config} initialRecentFeedback={recentFeedback} />
  );
}
