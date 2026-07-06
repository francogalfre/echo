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
    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 3;

    const load = (): void => {
      trpc.feedback.list
        .query()
        .then((items) => {
          if (cancelled) return;
          setState({
            status: "ready",
            items: items.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
          });
        })
        .catch(() => {
          if (cancelled) return;
          attempt += 1;
          if (attempt < maxAttempts) {
            setTimeout(load, attempt * 800);
          } else {
            toast.error("Failed to load feedback");
            setState({ status: "error" });
          }
        });
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
