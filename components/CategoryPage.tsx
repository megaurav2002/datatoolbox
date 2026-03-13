import Link from "next/link";
import type { CategoryDefinition } from "@/lib/categories";
import { hubsBySlug, type HubSlug } from "@/lib/hubs";
import { toolsCategoryCanonical } from "@/lib/tool-category-content";
import type { ToolDefinition } from "@/lib/types";

type CategoryPageProps = {
  category: CategoryDefinition;
  tools: ToolDefinition[];
};

export default function CategoryPage({ category, tools }: CategoryPageProps) {
  const mappedHubSlug = (
    {
      "csv-tools": "csv-tools",
      "json-tools": "json-tools",
      "text-tools": "data-cleaning-tools",
      "developer-tools": "developer-data-tools",
      "spreadsheet-tools": "data-cleaning-tools",
    } as const
  )[category.slug] as HubSlug;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{category.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-700">{category.description}</p>
        <p className="mt-3 text-sm text-slate-700">
          Looking for the SEO hub page?{" "}
          <Link className="underline" href={toolsCategoryCanonical(mappedHubSlug)}>
            View {hubsBySlug[mappedHubSlug].title}
          </Link>
          .
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Tools in this category</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Link href={`/tools/${tool.slug}`} className="text-lg font-semibold text-slate-900 underline">
                {tool.title}
              </Link>
              <p className="mt-2 text-sm text-slate-700">{tool.shortDescription}</p>
              <p className="mt-3 text-xs text-slate-600">
                Related: {tool.related.slice(0, 2).map((related, index) => (
                  <span key={related}>
                    {index > 0 ? ", " : ""}
                    <Link href={`/tools/${related}`} className="underline">
                      {related}
                    </Link>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Explore more categories</h2>
        <ul className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
          <li>
            <Link className="underline" href="/tools/csv-tools">
              CSV Tools
            </Link>
          </li>
          <li>
            <Link className="underline" href="/tools/json-tools">
              JSON Tools
            </Link>
          </li>
          <li>
            <Link className="underline" href="/tools/data-cleaning-tools">
              Data Cleaning Tools
            </Link>
          </li>
          <li>
            <Link className="underline" href="/tools/developer-data-tools">
              Developer Data Tools
            </Link>
          </li>
          <li>
            <Link className="underline" href="/guides">
              Problem-based Guides
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
