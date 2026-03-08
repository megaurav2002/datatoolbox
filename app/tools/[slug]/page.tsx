import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
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

  return {
    title: buildMetaTitle(`${tool.title} - Free Online Tool`),
    description: tool.shortDescription,
    keywords: [
      tool.title,
      "free online tool",
      "data transformation",
      "csv tools",
      "json tools",
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
      mainEntity: tool.faq.map((item) => ({
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
        {
          "@type": "ListItem",
          position: 2,
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
