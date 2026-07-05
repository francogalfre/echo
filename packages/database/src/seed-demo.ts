import { db } from "@echo/db";
import { organization } from "@echo/db/schema/auth";
import { feedback } from "@echo/db/schema/feedback";
import { eq, or } from "drizzle-orm";

type Sentiment = "positive" | "negative" | "neutral";
type Source = "api" | "form" | "widget";

const FIRST_NAMES = [
  "Ava",
  "Liam",
  "Sofia",
  "Noah",
  "Mia",
  "Ethan",
  "Emma",
  "Lucas",
  "Olivia",
  "Mateo",
  "Isla",
  "Daniel",
  "Zoe",
  "Marco",
  "Elena",
  "Owen",
  "Priya",
  "Kenji",
  "Nina",
  "Diego",
];

const LAST_NAMES = [
  "Rossi",
  "Garcia",
  "Muller",
  "Chen",
  "Kowalski",
  "Silva",
  "Andersson",
  "Nakamura",
  "Fischer",
  "Dubois",
  "Patel",
  "Novak",
  "Costa",
  "Berg",
  "Haddad",
  "Kim",
  "Ferreira",
  "Watanabe",
  "Ivanov",
  "Santos",
];

const POSITIVE_CONTENT = [
  "The dashboard loads so much faster now, great work on performance.",
  "Love the new UI, it feels much cleaner and easier to navigate.",
  "The sentiment analysis feature is a game changer for our support team.",
  "Onboarding was smooth and took less than five minutes.",
  "Really impressed with how fast the API responds even under load.",
  "The widget integration was trivial to set up on our site.",
  "Great job on the recent feedback table, super readable now.",
  "The export feature saved us hours of manual work every week.",
  "Customer support answered our question in minutes, fantastic service.",
  "The new charts make it so much easier to spot trends at a glance.",
  "Really like how the tags help us triage feedback quickly.",
  "The API documentation is clear and the examples just work.",
  "Dark mode looks great and is easy on the eyes during late shifts.",
  "The rating breakdown is exactly what our product team needed.",
  "Switching plans was seamless, no downtime at all.",
  "The search on the feedback page is fast and accurate.",
  "Appreciate how transparent the pricing page is.",
  "The team shipped the feature we requested within a week.",
  "Everything just works out of the box, very little config needed.",
  "The mobile experience is surprisingly polished for a dashboard tool.",
];

const NEGATIVE_CONTENT = [
  "The page crashes whenever I try to filter by date range.",
  "Sentiment tags are missing for half of our recent feedback.",
  "The API key rotation flow is confusing and undocumented.",
  "Loading the feedback list takes way too long with more than 500 rows.",
  "We cannot find a way to bulk delete old feedback entries.",
  "The widget overlaps with our site header on mobile devices.",
  "Export to CSV is broken, the file comes out empty.",
  "Getting a 500 error when submitting feedback through the public API.",
  "The rating stars are not clickable on Safari.",
  "Notifications are not being sent when new feedback arrives.",
  "The onboarding flow gets stuck on the second step for us.",
  "Search results do not match what I typed at all.",
  "Dashboard numbers do not match what is shown on the feedback page.",
  "The dark mode toggle resets every time I refresh the page.",
  "Billing page shows the wrong plan after our recent upgrade.",
  "The insight generation feature times out most of the time.",
  "It is unclear how to invite a teammate to the project.",
  "The sidebar collapses unexpectedly while scrolling.",
  "We lost access to our API keys after the last update.",
  "Too many clicks required just to view a single feedback item.",
];

