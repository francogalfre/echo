import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

export function copyFeedback(content: string): void {
  navigator.clipboard
    .writeText(content)
    .then(() => toast.success("Copied to clipboard"))
    .catch(() => toast.error("Failed to copy"));
}

type MailtoInput = {
  email: string | null;
  name: string;
  sentiment: string | null;
};

export function buildFeedbackMailto(item: MailtoInput): string | null {
  if (!item.email) return null;

  const isNegative = item.sentiment === "negative";
  const subject = isNegative
    ? "Following up on your feedback"
    : "Thank you for your feedback";
  const body = isNegative
    ? `Hi ${item.name},\n\nThank you for your feedback, and I'm sorry to hear about your ` +
      `experience. Could you share a bit more detail so we can look into it?\n\nBest,`
    : `Hi ${item.name},\n\nThank you for taking the time to share your feedback — we really ` +
      `appreciate it.\n\nBest,`;

  return `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function addToBoard(item: { id: string }): void {
  trpc.board.add
    .mutate({ feedbackId: item.id })
    .then(() => toast.success("Added to board"))
    .catch((error: unknown) => {
      const msg = error instanceof Error ? error.message : "Failed";
      toast.error(msg.includes("Already") ? "Already on board" : "Failed to add to board");
    });
}
