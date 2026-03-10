import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import { guides } from "@/lib/guides";
import { hubs, hubPath } from "@/lib/hubs";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { recentTools, tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: buildMetaTitle("DataToolbox Tools Directory"),
  description: "Browse free data manipulation tools for CSV, JSON, text, spreadsheet, and developer workflows.",
  alternates: { canonical: "/tools" },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "DataToolbox Tools Directory",
    description:
      "Browse free data manipulation tools for CSV, JSON, text, spreadsheet, and developer workflows.",
    url: absoluteUrl("/tools"),
    type: "website",
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DataToolbox Tools Directory",
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(`/tools/${tool.slug}`),
    name: tool.title,
  })),
};

export default function ToolsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">DataToolbox Tools</h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Explore high-traffic data tools with examples, instructions, and related links.
        </p>

        <section id="category-hubs" className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">Browse category hubs</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
            {hubs.map((hub) => (
              <li key={hub.slug}>
                <Link href={hubPath(hub.slug)} className="underline">
                  {hub.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Link href={`/tools/${tool.slug}`} className="text-lg font-semibold text-slate-900 underline">
                {tool.title}
              </Link>
              <p className="mt-2 text-sm text-slate-700">{tool.shortDescription}</p>
            </li>
          ))}
        </ul>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Recently added</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools(6).map((tool) => (
              <li key={tool.slug}>
                <Link href={`/tools/${tool.slug}`} className="text-sm text-slate-700 underline">
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Problem-based guides</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`} className="text-sm text-slate-700 underline">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Legacy category routes</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/tools/${category.slug}`} className="underline">
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
