import Link from "next/link";
import type { ToolDefinition } from "@/lib/types";
import { toolsBySlug } from "@/lib/tools";

type ToolLayoutProps = {
  tool: ToolDefinition;
  children: React.ReactNode;
};

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{tool.title}</h1>
          <p className="max-w-3xl text-slate-700">{tool.shortDescription}</p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">What this tool does</h2>
          <p className="mt-2 text-slate-700">{tool.intro}</p>
        </section>

        {children}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">How to use the tool</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-slate-700">
            {tool.howToUse.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Example</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-600">Input</h3>
              <pre className="overflow-auto rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{tool.exampleInput}</pre>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-600">Output</h3>
              <pre className="overflow-auto rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{tool.exampleOutput}</pre>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Why this tool is useful</h2>
          <p className="mt-2 text-slate-700">{tool.whyUseful}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
          <div className="mt-3 space-y-3">
            {tool.faq.map((item) => (
              <details key={item.question} className="rounded-lg border border-slate-200 p-3">
                <summary className="cursor-pointer font-medium text-slate-800">{item.question}</summary>
                <p className="mt-2 text-sm text-slate-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Related tools</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {tool.related.map((slug) => {
              const relatedTool = toolsBySlug[slug];
              if (!relatedTool) {
                return null;
              }
              return (
                <li key={slug}>
                  <Link href={`/tools/${slug}`} className="text-slate-700 underline hover:text-slate-900">
                    {relatedTool.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </article>
    </main>
  );
}
