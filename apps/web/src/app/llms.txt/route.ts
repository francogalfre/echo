import { siteConfig } from "@/utils/site";

const absolute = (path: string): string => new URL(path, siteConfig.url).toString();

const body = `# Echo

> Echo is developer-first user feedback infrastructure. It provides a drop-in widget, a REST
> API and a hosted feedback page for collecting feedback, plus a dashboard that classifies
> sentiment, generates AI summaries and turns recurring themes into a board.

## What Echo does

- Collect feedback through three channels: a shadcn-installable widget, a REST API, and a hosted feedback page.
- Classify every submission by sentiment (positive, neutral, negative) and by source (widget, form, api).
- Generate recurring AI summaries of what changed and which complaints are trending.
- Answer questions about your feedback in natural language from the dashboard.
- Organize the feedback worth acting on into a team board.

## How it is structured

- Organizations hold billing and team members.
- Projects belong to an organization. Each project has its own API keys, widget, inbox and board.
- Feedback belongs to a project and records the author, content, rating, sentiment and source.

## Integration

Create feedback from a backend:

    curl -X POST <server-url>/api/feedback \\
      -H "Authorization: Bearer echo_sk_your_secret_key" \\
      -H "Content-Type: application/json" \\
      -d '{"name": "Jane Smith", "feedback": "Love the product!"}'

List feedback:

    curl <server-url>/api/feedback \\
      -H "Authorization: Bearer echo_sk_your_secret_key"

Install the widget:

    npx shadcn@latest add "<server-url>/api/widget/<project-slug>/registry"

Secret keys (echo_sk_) are for server-side use. Publishable keys are for browser contexts.

## Pricing

- Free — $0/month: 1 project, 300 stored feedback, 3 AI insights/day, 1 AI summary/week, 5 AI chats/day, widget + REST API + hosted page.
- Pro — $12/month: unlimited stored feedback, 5 projects, 50 AI insights/day, 10 AI summaries/day, 100 AI chats/day, no "Powered by Echo" branding.

No credit card is required for the Free plan. Subscriptions can be cancelled from the billing page.

## Links

- Home: ${siteConfig.url}
- Documentation: ${absolute("/docs")}
- Getting started: ${absolute("/docs/getting-started")}
- REST API reference: ${absolute("/docs/api")}
- Widget reference: ${absolute("/docs/widget")}
- Privacy policy: ${absolute("/legal/privacy")}
- Terms of service: ${absolute("/legal/terms")}
`;

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
