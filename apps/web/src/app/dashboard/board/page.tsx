import { Suspense } from "react";

import { PageContainer } from "../components/layout/page-container";
import { BoardData } from "./components/board-data";
import { BoardSkeleton } from "./components/board-skeleton";

const BoardPage = (): React.ReactElement => (
  <PageContainer className="flex h-full flex-col gap-6">
    <Suspense fallback={<BoardSkeleton />}>
      <BoardData />
    </Suspense>
  </PageContainer>
);

export default BoardPage;
