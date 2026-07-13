import { createServerTrpc } from "@/lib/trpc-server";

import { hydrateBoardColumns } from "../utils/hydrate-board";
import { BoardSection } from "./board-section";

export async function BoardData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const data = await api.board.items.query();

  return <BoardSection initialItems={hydrateBoardColumns(data)} />;
}
