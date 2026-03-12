import type { Metadata } from "next";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildMetaTitle("Terms and Conditions"),
  description:
    "Terms and Conditions for using DataToolbox, including acceptable use, warranties, and liability limitations.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms and Conditions | DataToolbox",
    description:
      "Terms and Conditions for using DataToolbox, including acceptable use, warranties, and liability limitations.",
    url: absoluteUrl("/terms"),
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terms and Conditions</h1>
          <p className="mt-2 text-sm text-slate-600">Last updated: March 12, 2026</p>
        </header>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Acceptance of Terms</h2>
          <p>
            By using DataToolbox, you agree to these terms. If you do not agree, please do not use the service.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Use of the Service</h2>
          <p>
            You may use DataToolbox for lawful purposes only. You must not misuse, disrupt, reverse engineer, or
            attempt unauthorized access to the platform.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">User Content and Responsibility</h2>
          <p>
            You are responsible for the data you submit to tools and for ensuring you have the right to process that
            data. Do not submit unlawful, infringing, or sensitive data unless you are authorized to do so.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Intellectual Property</h2>
          <p>
            The DataToolbox platform, branding, and site content are protected by applicable intellectual property laws.
            You may not copy or redistribute site assets except as permitted by law.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">No Warranty</h2>
          <p>
            DataToolbox is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, express or
            implied.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, DataToolbox and its operators are not liable for indirect,
            incidental, or consequential damages arising from use of the service.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Availability and Changes</h2>
          <p>
            We may modify, suspend, or discontinue all or part of the service at any time, with or without notice.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Termination</h2>
          <p>
            We may restrict or terminate access to the service for behavior that violates these terms or creates legal
            or security risk.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after updates constitutes
            acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p>
            For questions about these terms, contact us at: <span className="font-medium">legal@datatoolbox.tools</span>
          </p>
        </section>
      </article>
    </main>
  );
}
