"use client";

import Link from "next/link";
import ToolSearch from "@/components/ToolSearch";
import type { CategoryDefinition } from "@/lib/categories";
import type { GuideDefinition } from "@/lib/guides";
import type { HubDefinition } from "@/lib/hubs";
import type { ToolDefinition } from "@/lib/types";

type HomeToolExplorerProps = {
  categories: CategoryDefinition[];
  hubs: HubDefinition[];
  guides: GuideDefinition[];
  popularTools: ToolDefinition[];
};

export default function HomeToolExplorer({
  categories,
  hubs,
  guides,
  popularTools,
}: HomeToolExplorerProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Free Online Data Tools</h1>
        <p className="mt-4 max-w-3xl text-slate-700">
          Convert CSV and JSON, clean spreadsheet data, and use practical developer utilities to transform
          data faster without sign-up.
        </p>
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Search tools
          </p>
          <ToolSearch />
        </div>
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
        <h2 className="text-2xl font-semibold text-slate-900">Category hubs</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((hub) => (
            <Link
              key={hub.slug}
              href={`/${hub.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
            >
              <h3 className="text-lg font-semibold text-slate-900">{hub.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{hub.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Problem-based guides</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Link className="font-semibold text-slate-900 underline" href={`/guides/${guide.slug}`}>
                {guide.title}
              </Link>
              <p className="mt-2 text-sm text-slate-700">{guide.description}</p>
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
