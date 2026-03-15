"use client";

import { useMemo, useState } from "react";
import type {
  DetectedTechnology,
  TechCategory,
  WebsiteTechStackReport,
} from "@/lib/website-tech-stack-detector";

type ApiError = {
  error?: string;
};

const SAMPLE_URLS = [
  "https://www.shopify.com",
  "https://wordpress.org",
  "https://nextjs.org",
];

function confidenceTone(confidence: DetectedTechnology["confidence"]): string {
  if (confidence === "High") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (confidence === "Medium") {
    return "bg-amber-100 text-amber-800";
  }
  return "bg-slate-100 text-slate-700";
}

export default function WebsiteTechStackDetectorTool() {
  const [url, setUrl] = useState("https://datatoolbox.tools");
  const [report, setReport] = useState<WebsiteTechStackReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const grouped = useMemo(() => {
    const categories: TechCategory[] = [
      "Frontend / framework",
      "Infra / hosting / CDN",
      "Analytics / tracking",
      "UI / misc",
    ];
    return categories.map((category) => ({
      category,
      items: (report?.detected ?? []).filter((item) => item.category === category),
    }));
  }, [report]);

  const likely = (report?.detected ?? []).filter((item) => item.confidence === "High");
  const possibly = (report?.detected ?? []).filter((item) => item.confidence !== "High");

  const onAnalyze = async () => {
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response = await fetch("/api/tech-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as ApiError;
        throw new Error(payload.error ?? "Could not analyze this URL.");
      }
      const payload = (await response.json()) as WebsiteTechStackReport;
      setReport(payload);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not analyze this URL.");
    } finally {
      setLoading(false);
    }
  };

  const onCopySummary = async () => {
    if (!report) {
      return;
    }
    const lines = [
      `URL analyzed: ${report.analyzedUrl}`,
      `Final URL: ${report.finalUrl}`,
      `Status: ${report.status}`,
      `Summary: ${report.summary}`,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
  };

  const onDownloadJson = () => {
    if (!report) {
      return;
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "tech-stack-report.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <section className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Website Tech Stack Detector</h2>
        <p className="mt-2 text-slate-700">
          Detect website technology by inspecting HTML, scripts, headers, and platform fingerprints. This website
          built with checker reports likely frameworks, hosting/CDN, analytics tools, and common UI libraries with
          confidence levels and evidence.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
          />
          <button
            type="button"
            onClick={() => void onAnalyze()}
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Website"}
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-700">
          Example URLs:{" "}
          {SAMPLE_URLS.map((sample, index) => (
            <button
              key={sample}
              type="button"
              onClick={() => setUrl(sample)}
              className="underline"
            >
              {sample}
              {index < SAMPLE_URLS.length - 1 ? ", " : ""}
            </button>
          ))}
        </p>
      </section>

      {error ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
      ) : null}

      {!error && !report && !loading ? (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Enter a URL to detect website technology and get a structured tech stack report.
        </section>
      ) : null}

      {report ? (
        <section className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Analysis Summary</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void onCopySummary()}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Copy Summary
                </button>
                <button
                  type="button"
                  onClick={onDownloadJson}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Download JSON
                </button>
              </div>
            </div>

            <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-900">URL analyzed</dt>
                <dd className="break-all">{report.analyzedUrl}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Final resolved URL</dt>
                <dd className="break-all">{report.finalUrl}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">HTTP status</dt>
                <dd>{report.status}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Redirect count</dt>
                <dd>{report.redirectCount}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold text-slate-900">Page title</dt>
                <dd>{report.title || "Not available"}</dd>
              </div>
            </dl>

            <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{report.summary}</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Detected technologies</h3>

            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                <p className="font-semibold">Likely</p>
                <p>{likely.length > 0 ? likely.map((item) => item.name).join(", ") : "No high-confidence matches."}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                <p className="font-semibold">Possibly</p>
                <p>
                  {possibly.length > 0 ? possibly.map((item) => item.name).join(", ") : "No medium/low-confidence matches."}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {grouped.map(({ category, items }) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-slate-900">{category}</h4>
                  {items.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {items.map((item) => (
                        <li key={item.name} className="rounded-lg border border-slate-200 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${confidenceTone(item.confidence)}`}
                            >
                              {item.confidence}
                            </span>
                          </div>
                          <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                            {item.evidence.map((evidence) => (
                              <li key={evidence}>{evidence}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-slate-600">Not detected.</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Not detected</h3>
            <p className="mt-2 text-sm text-slate-700">
              {report.notDetected.slice(0, 18).join(", ")}
              {report.notDetected.length > 18 ? ", ..." : ""}
            </p>
          </section>
        </section>
      ) : null}
    </section>
  );
}

