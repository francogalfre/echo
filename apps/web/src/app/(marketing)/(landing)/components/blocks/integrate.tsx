import { env } from "@echo/env/web";
import { CodeBlock } from "@echo/ui/components/code-block";
import { Icons } from "@echo/ui/components/icons";

import { Section, SectionHeading } from "../section";

const channels = [
  {
    title: "Widget",
    description: "One command. A floating button, wired to your publishable key.",
    icon: "star",
  },
  {
    title: "REST API",
    description: "POST feedback from your backend with a secret key.",
    icon: "externalLink",
  },
  {
    title: "Hosted page",
    description: "Share a link. Feedback lands in the same inbox.",
    icon: "message",
  },
] as const;

export const Integrate = (): React.ReactElement => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  const tabs = [
    {
      label: "Widget",
      language: "bash",
      code: `npx shadcn@latest add "${serverUrl}/api/widget/your-project/registry"`,
    },
    {
      label: "cURL",
      language: "bash",
      code: `curl -X POST ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer echo_sk_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Smith", "feedback": "Love the product!"}'`,
    },
    {
      label: "JavaScript",
      language: "js",
      code: `await fetch("${serverUrl}/api/feedback", {
  method: "POST",
  headers: {
    "Authorization": "Bearer echo_sk_your_secret_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Smith",
    feedback: "Love the product!",
  }),
})`,
    },
  ];

  return (
    <Section id="integrate" className="border-y border-border bg-secondary/40">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            title="Three ways in. One paste each."
            description="No SDK to learn and no schema to design. Pick the channel that fits the surface, and feedback shows up in the same inbox."
          />

          <ul className="mt-8 space-y-4">
            {channels.map((channel) => {
              const Icon = Icons[channel.icon];

              return (
                <li key={channel.title} className="flex gap-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{channel.title}</p>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0">
          <CodeBlock tabs={tabs} />
        </div>
      </div>
    </Section>
  );
};
