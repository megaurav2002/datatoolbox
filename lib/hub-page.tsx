import type { Metadata } from "next";
import HubPage from "@/components/HubPage";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { hubPath, hubsBySlug, hubTools, type HubSlug } from "@/lib/hubs";

export function getHubMetadata(slug: HubSlug): Metadata {
  const hub = hubsBySlug[slug];
  const title = buildMetaTitle(hub.title);

  return {
    title,
    description: hub.description,
    alternates: {
      canonical: hubPath(slug),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description: hub.description,
      url: absoluteUrl(hubPath(slug)),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: hub.description,
    },
  };
}

export function renderHubPage(slug: HubSlug) {
  const hub = hubsBySlug[slug];
  return <HubPage hub={hub} tools={hubTools(slug)} />;
}

export function hubStructuredData(slug: HubSlug) {
  const hub = hubsBySlug[slug];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    description: hub.description,
    url: absoluteUrl(hubPath(slug)),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: hubTools(slug).map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title,
        url: absoluteUrl(`/tools/${tool.slug}`),
      })),
    },
  };
}
