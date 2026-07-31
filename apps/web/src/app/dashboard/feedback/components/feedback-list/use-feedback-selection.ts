"use client";

import { useState } from "react";

import type { FeedbackItem } from "../../utils/map-feedback";
import { addManyToBoard } from "../../utils/feedback-actions";

type UseFeedbackSelectionResult = {
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clear: () => void;
  bulkAddToBoard: () => void;
};

export function useFeedbackSelection(items: FeedbackItem[]): UseFeedbackSelectionResult {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  const someSelected = selected.size > 0 && !allSelected;

  const toggleSelect = (id: string): void => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = (): void => {
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(items.map((item) => item.id)));
  };

  const clear = (): void => setSelected(new Set());

  const bulkAddToBoard = (): void => {
    const selectedItems = items.filter((item) => selected.has(item.id));
    addManyToBoard(selectedItems);
    setSelected(new Set());
  };

  return {
    selected,
    allSelected,
    someSelected,
    toggleSelect,
    toggleSelectAll,
    clear,
    bulkAddToBoard,
  };
}
