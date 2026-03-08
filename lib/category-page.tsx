import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categoriesBySlug } from "@/lib/categories";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { toolsByCategory } from "@/lib/tools";
import type { ToolCategorySlug } from "@/lib/types";

export function getCategoryMetadata(slug: ToolCategorySlug): Metadata {
  const category = categoriesBySlug[slug];
  const title = buildMetaTitle(category.title);

  return {
    title,
    description: category.description,
    alternates: {
      canonical: `/tools/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description: category.description,
      url: absoluteUrl(`/tools/${slug}`),
      type: "website",
    },
  };
}

export function renderCategoryPage(slug: ToolCategorySlug) {
  const category = categoriesBySlug[slug];
  return <CategoryPage category={category} tools={toolsByCategory(slug)} />;
}
