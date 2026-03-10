import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/lib/guides";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildMetaTitle("Data Transformation Guides"),
  description: "Step-by-step guides for common CSV, JSON, SQL import, and data cleaning tasks.",
  alternates: {
    canonical: "/guides",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Data Transformation Guides | DataToolbox",
    description: "Step-by-step guides for common CSV, JSON, SQL import, and data cleaning tasks.",
    url: absoluteUrl("/guides"),
    type: "website",
  },
};

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">DataToolbox Guides</h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Practical, problem-focused walkthroughs for common data transformation workflows.
        </p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <li key={guide.slug} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <Link className="text-lg font-semibold text-slate-900 underline" href={`/guides/${guide.slug}`}>
              {guide.title}
            </Link>
            <p className="mt-2 text-sm text-slate-700">{guide.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
