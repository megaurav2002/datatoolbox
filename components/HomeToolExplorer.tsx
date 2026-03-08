"use client";

import Link from "next/link";
import ToolSearch from "@/components/ToolSearch";
import type { CategoryDefinition } from "@/lib/categories";
import type { ToolDefinition } from "@/lib/types";

type HomeToolExplorerProps = {
  categories: CategoryDefinition[];
  popularTools: ToolDefinition[];
};

export default function HomeToolExplorer({
  categories,
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
        <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/tools/${category.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
            >
              <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
