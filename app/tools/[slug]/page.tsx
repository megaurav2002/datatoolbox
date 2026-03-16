import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import { generateToolFAQs } from "@/lib/generateToolFAQs";
import { relatedHubsForTool } from "@/lib/hubs";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { toolsCategoryCanonical } from "@/lib/tool-category-content";
import { tools, toolsBySlug } from "@/lib/tools";
import ToolClient from "./ToolClient";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsBySlug[slug];

  if (!tool) {
    return {
      title: buildMetaTitle("Tool Not Found"),
      description: "The requested tool was not found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const toolUrl = absoluteUrl(`/tools/${tool.slug}`);
  const categoryKeywords = tool.categories.map((category) => category.replace(/-/g, " "));
  const metadataOverrides: Partial<Record<string, { title: string; description: string }>> = {
    "json-to-csv": {
      title: "JSON to CSV Converter - Free Online Tool",
      description:
        "Convert a JSON array of objects into spreadsheet-ready CSV instantly. Free online JSON to CSV converter for Excel, Google Sheets, and data exports.",
    },
    "regex-tester": {
      title: "Regex Tester + Generator - Free Online Tool",
      description:
        "Test regex patterns online and generate regex from plain-English prompts. Free regex tester and regex builder with match count, flags, and capture groups.",
    },
    "json-diff-checker": {
      title: "JSON Diff Checker - Compare Two JSON Files Online",
      description:
        "Compare two JSON documents online and highlight added, removed, and changed values instantly. Free browser-based JSON diff checker for APIs, configs, and payload debugging.",
    },
  };
  const metadataTitle = metadataOverrides[tool.slug]?.title ?? `${tool.title} - Free Online Tool`;
  const metadataDescription = metadataOverrides[tool.slug]?.description ?? tool.shortDescription;

  return {
    title: buildMetaTitle(metadataTitle),
    description: metadataDescription,
    keywords: [
      tool.title,
      "free online tool",
      "data transformation",
      "csv tools",
      "json tools",
      ...tool.tags,
      ...categoryKeywords,
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${metadataTitle} - DataToolbox`,
      description: metadataDescription,
      url: toolUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${metadataTitle} - DataToolbox`,
      description: metadataDescription,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = toolsBySlug[slug];

  if (!tool) {
    notFound();
  }

  const toolUrl = absoluteUrl(`/tools/${tool.slug}`);
  const faqs = generateToolFAQs(tool);
  const relatedHubs = relatedHubsForTool(tool.slug);
  const primaryHub = relatedHubs[0];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.title,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      url: toolUrl,
      description: tool.shortDescription,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Tools",
          item: absoluteUrl("/tools"),
        },
        ...(primaryHub
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: primaryHub.title,
                item: absoluteUrl(toolsCategoryCanonical(primaryHub.slug)),
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: primaryHub ? 3 : 2,
          name: tool.title,
          item: toolUrl,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToolLayout tool={tool}>
        <ToolClient tool={tool} />
      </ToolLayout>
    </>
  );
}
