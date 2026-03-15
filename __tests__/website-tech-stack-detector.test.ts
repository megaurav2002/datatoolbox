import {
  assertPublicTarget,
  buildSummary,
  detectTechnologies,
  extractSignals,
  normalizeUrl,
  type DetectionSignalSet,
} from "@/lib/website-tech-stack-detector";

describe("website tech stack detector", () => {
  it("normalizes URLs and adds https when protocol is missing", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
    expect(normalizeUrl("https://example.com/docs")).toBe("https://example.com/docs");
  });

  it("rejects unsupported or internal targets", () => {
    expect(() => normalizeUrl("ftp://example.com")).toThrow("Only http and https URLs are supported.");
    expect(() => assertPublicTarget("https://localhost:3000")).toThrow(
      "Local or internal hosts are not supported.",
    );
    expect(() => assertPublicTarget("https://127.0.0.1")).toThrow(
      "Private network IP addresses are not supported.",
    );
  });

  it("extracts and detects common technology fingerprints", () => {
    const html = `
      <html>
        <head>
          <title>Demo</title>
          <meta name="generator" content="WordPress 6.5" />
          <script src="/_next/static/chunk.js"></script>
          <script src="https://www.googletagmanager.com/gtm.js?id=GTM-ABC"></script>
          <script src="https://www.google-analytics.com/analytics.js"></script>
          <script src="https://js.stripe.com/v3"></script>
        </head>
        <body>__NEXT_DATA__ wp-content</body>
      </html>
    `;

    const signals = extractSignals({
      analyzedUrl: "https://example.com",
      finalUrl: "https://example.com",
      status: 200,
      redirectCount: 0,
      headers: {
        "x-vercel-id": "mel1::123",
        "server": "cloudflare",
      },
      html,
      title: "Demo",
    });

    const detections = detectTechnologies(signals);
    const names = detections.map((item) => item.name);

    expect(names).toContain("Next.js");
    expect(names).toContain("WordPress");
    expect(names).toContain("Google Tag Manager");
    expect(names).toContain("Google Analytics");
    expect(names).toContain("Stripe");
    expect(names).toContain("Vercel");
    expect(names).toContain("Cloudflare");
  });

  it("builds an inconclusive summary when no strong detections exist", () => {
    expect(buildSummary([])).toContain("Detection is inconclusive");
  });

  it("builds a useful summary from categorized detections", () => {
    const detections: DetectionSignalSet = {
      html: "",
      headers: {},
      scriptSrcs: [],
      linkHrefs: [],
      metaGenerator: "",
      title: "",
    };

    const summary = buildSummary(
      detectTechnologies({
        ...detections,
        html: `
          <script src="/_next/static/app.js"></script>
          <script src="https://www.googletagmanager.com/gtag/js?id=G-1"></script>
        `,
        headers: { "x-vercel-id": "abc" },
      }),
    );

    expect(summary).toContain("likely built with");
    expect(summary).toContain("deployed on");
  });

  it("uses clear phrasing when analytics are not detected", () => {
    const summary = buildSummary([
      {
        name: "Next.js",
        category: "Frontend / framework",
        confidence: "High",
        evidence: ["Found /_next/ paths."],
      },
      {
        name: "Vercel",
        category: "Infra / hosting / CDN",
        confidence: "High",
        evidence: ["Found x-vercel-id."],
      },
    ]);

    expect(summary).toContain("no strong analytics signatures were detected");
  });
});
