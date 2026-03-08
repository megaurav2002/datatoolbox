import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getSiteUrl } from "@/lib/seo";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories.map((category) => ({
      url: `${base}/tools/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...tools.map((tool) => ({
      url: `${base}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
