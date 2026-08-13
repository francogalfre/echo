import { Icons } from "@echo/ui/components/icons";

import { Section, SectionHeading } from "../section";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: readonly FaqItem[] = [
  {
    question: "How long does it take to set up Echo?",
    answer:
      "Minutes. Create a project, copy your API keys, and either run one shadcn command to install the widget or POST to the REST API from your backend. There is no schema to design and nothing to deploy.",
  },
  {
    question: "Do my users need an account to leave feedback?",
    answer:
      "No. The widget, the hosted feedback page and the API all accept anonymous submissions. A name is optional, so you can ask for as little as a rating and a comment.",
  },
  {
    question: "How does Echo classify feedback?",
    answer:
      "Each submission is scored for sentiment as positive, neutral or negative when it arrives, and tagged with the source it came from — widget, form or api. You can filter the inbox by both without labelling anything by hand.",
  },
  {
    question: "Can I collect feedback from my own backend instead of the widget?",
    answer:
      "Yes. Echo exposes a small REST API: POST /api/feedback to create an entry and GET /api/feedback to read entries back, both authenticated with a project secret key. Publishable keys exist for browser contexts.",
  },
  {
    question: "What happens when I hit the free feedback limit?",
    answer:
      "The Free plan stores up to 300 feedback entries per project. Upgrading to Pro at $12 per month removes the storage cap, raises the daily AI limits and allows up to 5 projects.",
  },
  {
    question: "Can I use Echo for more than one product?",
    answer:
      "Yes. An organization can hold multiple projects, each with its own API keys, widget, inbox and board. Free includes one project and Pro includes five.",
  },
  {
    question: "Can I invite my team?",
    answer:
      "Yes. Invite teammates to your organization by email and they get access to the same inbox, summaries and board. Billing stays at the organization level.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Manage or cancel your subscription yourself from the billing page in the dashboard — no email required, and your data stays accessible on the Free plan.",
  },
];

export const Faq = (): React.ReactElement => {
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          title="Questions, answered"
          description="Still unsure about something? The docs go deeper on every endpoint."
        />

        <div className="divide-y divide-border border-y border-border">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {item.question}
                <Icons.chevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
};
