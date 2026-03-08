import type { Metadata } from "next";
import Link from "next/link";
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
      </body>
    </html>
  );
}
