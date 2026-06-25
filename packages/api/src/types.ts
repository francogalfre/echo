import type { FeedbackListItem } from "./services/feedback";

type Failure<Status extends number> = { success: false; status: Status; error: string };

export type SubmitResult = { success: true } | Failure<400 | 401 | 403>;

export type ListResult = { success: true; feedback: FeedbackListItem[] } | Failure<401>;

export type ComponentResult = { success: true; code: string } | Failure<404>;

export type RegistryResult =
  | { success: true; registry: Record<string, unknown> }
  | Failure<404>;

export type UploadLogoResult =
  | { success: true; url: string }
  | Failure<400 | 403 | 500 | 502>;
