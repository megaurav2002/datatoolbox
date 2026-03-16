import Link from "next/link";
import { generateToolFAQs } from "@/lib/generateToolFAQs";
import { guidePath, relatedGuidesForTool } from "@/lib/guides";
import { relatedHubsForTool } from "@/lib/hubs";
import { toolsCategoryCanonical } from "@/lib/tool-category-content";
import type { ToolDefinition } from "@/lib/types";
import { tools, toolsBySlug } from "@/lib/tools";

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
    "remove-duplicate-lines": [
      "Deduplicating email or username lists before outreach.",
      "Cleaning repeated log lines before incident review.",
      "Removing duplicate tags or keywords before upload.",
    ],
    "json-validator": [
      "Checking webhook payload syntax before deployment.",
      "Validating edited JSON config files before save.",
      "Quickly isolating malformed API responses during debugging.",
    ],
    "json-formatter": [
      "Making compact API payloads readable in code reviews.",
      "Formatting JSON logs for easier incident triage.",
      "Preparing JSON snippets for documentation and tickets.",
    ],
    "json-minifier": [
      "Reducing JSON payload size for transport-sensitive calls.",
      "Compressing configuration JSON for embedding in scripts.",
      "Preparing compact fixtures for tests and demos.",
    ],
    "timestamp-converter": [
      "Converting Unix timestamps in logs to readable time.",
      "Debugging event-order issues across services and timezones.",
      "Checking API payload dates in UTC and local time.",
    ],
    "url-parser": [
      "Inspecting callback URLs during OAuth and webhook integration.",
      "Debugging tracking links and query parameters.",
      "Breaking down redirect URLs to verify host and path values.",
    ],
    "sql-formatter": [
      "Cleaning SQL queries before pull request review.",
      "Improving readability of copied queries from logs.",
      "Standardizing query formatting for team documentation.",
    ],
    "sql-minifier": [
      "Compacting SQL embedded in scripts or config values.",
      "Removing comments before shipping SQL snippets.",
      "Reducing SQL text size for logs and payload fields.",
    ],
    "regex-tester": [
      "Validating extraction patterns before shipping code.",
      "Debugging mismatched filters in parsing pipelines.",
      "Comparing pattern behavior across sample input variations.",
    ],
    "base64-encoder": [
      "Encoding credential fragments for integration setup.",
      "Preparing Base64 samples for API testing.",
      "Converting text payloads for systems expecting Base64 values.",
    ],
    "base64-decoder": [
      "Inspecting encoded payload values from logs.",
      "Decoding API response fields for debugging.",
      "Verifying whether an integration output is valid Base64.",
    ],
    "json-diff-checker": [
      "Comparing API responses between development, staging, and production.",
      "Reviewing JSON config changes before deployment.",
      "Verifying webhook payload shape changes after provider updates.",
      "Inspecting differences between exported JSON snapshots during regressions.",
    ],
  };

  if (specificUseCases[tool.slug]) {
    return specificUseCases[tool.slug];
  }

  if (tool.slug.includes("-to-")) {
    const [inputSlug, outputSlug] = tool.slug.split("-to-");
    const inputFormat = inputSlug.replace(/-/g, " ");
    const outputFormat = outputSlug.replace(/-/g, " ");
    return [
      `Converting ${inputFormat || "source"} data into ${outputFormat || "target"} format for downstream tools.`,
      "Preparing transformed data for imports, reporting, or API workflows.",
      "Reducing manual reformatting work between systems with incompatible formats.",
    ];
  }

  if (tool.slug.includes("validator")) {
    return [
      "Catching malformed input before import or deployment.",
      "Checking payload structure during debugging and QA.",
      "Preventing format-related errors in downstream tools.",
    ];
  }

  if (tool.slug.includes("formatter")) {
    return [
      "Making dense content easier to review and debug.",
      "Standardizing output before sharing queries or payloads.",
      "Cleaning generated text for readable documentation.",
    ];
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

function commonMistakesForTool(tool: ToolDefinition): string[] {
  if (tool.commonMistakes && tool.commonMistakes.length > 0) {
    return tool.commonMistakes;
  }

  const specificMistakes: Record<string, string[]> = {
    "remove-duplicate-lines": [
      "Expecting comma-separated values in one line to be deduplicated individually.",
      "Assuming case-insensitive matching when line matching is case-sensitive.",
      "Forgetting that unique blank lines can remain in output.",
    ],
    "json-validator": [
      "Pasting JavaScript objects with single quotes and trailing commas.",
      "Assuming syntax validation also checks schema rules.",
      "Validating truncated JSON fragments instead of full documents.",
    ],
    "json-formatter": [
      "Pasting invalid JSON and expecting formatted output.",
      "Confusing JSON with JavaScript object literal syntax.",
      "Leaving trailing commas that break parsing.",
    ],
    "timestamp-converter": [
      "Mixing Unix seconds and Unix milliseconds.",
      "Comparing UTC values with local times without timezone context.",
      "Assuming ambiguous date strings parse identically in all environments.",
    ],
    "url-parser": [
      "Pasting relative URLs without a protocol.",
      "Assuming duplicate query keys map to a single value.",
      "Forgetting percent-decoding when inspecting encoded parameters.",
    ],
    "regex-tester": [
      "Forgetting regex flags and misreading match counts.",
      "Copying patterns without escaping backslashes correctly.",
      "Testing against unrealistic sample text that misses edge cases.",
    ],
  };

  if (specificMistakes[tool.slug]) {
    return specificMistakes[tool.slug];
  }

  if (tool.slug.includes("-to-")) {
    return [
      "Using input that does not match the source format expected by the converter.",
      "Assuming nested or irregular records will map cleanly without review.",
      "Skipping output validation before importing into another system.",
    ];
  }

  if (tool.categories.includes("csv-tools")) {
    return [
      "Using data without checking whether the header row matches expected column names.",
      "Skipping validation before import, which can hide row-width or delimiter issues.",
      "Converting files before cleaning duplicate or malformed records.",
    ];
  }

  if (tool.categories.includes("json-tools")) {
    return [
      "Pasting partial JSON fragments instead of complete valid objects or arrays.",
      "Assuming nested keys flatten automatically without checking output columns.",
      "Mixing JSON arrays and objects when the tool expects one specific structure.",
    ];
  }

  if (tool.categories.includes("developer-tools")) {
    return [
      "Treating decoded or formatted output as a security check when it is only a transformation.",
      "Copying transformed values without confirming expected encoding or timestamp units.",
      "Using sample data formats that differ from production payload structure.",
    ];
  }

  return [
    "Running transformations on raw input without checking formatting first.",
    "Assuming output is production-ready without validating edge cases.",
    "Skipping related tools that can catch upstream data-quality issues.",
  ];
}

function sharesCategory(a: ToolDefinition, b: ToolDefinition): boolean {
  return a.categories.some((category) => b.categories.includes(category));
}

function sharedCategoryCount(a: ToolDefinition, b: ToolDefinition): number {
  return a.categories.filter((category) => b.categories.includes(category)).length;
}

function relatedToolsForTool(tool: ToolDefinition): ToolDefinition[] {
  const sameClusterTools = tools.filter(
    (candidate) => candidate.slug !== tool.slug && sharesCategory(candidate, tool),
  );

  const preferredSameCluster = tool.related
    .map((slug) => toolsBySlug[slug])
    .filter((candidate): candidate is ToolDefinition => Boolean(candidate))
    .filter((candidate) => candidate.slug !== tool.slug && sharesCategory(candidate, tool));

  const fallbackRanked = [...sameClusterTools].sort((a, b) => {
    const sharedDiff = sharedCategoryCount(b, tool) - sharedCategoryCount(a, tool);
    if (sharedDiff !== 0) {
      return sharedDiff;
    }
    return a.title.localeCompare(b.title);
  });

  const deduped: ToolDefinition[] = [];
  const seen = new Set<string>();
  [...preferredSameCluster, ...fallbackRanked].forEach((candidate) => {
    if (!seen.has(candidate.slug)) {
      seen.add(candidate.slug);
      deduped.push(candidate);
    }
  });

  return deduped.slice(0, 6);
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const faqs = generateToolFAQs(tool);
  const relatedGuides = relatedGuidesForTool(tool.slug);
  const relatedHubs = relatedHubsForTool(tool.slug);
  const commonUseCases = commonUseCasesForTool(tool);
  const commonMistakes = commonMistakesForTool(tool);
  const relatedTools = relatedToolsForTool(tool);

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
          {tool.exampleNotes && tool.exampleNotes.length > 0 ? (
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-700">
              {tool.exampleNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
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
          <h2 className="text-xl font-semibold text-slate-900">Common mistakes to avoid</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
            {commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
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
            {relatedTools.map((relatedTool) => (
              <li key={relatedTool.slug}>
                <Link
                  href={`/tools/${relatedTool.slug}`}
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  {relatedTool.title}
                </Link>
              </li>
            ))}
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
                  <Link href={toolsCategoryCanonical(hub.slug)} className="underline">
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
