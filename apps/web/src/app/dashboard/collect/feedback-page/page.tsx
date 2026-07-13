import { Suspense } from "react";

import { CanvasSkeleton } from "./components/canvas-skeleton";
import { FeedbackPageData } from "./components/feedback-page-data";

const FeedbackPage = (): React.ReactElement => (
  <div className="h-full overflow-x-hidden overflow-y-auto">
    <Suspense fallback={<CanvasSkeleton />}>
      <FeedbackPageData />
    </Suspense>
  </div>
);

export default FeedbackPage;
