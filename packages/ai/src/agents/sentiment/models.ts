import { fallbackModel } from "../../provider";

export const sentimentModel = fallbackModel([
  "google/gemini-2.0-flash-exp:free",
  "google/gemini-2.5-flash-lite",
]);
