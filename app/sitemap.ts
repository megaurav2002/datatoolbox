import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { guides } from "@/lib/guides";
import { hubs, hubPath } from "@/lib/hubs";
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
    {
      url: `${base}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...hubs.map((hub) => ({
      url: `${base}${hubPath(hub.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.87,
    })),
    ...categories.map((category) => ({
      url: `${base}/tools/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    })),
    ...guides.map((guide) => ({
      url: `${base}/guides/${guide.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.84,
    })),
    ...tools.map((tool) => ({
      url: `${base}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
