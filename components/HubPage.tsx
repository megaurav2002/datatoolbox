import Link from "next/link";
import type { HubDefinition } from "@/lib/hubs";
import { hubPath, hubsBySlug } from "@/lib/hubs";
import type { ToolDefinition } from "@/lib/types";

type HubPageProps = {
  hub: HubDefinition;
  tools: ToolDefinition[];
};

export default function HubPage({ hub, tools }: HubPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{hub.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-700">{hub.intro}</p>
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
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Common {hub.title} tasks</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
          {hub.commonTasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Explore related categories</h2>
        <ul className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
          {hub.relatedHubs.map((relatedSlug) => (
            <li key={relatedSlug}>
              <Link className="underline" href={hubPath(relatedSlug)}>
                {hubsBySlug[relatedSlug].title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Need a walkthrough?</h2>
        <p className="mt-2 text-slate-700">
          Visit the <Link href="/guides" className="underline">DataToolbox guides</Link> for step-by-step solutions to
          common CSV, JSON, and data cleaning tasks.
        </p>
      </section>
    </main>
  );
}
