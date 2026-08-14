import { createFeedback } from "./create";
import { guardSubmission } from "../../lib/rate-limit";
import { getFeedbackPageBySlug } from "../../services/feedback/page";
import type { PublicFeedbackInput } from "../../schemas";

type Failure<Status extends number> = { success: false; status: Status; error: string };

export type SubmitPublicFeedbackResult =
  | { success: true }
  | Failure<400 | 401 | 403 | 404 | 409 | 429>;

export async function submitPublicFeedback(
  input: PublicFeedbackInput,
  ip: string,
): Promise<SubmitPublicFeedbackResult> {
  if (input._hp) return { success: true };

  const page = await getFeedbackPageBySlug(input.slug);
  if (!page) {
    return {
      success: false,
      status: 404,
      error: "Feedback page not found or not published",
    };
  }

  const guard = await guardSubmission(ip, input.slug, input.content);
  if (!guard.allowed) {
    return { success: false, status: guard.status, error: guard.message };
  }

  const { email, rating, slug: _slug, _hp: _honeypot, ...rest } = input;

  return createFeedback({
    ...rest,
    organizationId: page.org.id,
    email: page.config.enableEmail ? email : undefined,
    rating: page.config.enableRating ? rating : undefined,
    source: "form",
  });
}
