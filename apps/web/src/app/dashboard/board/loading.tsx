import { PageContainer } from "../components/page-container";
import { BoardSkeleton } from "./components/board-skeleton";

const BoardLoading = (): React.ReactElement => (
  <PageContainer className="flex h-full flex-col gap-6">
    <BoardSkeleton />
  </PageContainer>
);

export default BoardLoading;
