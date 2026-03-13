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

  return {
    title: buildMetaTitle(`${tool.title} - Free Online Tool`),
    description: tool.shortDescription,
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
      title: `${tool.title} - DataToolbox`,
      description: tool.shortDescription,
      url: toolUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} - DataToolbox`,
      description: tool.shortDescription,
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
