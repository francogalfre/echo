import { Section, SectionHeading } from "../section";
import { FaqList } from "./faq-list";

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
    question: "What happens when I hit the free feedback limit?",
    answer:
      "The Free plan stores up to 300 feedback entries per project. Upgrading to Pro at $12 per month removes the storage cap, raises the daily AI limits and allows up to 5 projects.",
  },
];

export const Faq = (): React.ReactElement => {
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            title="Questions, answered"
            description="Still unsure about something? The docs go deeper on every endpoint."
          />
        </div>

        <FaqList items={faqItems} />
      </div>
    </Section>
  );
};
