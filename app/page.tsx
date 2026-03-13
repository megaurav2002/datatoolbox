import type { Metadata } from "next";
import HomeToolExplorer from "@/components/HomeToolExplorer";
import { categories } from "@/lib/categories";
import { guides } from "@/lib/guides";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { toolsBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: buildMetaTitle("Free Online Data Tools - JSON, CSV, SQL Utilities"),
  description:
    "Free browser-based tools to clean, convert, validate, and transform JSON, CSV, SQL, and text data instantly. No uploads or signup required.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Free Online Data Tools - JSON, CSV, SQL Utilities | DataToolbox",
    description:
      "Free browser-based tools to clean, convert, validate, and transform JSON, CSV, SQL, and text data instantly. No uploads or signup required.",
    url: absoluteUrl("/"),
    type: "website",
  },
};

const popularSlugs = [
  "json-formatter",
  "json-validator",
  "remove-duplicate-lines",
  "base64-encoder",
  "base64-decoder",
  "uuid-generator",
  "regex-tester",
  "timestamp-converter",
] as const;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DataToolbox",
  url: absoluteUrl("/"),
  description:
    "Free browser-based tools to clean, convert, validate, and transform JSON, CSV, SQL, and text data instantly.",
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
        guides={guides}
        popularTools={popularTools}
      />
    </>
  );
}
