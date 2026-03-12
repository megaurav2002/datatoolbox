import type { Metadata } from "next";
import { absoluteUrl, buildMetaTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildMetaTitle("Privacy Policy"),
  description:
    "Privacy Policy for DataToolbox, including data handling, analytics, cookies, and third-party services.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | DataToolbox",
    description:
      "Privacy Policy for DataToolbox, including data handling, analytics, cookies, and third-party services.",
    url: absoluteUrl("/privacy"),
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-600">Last updated: March 12, 2026</p>
        </header>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
          <p>
            DataToolbox provides browser-based data tools. We are committed to handling user data responsibly and
            transparently.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Information We Collect</h2>
          <p>
            We may collect limited technical and usage information such as page views, browser type, and device
            information for analytics and service reliability.
          </p>
          <p>
            Tool input is processed client-side where possible. If any server-side processing is used, it is limited to
            providing requested functionality.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">How We Use Information</h2>
          <p>We use information to operate, maintain, secure, and improve DataToolbox and to understand product usage.</p>
          <p>
            We do not sell personal information. We do not use tool input to train models unless explicitly stated for a
            specific feature.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Cookies and Analytics</h2>
          <p>
            We use analytics services to understand product usage and improve the platform. These services may use
            cookies or similar technologies.
          </p>
          <p>
            You can control cookies through your browser settings. Blocking cookies may affect parts of the site
            functionality.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Third-Party Services</h2>
          <p>
            We may rely on third-party infrastructure and APIs (for example hosting, analytics, and optional AI
            features). Their processing of data is governed by their own policies.
          </p>
          <p>
            If AI-powered tools are enabled, submitted input may be sent to the configured AI provider solely to return
            the requested output.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Data Retention and Security</h2>
          <p>
            We retain data only as needed for operations, security, and legal obligations. We implement reasonable
            safeguards to protect information.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have rights to request access, correction, deletion, or restriction of
            personal information processing.
          </p>
          <p>
            To make a request, contact us using the details below. We may need to verify your request before acting on
            it.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Children&apos;s Privacy</h2>
          <p>
            DataToolbox is not directed to children under 13, and we do not knowingly collect personal information from
            children.
          </p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Policy Updates</h2>
          <p>We may update this policy periodically. We will revise the &quot;Last updated&quot; date when changes are made.</p>
        </section>

        <section className="space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p>
            For privacy requests or questions, contact us at: <span className="font-medium">privacy@datatoolbox.tools</span>
          </p>
        </section>
      </article>
    </main>
  );
}
