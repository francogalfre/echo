import { createServerTrpc } from "@/lib/trpc-server";
import type { BoardColumns } from "@echo/api/services/board";

import { BoardSection, hydrateCard } from "./board-section";

export async function BoardData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const data = await api.board.items.query();

  const initialItems: BoardColumns = {
    backlog: data.backlog.map(hydrateCard),
    in_progress: data.in_progress.map(hydrateCard),
    done: data.done.map(hydrateCard),
  };

  return <BoardSection initialItems={initialItems} />;
}
