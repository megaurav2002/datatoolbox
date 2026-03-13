import Link from "next/link";
import { hubsBySlug } from "@/lib/hubs";
import { guidePath, guidesBySlug, type GuideDefinition } from "@/lib/guides";
import { toolsCategoryCanonical } from "@/lib/tool-category-content";
import { toolsBySlug } from "@/lib/tools";

type GuidePageProps = {
  guide: GuideDefinition;
};

export default function GuidePage({ guide }: GuidePageProps) {
  const primaryTool = toolsBySlug[guide.primaryToolSlug];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="space-y-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{guide.title}</h1>
          <p className="mt-3 text-slate-700">{guide.introduction}</p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Example input data</h2>
          <pre className="mt-3 overflow-auto rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{guide.exampleInput}</pre>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Why this problem matters</h2>
          <p className="mt-2 text-slate-700">{guide.whyItMatters}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Solution overview</h2>
          <p className="mt-2 text-slate-700">{guide.solutionSummary}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Step-by-step guide</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-slate-700">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Use the DataToolbox tool</h2>
          <p className="mt-2 text-slate-700">
            {primaryTool ? (
              <>
                Continue with the <Link className="underline" href={`/tools/${primaryTool.slug}`}>{primaryTool.title}</Link> to run this transformation in your browser.
              </>
            ) : (
              "Open the matching DataToolbox tool to apply this workflow."
            )}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Related tools</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[guide.primaryToolSlug, ...guide.relatedToolSlugs].map((toolSlug) => {
              const tool = toolsBySlug[toolSlug];
              if (!tool) {
                return null;
              }

              return (
                <li key={tool.slug}>
                  <Link className="underline text-slate-700 hover:text-slate-900" href={`/tools/${tool.slug}`}>
                    {tool.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Related categories and guides</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-700">
            <p>
              Categories:{" "}
              {guide.relatedHubSlugs.map((hubSlug, index) => (
                <span key={hubSlug}>
                  {index > 0 ? ", " : ""}
                  <Link className="underline" href={toolsCategoryCanonical(hubSlug)}>
                    {hubsBySlug[hubSlug].title}
                  </Link>
                </span>
              ))}
            </p>
            <p>
              Related guides:{" "}
              {guide.relatedGuideSlugs.map((relatedSlug, index) => (
                <span key={relatedSlug}>
                  {index > 0 ? ", " : ""}
                  <Link className="underline" href={guidePath(relatedSlug)}>
                    {guidesBySlug[relatedSlug].title}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
