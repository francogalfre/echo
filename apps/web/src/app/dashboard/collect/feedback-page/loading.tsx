import { CanvasSkeleton } from "./components/canvas-skeleton";

const FeedbackPageLoading = (): React.ReactElement => (
  <div className="h-full overflow-x-hidden overflow-y-auto">
    <CanvasSkeleton />
  </div>
);

export default FeedbackPageLoading;
