import type { Metadata } from "next";

import { siteConfig } from "@/utils/site";

type CreateMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
  separator?: string;
};

export const createMetadata = (input?: CreateMetadataInput): Metadata => {
  const description = input?.description ?? siteConfig.description;
  const url = input?.path ? new URL(input.path, siteConfig.url).toString() : siteConfig.url;
  const sep = input?.separator ?? " · ";

  const title = input?.title
    ? input.absoluteTitle
      ? { absolute: input.title }
      : { default: input.title, template: `%s${sep}${siteConfig.name}` }
    : undefined;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: input?.title ?? siteConfig.title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: input?.title ?? siteConfig.title,
      description,
      creator: siteConfig.twitter,
      site: siteConfig.twitter,
    },
    ...(input?.noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: input?.path ? { canonical: input.path } : undefined,
  };
};
