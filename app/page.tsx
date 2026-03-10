import type { Metadata } from "next";
import HomeToolExplorer from "@/components/HomeToolExplorer";
import { categories } from "@/lib/categories";
import { guides } from "@/lib/guides";
import { hubs } from "@/lib/hubs";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { toolsBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: buildMetaTitle("Free Online Data Tools"),
  description:
    "Free online CSV, JSON, spreadsheet, text, and developer tools to clean and transform data quickly.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Free Online Data Tools | DataToolbox",
    description:
      "Free online CSV, JSON, spreadsheet, text, and developer tools to clean and transform data quickly.",
    url: absoluteUrl("/"),
    type: "website",
  },
};

const popularSlugs = [
  "csv-to-json",
  "csv-to-sql",
  "json-formatter",
  "csv-cleaner",
  "json-flatten-to-csv",
  "json-validator",
  "remove-duplicate-lines",
  "extract-emails",
  "extract-numbers",
] as const;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DataToolbox",
  url: absoluteUrl("/"),
  description:
    "Free online CSV, JSON, spreadsheet, text, and developer tools to clean and transform data quickly.",
};

export default function HomePage() {
  const popularTools = popularSlugs
    .map((slug) => toolsBySlug[slug])
    .filter((tool) => Boolean(tool));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeToolExplorer
        categories={categories}
        hubs={hubs}
        guides={guides}
        popularTools={popularTools}
      />
    </>
  );
}
