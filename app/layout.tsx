import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import ToolSearch from "@/components/ToolSearch";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${SITE_NAME} | Free Data Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "DataToolbox offers fast, free tools for CSV conversion, JSON utilities, text cleaning, and developer workflows.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Free Data Tools`,
    description:
      "DataToolbox offers fast, free tools for CSV conversion, JSON utilities, text cleaning, and developer workflows.",
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Free Data Tools`,
    description:
      "DataToolbox offers fast, free tools for CSV conversion, JSON utilities, text cleaning, and developer workflows.",
  },
  verification: {
    google: "uJpWgW2wyHfH1rY96Jij1TCfL3ShXIhpyfv4_wG62HQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-bold text-slate-900">
                DataToolbox
              </Link>
              <div className="flex gap-4 text-sm text-slate-700">
                <Link href="/tools" className="hover:text-slate-900">
                  Tools
                </Link>
                <Link href="/guides" className="hover:text-slate-900">
                  Guides
                </Link>
                <Link href="/tools#category-hubs" className="hover:text-slate-900">
                  Categories
                </Link>
              </div>
            </div>
            <div className="w-full">
              <ToolSearch
                variant="navbar"
                placeholder="Search tools..."
              />
            </div>
          </nav>
        </header>
        {children}
        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-slate-700 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div>
              <h2 className="font-semibold text-slate-900">Category Hubs</h2>
              <ul className="mt-2 space-y-1">
                <li><Link className="underline" href="/csv-tools">CSV Tools</Link></li>
                <li><Link className="underline" href="/json-tools">JSON Tools</Link></li>
                <li><Link className="underline" href="/data-cleaning-tools">Data Cleaning Tools</Link></li>
                <li><Link className="underline" href="/developer-data-tools">Developer Data Tools</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Guides</h2>
              <ul className="mt-2 space-y-1">
                <li><Link className="underline" href="/guides/how-to-convert-json-to-csv">How to Convert JSON to CSV</Link></li>
                <li><Link className="underline" href="/guides/how-to-clean-csv-data">How to Clean CSV Data</Link></li>
                <li><Link className="underline" href="/guides/how-to-import-csv-into-sql">How to Import CSV into SQL</Link></li>
                <li><Link className="underline" href="/guides/how-to-flatten-json">How to Flatten JSON</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Directory</h2>
              <ul className="mt-2 space-y-1">
                <li><Link className="underline" href="/tools">All Tools</Link></li>
                <li><Link className="underline" href="/guides">All Guides</Link></li>
              </ul>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
