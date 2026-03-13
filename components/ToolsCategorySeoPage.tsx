import Link from "next/link";
import { guidesBySlug } from "@/lib/guides";
import { toolsCategoryContent, type ToolsCategorySeoSlug } from "@/lib/tool-category-content";
import { toolsBySlug } from "@/lib/tools";

type ToolsCategorySeoPageProps = {
  slug: ToolsCategorySeoSlug;
};

export default function ToolsCategorySeoPage({ slug }: ToolsCategorySeoPageProps) {
  const content = toolsCategoryContent[slug];
  const toolItems = content.toolSlugs
    .map((toolSlug) => toolsBySlug[toolSlug])
    .filter((tool) => Boolean(tool));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="space-y-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{content.title}</h1>
          <p className="mt-3 max-w-4xl text-slate-700">{content.intro}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">What these tools are used for</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
            {content.usedFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Tools in this category</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolItems.map((tool) => (
              <li key={tool.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <Link href={`/tools/${tool.slug}`} className="text-lg font-semibold text-slate-900 underline">
                  {tool.title}
                </Link>
                <p className="mt-2 text-sm text-slate-700">{tool.shortDescription}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Popular tasks</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
            {content.popularTasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Related guides</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {content.relatedGuideSlugs.map((guideSlug) => {
              const guide = guidesBySlug[guideSlug];
              if (!guide) {
                return null;
              }

              return (
                <li key={guide.slug}>
                  <Link className="text-slate-700 underline hover:text-slate-900" href={`/guides/${guide.slug}`}>
                    {guide.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Explore related categories</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
            {content.relatedCategoryLinks.map((item) => (
              <li key={item.href}>
                <Link className="underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
          <div className="mt-3 space-y-3">
            {content.faq.map((item) => (
              <div key={item.question} className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
