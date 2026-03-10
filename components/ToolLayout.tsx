import Link from "next/link";
import { generateToolFAQs } from "@/lib/generateToolFAQs";
import { guidePath, relatedGuidesForTool } from "@/lib/guides";
import { hubPath, relatedHubsForTool } from "@/lib/hubs";
import type { ToolDefinition } from "@/lib/types";
import { toolsBySlug } from "@/lib/tools";

type ToolLayoutProps = {
  tool: ToolDefinition;
  children: React.ReactNode;
};

function commonUseCasesForTool(tool: ToolDefinition): string[] {
  const specificUseCases: Record<string, string[]> = {
    "csv-to-sql": [
      "Importing spreadsheet exports into SQL databases.",
      "Generating seed scripts for development environments.",
      "Building one-time migration SQL from CSV data.",
    ],
    "json-to-csv": [
      "Exporting API response data into spreadsheets.",
      "Preparing JSON datasets for CSV-based reporting.",
      "Sharing tabular data with non-technical teams.",
    ],
    "csv-cleaner": [
      "Removing duplicate rows before CRM imports.",
      "Normalizing contact fields for marketing lists.",
      "Cleaning spreadsheet exports before analytics.",
    ],
  };

  if (specificUseCases[tool.slug]) {
    return specificUseCases[tool.slug];
  }

  if (tool.categories.includes("csv-tools")) {
    return [
      "Preparing CSV exports for reliable imports into other systems.",
      "Fixing spreadsheet data before reporting or analysis.",
      "Converting CSV records into JSON, SQL, or other formats.",
    ];
  }

  if (tool.categories.includes("json-tools")) {
    return [
      "Validating and formatting API payloads during debugging.",
      "Transforming JSON into spreadsheet-friendly formats.",
      "Cleaning JSON files before using them in applications.",
    ];
  }

  if (tool.categories.includes("developer-tools")) {
    return [
      "Debugging request payloads and encoded values quickly.",
      "Generating development data and identifiers.",
      "Validating text, URLs, timestamps, and structured content.",
    ];
  }

  return [
    "Cleaning raw input before importing into downstream tools.",
    "Running quick browser-based transformations without setup.",
    "Standardizing data for reporting and collaboration.",
  ];
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const faqs = generateToolFAQs(tool);
  const relatedGuides = relatedGuidesForTool(tool.slug);
  const relatedHubs = relatedHubsForTool(tool.slug);
  const commonUseCases = commonUseCasesForTool(tool);

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

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Tool interface</h2>
          <div className="mt-4">{children}</div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Example input</h2>
          <pre className="mt-3 overflow-auto rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{tool.exampleInput}</pre>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Example output</h2>
          <pre className="mt-3 overflow-auto rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{tool.exampleOutput}</pre>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Step-by-step instructions</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-slate-700">
            {tool.howToUse.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Common use cases</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
            {commonUseCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-700">{tool.whyUseful}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-3 space-y-3">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-700">{item.answer}</p>
              </div>
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

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Related guides</h2>
          {relatedGuides.length > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {relatedGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link href={guidePath(guide.slug)} className="text-slate-700 underline hover:text-slate-900">
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-slate-700">
              Browse all <Link href="/guides" className="underline">DataToolbox guides</Link> for more workflows.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Related categories</h2>
          {relatedHubs.length > 0 ? (
            <p className="mt-2 text-slate-700">
              Looking for other utilities in this area?{" "}
              {relatedHubs.map((hub, index) => (
                <span key={hub.slug}>
                  {index > 0 ? " " : ""}
                  <Link href={hubPath(hub.slug)} className="underline">
                    {hub.title}
                  </Link>
                  {index < relatedHubs.length - 1 ? "," : ""}
                </span>
              ))}
            </p>
          ) : (
            <p className="mt-2 text-slate-700">
              Explore the <Link href="/tools" className="underline">full tool directory</Link> for related utilities.
            </p>
          )}
        </section>
      </article>
    </main>
  );
}
