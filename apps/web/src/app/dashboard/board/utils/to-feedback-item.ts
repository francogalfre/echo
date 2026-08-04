import type { BoardCard } from "@echo/api/types";

import type { FeedbackItem } from "../../feedback/utils/map-feedback";

export function toFeedbackItem(card: BoardCard): FeedbackItem {
  return {
    id: card.feedbackId,
    name: card.name,
    feedback: card.content,
    email: card.email,
    rating: card.rating,
    source: card.source,
    sentiment: card.sentiment,
    tags: card.tags,
    hasInsight: card.hasInsight,
    createdAt: card.createdAt,
  };
}
