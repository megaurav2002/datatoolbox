import type { Metadata } from "next";
import ToolsCategorySeoPage from "@/components/ToolsCategorySeoPage";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import {
  toolsCategoryAbsoluteUrl,
  toolsCategoryCanonical,
  toolsCategoryContent,
  type ToolsCategorySeoSlug,
} from "@/lib/tool-category-content";
import { toolsBySlug } from "@/lib/tools";

export function getToolsCategoryMetadata(slug: ToolsCategorySeoSlug): Metadata {
  const content = toolsCategoryContent[slug];
  const title = buildMetaTitle(content.metaTitle);

  return {
    title,
    description: content.metaDescription,
    alternates: {
      canonical: toolsCategoryCanonical(slug),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description: content.metaDescription,
      url: toolsCategoryAbsoluteUrl(slug),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: content.metaDescription,
    },
  };
}

export function renderToolsCategoryPage(slug: ToolsCategorySeoSlug) {
  return <ToolsCategorySeoPage slug={slug} />;
}

export function toolsCategoryStructuredData(slug: ToolsCategorySeoSlug) {
  const content = toolsCategoryContent[slug];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.title,
    description: content.metaDescription,
    url: absoluteUrl(toolsCategoryCanonical(slug)),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: content.toolSlugs
        .map((toolSlug) => toolsBySlug[toolSlug])
        .filter((tool) => Boolean(tool))
        .map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.title,
          url: absoluteUrl(`/tools/${tool.slug}`),
        })),
    },
  };
}
