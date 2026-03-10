import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "@/components/GuidePage";
import { guidePath, guides, guidesBySlug } from "@/lib/guides";
import { hubPath, hubsBySlug } from "@/lib/hubs";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { toolsBySlug } from "@/lib/tools";

type GuideRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuideRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guidesBySlug[slug as keyof typeof guidesBySlug];

  if (!guide) {
    return {
      title: buildMetaTitle("Guide Not Found"),
      description: "The requested guide could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = absoluteUrl(guidePath(guide.slug));

  return {
    title: buildMetaTitle(guide.title),
    description: guide.description,
    alternates: {
      canonical: guidePath(guide.slug),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${guide.title} | DataToolbox`,
      description: guide.description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | DataToolbox`,
      description: guide.description,
    },
  };
}

export default async function GuideSlugPage({ params }: GuideRouteProps) {
  const { slug } = await params;
  const guide = guidesBySlug[slug as keyof typeof guidesBySlug];

  if (!guide) {
    notFound();
  }

  const primaryTool = toolsBySlug[guide.primaryToolSlug];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    url: absoluteUrl(guidePath(guide.slug)),
    step: guide.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
    tool: primaryTool
      ? {
          "@type": "HowToTool",
          name: primaryTool.title,
          url: absoluteUrl(`/tools/${primaryTool.slug}`),
        }
      : undefined,
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Guides",
        item: absoluteUrl("/guides"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: guide.title,
        item: absoluteUrl(guidePath(guide.slug)),
      },
    ],
  };

  const guideLinksData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: guide.relatedHubSlugs.map((hubSlug, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: hubsBySlug[hubSlug].title,
      url: absoluteUrl(hubPath(hubSlug)),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideLinksData) }} />
      <GuidePage guide={guide} />
    </>
  );
}
