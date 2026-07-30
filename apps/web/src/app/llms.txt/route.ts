import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

const absolute = (path: string): string => new URL(path, siteConfig.url).toString();

const body = `# ${siteConfig.name}

> ${siteConfig.description}

Echo is developer-first feedback infrastructure — collect, classify (sentiment), and act on
user feedback via a drop-in widget, REST API, and dashboard. Free tier included; Pro tier adds
usage-based volume, AI summaries, and team features.

## Docs

- [Documentation](${absolute(siteConfig.links.docs)})
- [API reference](${absolute("/docs/api")})
- [Widget install](${absolute("/docs/widget")})
- [Privacy](${absolute(siteConfig.links.privacy)})
- [Terms](${absolute(siteConfig.links.terms)})
`;

export const GET = (): Response => {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
