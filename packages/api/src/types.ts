import type { FeedbackListItem } from "./services/feedback";

type Failure<Status extends number> = { success: false; status: Status; error: string };

export type SubmitResult = { success: true } | Failure<400 | 401 | 403 | 429>;

export type ListResult =
  | { success: true; feedback: FeedbackListItem[] }
  | Failure<401 | 403 | 429>;

export type ComponentResult = { success: true; code: string } | Failure<404>;

export type RegistryResult =
  | { success: true; registry: Record<string, unknown> }
  | Failure<404>;

export type UploadLogoResult =
  | { success: true; url: string }
  | Failure<400 | 403 | 500 | 502>;

export type InsightResult =
  | { success: true; insight: string; cached: boolean }
  | (Failure<403 | 404 | 502> & { upgrade: boolean });