const NEUTRAL_CONTENT = [
  "Is there a way to change the date format on the dashboard?",
  "We are evaluating whether to move from the free tier to pro.",
  "Curious if there is a roadmap for upcoming integrations.",
  "The feedback volume this month looks about the same as last month.",
  "Does the API support pagination for large result sets?",
  "Wondering if webhooks are planned for feedback events.",
  "Our team is still getting used to the new navigation layout.",
  "How long is feedback data retained before archival?",
  "Is there a limit on how many tags can be applied per feedback item.",
  "We use the widget on two of our five projects so far.",
  "Not sure yet if the AI summary matches our expectations.",
  "The support team responded, we are waiting on a follow up.",
  "Checking if there is a Zapier integration available.",
  "The UI changed since our last visit, still exploring the new layout.",
  "Would like more detail on how sentiment scores are calculated.",
  "Considering enabling email collection on the feedback form.",
  "Just testing out the API before rolling it out to production.",
  "Not sure if the rating field is required or optional.",
  "Looking into whether tags can be renamed later.",
  "We are comparing this tool against a couple of alternatives.",
];

const TAG_POOL = [["bug"], ["feature-request"], ["ux"], ["performance"], ["billing"]];

const SOURCES: readonly Source[] = ["api", "form", "widget"];

const TOTAL_ROWS = 80;
const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_RANGE_DAYS = 90;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

function pickSentiment(): Sentiment {
  const roll = Math.random();
  if (roll < 0.6) return "positive";
  if (roll < 0.85) return "neutral";
  return "negative";
}

function contentForSentiment(sentiment: Sentiment): string {
  if (sentiment === "positive") return pick(POSITIVE_CONTENT);
  if (sentiment === "negative") return pick(NEGATIVE_CONTENT);
  return pick(NEUTRAL_CONTENT);
}

function ratingForSentiment(sentiment: Sentiment): number {
  if (sentiment === "positive") return pick([4, 4, 5, 5, 5]);
  if (sentiment === "negative") return pick([1, 1, 2, 2, 3]);
  return pick([2, 3, 3, 4]);
}

function randomAuthorName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

function emailFromAuthorName(authorName: string): string {
  const slug = authorName.toLowerCase().replace(/\s+/g, ".");
  return `${slug}@example.com`;
}

// Recency-biased offset: squaring a uniform random value skews it toward zero (recent days).
function recentBiasedCreatedAt(): Date {
  const daysAgo = Math.floor(Math.random() ** 2 * DEMO_RANGE_DAYS);
  return new Date(Date.now() - daysAgo * DAY_MS);
}

function buildDemoFeedbackRow(organizationId: string): typeof feedback.$inferInsert {
  const sentiment = pickSentiment();
  const authorName = randomAuthorName();
  const hasEmail = Math.random() < 0.3;
  const hasRating = Math.random() < 0.4;
  const hasTags = Math.random() < 0.2;

  return {
    id: crypto.randomUUID(),
    organizationId,
    authorName,
    content: contentForSentiment(sentiment),
    email: hasEmail ? emailFromAuthorName(authorName) : null,
    rating: hasRating ? ratingForSentiment(sentiment) : null,
    source: pick(SOURCES),
    sentiment,
    tags: hasTags ? pick(TAG_POOL) : null,
    createdAt: recentBiasedCreatedAt(),
  };
}

async function findTargetOrganization(
  target: string | undefined,
): Promise<typeof organization.$inferSelect | undefined> {
  if (!target) {
    return db.query.organization.findFirst();
  }

  return db.query.organization.findFirst({
    where: or(eq(organization.slug, target), eq(organization.id, target)),
  });
}

async function main(): Promise<void> {
  const target = process.argv[2];
  const org = await findTargetOrganization(target);

  if (!org) {
    console.error(
      target
        ? `No organization found matching "${target}".`
        : "No organization found in the database. Create one first.",
    );
    process.exit(1);
    return;
  }

  const rows = Array.from({ length: TOTAL_ROWS }, () => buildDemoFeedbackRow(org.id));
  await db.insert(feedback).values(rows);

  console.log(`Inserted ${rows.length} demo feedback rows for "${org.name}" (${org.id}).`);
}

main().catch((error: unknown) => {
  console.error("Failed to seed demo feedback:", error);
  process.exit(1);
});
