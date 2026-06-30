"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

export type FeedbackItem = {
  id: string;
  name: string;
  feedback: string;
  email: string | null;
  rating: number | null;
  source: string;
  sentiment: string | null;
  tags: string[] | null;
  hasInsight: boolean;
  createdAt: Date;
};

type State =
  | { status: "loading" }
  | { status: "ready"; items: FeedbackItem[] }
  | { status: "error" };

export function useFeedback(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    trpc.feedback.list
      .query()
      .then((items) =>
        setState({
          status: "ready",
          items: items.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
        }),
      )
      .catch(() => {
        toast.error("Failed to load feedback");
        setState({ status: "error" });
      });
  }, []);

  return state;
}
