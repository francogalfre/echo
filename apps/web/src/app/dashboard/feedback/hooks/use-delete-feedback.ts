"use client";

import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";

import type { FeedbackItem } from "../utils/map-feedback";

type UseDeleteFeedbackResult = {
  pendingItem: FeedbackItem | null;
  requestDelete: (item: FeedbackItem) => void;
  cancelDelete: () => void;
  confirmDelete: () => Promise<void>;
};

export function useDeleteFeedback(
  removeItems: (ids: readonly string[]) => void,
): UseDeleteFeedbackResult {
  const [pendingItem, setPendingItem] = useState<FeedbackItem | null>(null);

  const requestDelete = (item: FeedbackItem): void => setPendingItem(item);
  const cancelDelete = (): void => setPendingItem(null);

  const confirmDelete = async (): Promise<void> => {
    if (!pendingItem) return;
    const id = pendingItem.id;
    setPendingItem(null);

    try {
      await trpc.feedback.delete.mutate({ ids: [id] });
      toast.success("Deleted feedback");
      removeItems([id]);
    } catch {
      toast.error("Failed to delete feedback");
    }
  };

  return { pendingItem, requestDelete, cancelDelete, confirmDelete };
}
