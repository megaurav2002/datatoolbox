import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import { guides } from "@/lib/guides";
import { hubs } from "@/lib/hubs";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";
import { recentTools, tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: buildMetaTitle("DataToolbox Tools Directory"),
  description:
    "Explore DataToolbox tools for CSV, JSON, data cleaning, and developer workflows with practical examples and guides.",
  alternates: { canonical: "/tools" },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "DataToolbox Tools Directory",
    description:
      "Explore DataToolbox tools for CSV, JSON, data cleaning, and developer workflows with practical examples and guides.",
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
        <p className="mt-3 max-w-4xl text-slate-700">
          DataToolbox is a growing library of fast, browser-based utilities for common data tasks. You can convert
          CSV and JSON formats, clean inconsistent exports before import, and run developer-focused checks like
          encoding, decoding, hashing, regex testing, and SQL formatting. These tools are built for analysts,
          developers, operations teams, and spreadsheet-heavy workflows that need quick, reliable output without local
          setup. Every page includes practical examples, step-by-step instructions, and links to related tools and
          guides so you can move from raw input to production-ready data faster. Instead of acting like a simple link
          directory, this page is a starting point for complete workflows: discover the right category, run the
          transformation, verify output with adjacent validators, and follow problem-based guides when you need a
          repeatable process. Whether you are preparing CSV imports, inspecting JSON payloads, or debugging production
          issues, the goal is to reduce manual work and help you ship cleaner data with less friction.
        </p>

        <section id="category-hubs" className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">Browse category hubs</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                <Link href="/tools/csv-tools" className="underline">
                  CSV Tools
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                Use CSV tools to clean spreadsheet exports, validate row structure, map column names, and convert data
                into JSON or SQL before uploading to applications and databases. This category is strongest when you
                need import-ready files, predictable headers, and quick fixes for messy operational exports from
                business systems.
              </p>
            </li>
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                <Link href="/tools/json-tools" className="underline">
                  JSON Tools
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                JSON tools help you validate syntax, format payloads, minify output, flatten nested structures, and
                convert API responses into CSV for reporting and analysis workflows. It is aimed at engineers and data
                teams working with logs, webhooks, and API responses that require fast inspection before data is pushed
                into applications, reports, or automated pipelines.
              </p>
            </li>
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                <Link href="/tools/data-cleaning-tools" className="underline">
                  Data Cleaning Tools
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                Data cleaning pages focus on practical pre-processing tasks like deduplicating rows, normalizing
                values, splitting oversized files, and preparing import-ready datasets with fewer downstream errors.
                These tools are useful when upstream exports are inconsistent and your team needs reliable, repeatable
                cleanup steps before loading data into CRMs, SQL databases, or reporting systems.
              </p>
            </li>
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                <Link href="/tools/developer-data-tools" className="underline">
                  Developer Data Tools
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                Developer data tools support day-to-day engineering tasks including JWT inspection, Base64 and URL
                encoding, hash generation, timestamp conversion, and SQL formatting for faster debugging. They are
                designed for backend, frontend, and QA workflows where small transformations are frequent, context
                switching is costly, and you need deterministic output directly in the browser.
              </p>
            </li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
            {hubs.map((hub) => (
              <li key={hub.slug}>
                <Link href={`/tools/${hub.slug}`} className="underline">
                  More on {hub.title}
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
