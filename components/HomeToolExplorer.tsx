"use client";

import Link from "next/link";
import ToolSearch from "@/components/ToolSearch";
import type { CategoryDefinition } from "@/lib/categories";
import type { GuideDefinition } from "@/lib/guides";
import type { ToolDefinition } from "@/lib/types";

type HomeToolExplorerProps = {
  categories: CategoryDefinition[];
  guides: GuideDefinition[];
  popularTools: ToolDefinition[];
  latestTools: ToolDefinition[];
};

export default function HomeToolExplorer({
  categories,
  guides,
  popularTools,
  latestTools,
}: HomeToolExplorerProps) {
  const categoryCards = [
    {
      title: "JSON Tools",
      href: "/tools/json-tools",
      description: "Format, validate, flatten, and convert JSON structures for APIs and reporting.",
    },
    {
      title: "CSV Tools",
      href: "/tools/csv-tools",
      description: "Clean, transform, and convert CSV files for spreadsheets and database imports.",
    },
    {
      title: "Developer Tools",
      href: "/tools/developer-data-tools",
      description: "Utilities for encoding, parsing, hashing, timestamps, SQL, and payload debugging.",
    },
    {
      title: "Text Tools",
      href: "/tools/text-tools",
      description: "Remove duplicates, sort lines, and extract values from plain text quickly.",
    },
  ];

  const guideBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide]));
  const guideHighlights = [
    guideBySlug["how-to-convert-json-to-csv"],
    guideBySlug["how-to-flatten-json"],
    guideBySlug["how-to-clean-csv-data"],
    {
      slug: "remove-duplicate-lines-workflow",
      title: "How to Remove Duplicate Lines",
      description: "Use Remove Duplicate Lines to clean repeated values while keeping original order.",
    },
    {
      slug: "decode-base64-workflow",
      title: "How to Decode Base64",
      description: "Decode encoded payload strings to readable text for debugging and verification.",
    },
    {
      slug: "generate-uuid-workflow",
      title: "How to Generate UUID Values",
      description: "Generate UUID v4 identifiers for test data, seeding, and integration workflows.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Free Online Data Tools for Developers and Analysts
        </h1>
        <p className="mt-4 max-w-3xl text-slate-700">
          Clean, convert, validate, and transform JSON, CSV, SQL, and text instantly in your browser.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          All tools run locally in your browser - no uploads, no accounts, and no data storage.
        </p>
        <div className="mt-6 space-y-3">
          <Link
            href="/tools"
            className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse Tools
          </Link>
          <p className="text-sm font-medium text-slate-700">
            Search tools
          </p>
          <ToolSearch />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Free browser-based tools for working with data</h2>
        <p className="mt-3 text-slate-700">
          DataToolbox provides practical utilities for common data problems that come up in day-to-day engineering,
          analytics, and spreadsheet workflows. Instead of opening heavy desktop software or writing one-off scripts,
          you can format JSON, clean CSV exports, validate structured input, parse URLs, decode payloads, and convert
          between common formats in seconds.
        </p>
        <p className="mt-3 text-slate-700">
          The platform is built for developers, analysts, QA engineers, and operations teams who need reliable output
          with minimal friction. Supported formats include JSON, CSV, SQL, timestamps, encoded strings, and plain
          text. Every tool is designed to run directly in the browser, so sensitive data stays on your device while
          you clean, transform, and verify content before sharing or importing. Each page includes practical examples
          and related links so first-time visitors can quickly find the right tool for a specific task.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Why use DataToolbox</h2>
        <ul className="mt-4 grid gap-3 text-slate-700 sm:grid-cols-2">
          <li className="rounded-lg border border-slate-200 px-3 py-2">Runs entirely in your browser</li>
          <li className="rounded-lg border border-slate-200 px-3 py-2">No login or signup required</li>
          <li className="rounded-lg border border-slate-200 px-3 py-2">Your data stays private</li>
          <li className="rounded-lg border border-slate-200 px-3 py-2">Fast tools for common data tasks</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Popular Tools</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((tool) => (
            <li key={tool.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Link className="font-semibold text-slate-900 underline" href={`/tools/${tool.slug}`}>
                {tool.title}
              </Link>
              <p className="mt-2 text-sm text-slate-700">{tool.shortDescription}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Tool Categories</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {categoryCards.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
            >
              <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Recently Added Tools</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latestTools.map((tool) => (
            <li key={tool.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Link className="font-semibold text-slate-900 underline" href={`/tools/${tool.slug}`}>
                {tool.title}
              </Link>
              <p className="mt-2 text-sm text-slate-700">{tool.shortDescription}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Problem-based guides and workflows</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guideHighlights.map((item) => (
            <li key={item.slug} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Link
                className="font-semibold text-slate-900 underline"
                href={
                  item.slug === "remove-duplicate-lines-workflow"
                    ? "/tools/remove-duplicate-lines"
                    : item.slug === "decode-base64-workflow"
                      ? "/tools/base64-decoder"
                      : item.slug === "generate-uuid-workflow"
                        ? "/tools/uuid-generator"
                        : `/guides/${item.slug}`
                }
              >
                {item.title}
              </Link>
              <p className="mt-2 text-sm text-slate-700">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Browse all tool taxonomies</h2>
        <ul className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link className="underline" href={`/tools/${category.slug}`}>
                {category.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
