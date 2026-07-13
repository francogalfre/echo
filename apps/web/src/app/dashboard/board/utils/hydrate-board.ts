import type { BoardCard, BoardColumns } from "@echo/api/services/board";

type SerializedCard = Omit<BoardCard, "createdAt"> & { createdAt: string | Date };

export type SerializedColumns = {
  backlog: SerializedCard[];
  in_progress: SerializedCard[];
  done: SerializedCard[];
};

function hydrateCard(card: SerializedCard): BoardCard {
  return { ...card, createdAt: new Date(card.createdAt) };
}

export function hydrateBoardColumns(data: SerializedColumns): BoardColumns {
  return {
    backlog: data.backlog.map(hydrateCard),
    in_progress: data.in_progress.map(hydrateCard),
    done: data.done.map(hydrateCard),
  };
}
