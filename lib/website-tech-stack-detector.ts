export type TechCategory =
  | "Frontend / framework"
  | "Infra / hosting / CDN"
  | "Analytics / tracking"
  | "UI / misc";

export type TechConfidence = "High" | "Medium" | "Low";

export type DetectionSignalSet = {
  html: string;
  headers: Record<string, string>;
  scriptSrcs: string[];
  linkHrefs: string[];
  metaGenerator: string;
  title: string;
};

export type DetectedTechnology = {
  name: string;
  category: TechCategory;
  confidence: TechConfidence;
  evidence: string[];
};

export type WebsiteTechStackReport = {
  analyzedUrl: string;
  finalUrl: string;
  status: number;
  redirectCount: number;
  title: string;
  summary: string;
  detected: DetectedTechnology[];
  notDetected: string[];
};

export const KNOWN_TECHNOLOGIES = [
  "Next.js",
  "React",
  "Vue",
  "Nuxt",
  "Angular",
  "Svelte / SvelteKit",
  "Gatsby",
  "Astro",
  "Remix",
  "WordPress",
  "Shopify",
  "Webflow",
  "Wix",
  "Squarespace",
  "Vercel",
  "Netlify",
  "Cloudflare",
  "Fastly",
  "AWS / CloudFront",
  "Akamai",
  "Google Analytics",
  "Google Tag Manager",
  "Meta Pixel",
  "Hotjar",
  "Segment",
  "Mixpanel",
  "Amplitude",
  "Tailwind CSS",
  "Bootstrap",
  "jQuery",
  "reCAPTCHA",
  "Stripe",
  "Intercom",
  "Zendesk",
] as const;

function confidenceScore(confidence: TechConfidence): number {
  if (confidence === "High") {
    return 3;
  }
  if (confidence === "Medium") {
    return 2;
  }
  return 1;
}

function normalizeUrlPath(path: string): string {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path;
}

export function normalizeUrl(input: string): string {
  const raw = input.trim();
  if (!raw) {
    throw new Error("Please enter a URL to analyze.");
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error("Please enter a valid URL (for example, https://example.com).");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported.");
  }

  parsed.pathname = normalizeUrlPath(parsed.pathname || "/");
  return parsed.toString();
}

function isPrivateIp(value: string): boolean {
  const ipv4Match = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (a === 10 || a === 127 || a === 0) {
      return true;
    }
    if (a === 169 && b === 254) {
      return true;
    }
    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }
    if (a === 192 && b === 168) {
      return true;
    }
    return false;
  }

  if (value === "::1" || value.startsWith("fe80:") || value.startsWith("fc") || value.startsWith("fd")) {
    return true;
  }

  return false;
}

export function assertPublicTarget(url: string): void {
  const parsed = new URL(url);
  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("Local or internal hosts are not supported.");
  }

  if (isPrivateIp(hostname)) {
    throw new Error("Private network IP addresses are not supported.");
  }
}

type PageData = {
  analyzedUrl: string;
  finalUrl: string;
  status: number;
  redirectCount: number;
  headers: Record<string, string>;
  html: string;
  title: string;
};

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 9000;
const MAX_CONTENT_LENGTH_BYTES = 2_000_000;

function readTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) {
    return "";
  }
  return match[1].replace(/\s+/g, " ").trim();
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out while fetching the website.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPageData(analyzedUrl: string): Promise<PageData> {
  let currentUrl = analyzedUrl;
  let redirectCount = 0;
  let response: Response | null = null;

  while (redirectCount <= MAX_REDIRECTS) {
    assertPublicTarget(currentUrl);
    response = await fetchWithTimeout(currentUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent": "DataToolbox Tech Stack Detector/1.0 (+https://datatoolbox.tools)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        break;
      }

      currentUrl = new URL(location, currentUrl).toString();
      const protocol = new URL(currentUrl).protocol;
      if (protocol !== "http:" && protocol !== "https:") {
        throw new Error("Redirected to an unsupported protocol.");
      }
      redirectCount += 1;
      if (redirectCount > MAX_REDIRECTS) {
        throw new Error("Too many redirects while fetching the URL.");
      }
      continue;
    }

    break;
  }

  if (!response) {
    throw new Error("Failed to fetch the website.");
  }

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const contentType = headers["content-type"] ?? "";
  if (contentType && !/html|text/i.test(contentType)) {
    throw new Error("The target URL did not return an HTML page.");
  }
  const contentLength = Number(headers["content-length"] ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH_BYTES) {
    throw new Error("The target page is too large to analyze in this tool.");
  }

  const html = await response.text();
  const title = readTitle(html);

  return {
    analyzedUrl,
    finalUrl: currentUrl,
    status: response.status,
    redirectCount,
    headers,
    html,
    title,
  };
}

function extractAttributeValues(html: string, tag: "script" | "link", attribute: "src" | "href"): string[] {
  const regex = new RegExp(`<${tag}[^>]*\\s${attribute}=["']([^"']+)["'][^>]*>`, "gi");
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while (true) {
    match = regex.exec(html);
    if (!match) {
      break;
    }
    values.push(match[1]);
  }
  return values;
}

export function extractSignals(pageData: PageData): DetectionSignalSet {
  const html = pageData.html;
  const scriptSrcs = extractAttributeValues(html, "script", "src");
  const linkHrefs = extractAttributeValues(html, "link", "href");
  const metaGeneratorMatch = html.match(
    /<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );

  return {
    html,
    headers: pageData.headers,
    scriptSrcs,
    linkHrefs,
    metaGenerator: metaGeneratorMatch?.[1]?.trim() ?? "",
    title: pageData.title,
  };
}

export function detectTechnologies(signals: DetectionSignalSet): DetectedTechnology[] {
  const detections = new Map<string, DetectedTechnology>();
  const htmlLower = signals.html.toLowerCase();
  const scriptsLower = signals.scriptSrcs.map((src) => src.toLowerCase());
  const linksLower = signals.linkHrefs.map((href) => href.toLowerCase());
  const generatorLower = signals.metaGenerator.toLowerCase();
  const headers = signals.headers;

  const hasScript = (pattern: RegExp): boolean => scriptsLower.some((value) => pattern.test(value));
  const hasLink = (pattern: RegExp): boolean => linksLower.some((value) => pattern.test(value));
  const hasHtml = (pattern: RegExp): boolean => pattern.test(htmlLower);
  const hasHeader = (key: string, pattern: RegExp): boolean =>
    Boolean(headers[key]?.toLowerCase()) && pattern.test(headers[key].toLowerCase());

  const addDetection = (
    name: string,
    category: TechCategory,
    confidence: TechConfidence,
    evidence: string,
  ) => {
    const existing = detections.get(name);
    if (!existing) {
      detections.set(name, { name, category, confidence, evidence: [evidence] });
      return;
    }

    if (confidenceScore(confidence) > confidenceScore(existing.confidence)) {
      existing.confidence = confidence;
    }
    if (!existing.evidence.includes(evidence)) {
      existing.evidence.push(evidence);
    }
  };

  // Frontend / framework
  if (hasHtml(/__next_data__/) || hasScript(/\/_next\//) || hasLink(/\/_next\//)) {
    addDetection("Next.js", "Frontend / framework", "High", "Found Next.js markers (/_next/ or __NEXT_DATA__).");
  }
  if (hasHtml(/reactroot|__react_devtools_global_hook__/) || hasScript(/react(\.min|\.production)?\.js/)) {
    addDetection("React", "Frontend / framework", "Medium", "Found React runtime markers.");
  }
  if (hasHtml(/id=["']__nuxt["']|window\.__nuxt__|\/_nuxt\//) || hasScript(/\/_nuxt\//)) {
    addDetection("Nuxt", "Frontend / framework", "High", "Found Nuxt markers (/_nuxt/ or __NUXT__).");
  }
  if (hasHtml(/window\.__vue__|data-v-[a-z0-9]+/)) {
    addDetection("Vue", "Frontend / framework", "Medium", "Found Vue-specific DOM/runtime markers.");
  }
  if (hasHtml(/ng-version=|angular/i) || hasScript(/angular(\.min)?\.js/)) {
    addDetection("Angular", "Frontend / framework", "Medium", "Found Angular markers (ng-version/angular runtime).");
  }
  if (hasHtml(/sveltekit|data-sveltekit|\/_app\/immutable\//) || hasScript(/svelte|\/_app\/immutable\//)) {
    addDetection("Svelte / SvelteKit", "Frontend / framework", "High", "Found SvelteKit asset/runtime markers.");
  }
  if (hasHtml(/___gatsby/) || hasScript(/gatsby/)) {
    addDetection("Gatsby", "Frontend / framework", "Medium", "Found Gatsby markers.");
  }
  if (hasHtml(/\/_astro\//) || hasScript(/\/_astro\//) || hasHtml(/astro-island/)) {
    addDetection("Astro", "Frontend / framework", "High", "Found Astro asset/runtime markers.");
  }
  if (hasHtml(/__remixcontext/) || hasScript(/\/build\/_assets\//)) {
    addDetection("Remix", "Frontend / framework", "Medium", "Found Remix context/assets.");
  }
  if (hasHtml(/wp-content|wp-includes/) || generatorLower.includes("wordpress")) {
    addDetection("WordPress", "Frontend / framework", "High", "Found WordPress paths or generator tag.");
  }
  if (
    hasHtml(/cdn\.shopify\.com|shopify\.theme|shopify-checkout-api-token/) ||
    hasHeader("x-shopify-stage", /.+/)
  ) {
    addDetection("Shopify", "Frontend / framework", "High", "Found Shopify scripts or platform headers.");
  }
  if (hasHtml(/webflow|data-wf-domain|webflow\.js/) || generatorLower.includes("webflow")) {
    addDetection("Webflow", "Frontend / framework", "High", "Found Webflow generator/scripts.");
  }
  if (hasHtml(/wixstatic\.com|static\.parastorage\.com|wixbiosession/)) {
    addDetection("Wix", "Frontend / framework", "High", "Found Wix asset/runtime markers.");
  }
  if (hasHtml(/static\.squarespace\.com|squarespace/ ) || generatorLower.includes("squarespace")) {
    addDetection("Squarespace", "Frontend / framework", "High", "Found Squarespace asset/generator markers.");
  }

  // Infra / hosting / CDN
  if (hasHeader("x-vercel-id", /.+/) || hasHeader("server", /vercel/)) {
    addDetection("Vercel", "Infra / hosting / CDN", "High", "Found Vercel response headers.");
  }
  if (hasHeader("x-nf-request-id", /.+/) || hasHeader("server", /netlify/)) {
    addDetection("Netlify", "Infra / hosting / CDN", "High", "Found Netlify response headers.");
  }
  if (hasHeader("cf-ray", /.+/) || hasHeader("server", /cloudflare/)) {
    addDetection("Cloudflare", "Infra / hosting / CDN", "High", "Found Cloudflare headers.");
  }
  if (hasHeader("x-served-by", /fastly/) || hasHeader("x-fastly-request-id", /.+/)) {
    addDetection("Fastly", "Infra / hosting / CDN", "Medium", "Found Fastly cache/request headers.");
  }
  if (hasHeader("x-amz-cf-id", /.+/) || hasHeader("via", /cloudfront/)) {
    addDetection("AWS / CloudFront", "Infra / hosting / CDN", "High", "Found CloudFront headers.");
  }
  if (hasHeader("server", /akamai/) || Object.keys(headers).some((key) => key.startsWith("x-akamai"))) {
    addDetection("Akamai", "Infra / hosting / CDN", "Medium", "Found Akamai server/header markers.");
  }

  // Analytics / tracking
  if (hasHtml(/googletagmanager\.com\/gtag\/js|google-analytics\.com\/analytics\.js|gtag\(/)) {
    addDetection("Google Analytics", "Analytics / tracking", "High", "Found Google Analytics gtag/analytics script.");
  }
  if (hasHtml(/googletagmanager\.com\/gtm\.js|gtm-[a-z0-9]+/)) {
    addDetection("Google Tag Manager", "Analytics / tracking", "High", "Found GTM container/script markers.");
  }
  if (hasHtml(/connect\.facebook\.net\/.*fbevents\.js|fbq\(/)) {
    addDetection("Meta Pixel", "Analytics / tracking", "High", "Found Meta Pixel script or fbq calls.");
  }
  if (hasHtml(/static\.hotjar\.com|hj\(/)) {
    addDetection("Hotjar", "Analytics / tracking", "High", "Found Hotjar script/runtime markers.");
  }
  if (hasHtml(/cdn\.segment\.com\/analytics\.js|analytics\.load\(/)) {
    addDetection("Segment", "Analytics / tracking", "High", "Found Segment analytics.js markers.");
  }
  if (hasHtml(/cdn\.mxpnl\.com|mixpanel\.init\(/)) {
    addDetection("Mixpanel", "Analytics / tracking", "High", "Found Mixpanel script/runtime markers.");
  }
  if (hasHtml(/cdn\.amplitude\.com|amplitude\.getinstance|amplitude\.init/)) {
    addDetection("Amplitude", "Analytics / tracking", "High", "Found Amplitude script/runtime markers.");
  }

  // UI / misc
  if (hasHtml(/tailwindcss/) || hasScript(/tailwind/) || hasLink(/tailwind/)) {
    addDetection("Tailwind CSS", "UI / misc", "Medium", "Found Tailwind CSS references in assets or HTML.");
  }
  if (hasScript(/bootstrap/) || hasLink(/bootstrap/) || hasHtml(/class=["'][^"']*container-fluid/)) {
    addDetection("Bootstrap", "UI / misc", "Medium", "Found Bootstrap asset/class markers.");
  }
  if (hasScript(/jquery(\.min)?\.js/) || hasHtml(/window\.jquery|\$\(/)) {
    addDetection("jQuery", "UI / misc", "Medium", "Found jQuery script/runtime markers.");
  }
  if (hasHtml(/google\.com\/recaptcha\/api\.js|g-recaptcha|grecaptcha/)) {
    addDetection("reCAPTCHA", "UI / misc", "High", "Found reCAPTCHA script/widget markers.");
  }
  if (hasHtml(/js\.stripe\.com\/v3|stripe\.com/)) {
    addDetection("Stripe", "UI / misc", "High", "Found Stripe JS/sdk markers.");
  }
  if (hasHtml(/widget\.intercom\.io|intercom\(/)) {
    addDetection("Intercom", "UI / misc", "High", "Found Intercom widget/runtime markers.");
  }
  if (hasHtml(/static\.zdassets\.com|zendesk/)) {
    addDetection("Zendesk", "UI / misc", "High", "Found Zendesk asset/runtime markers.");
  }

  return Array.from(detections.values()).sort((a, b) => {
    const confidenceDiff = confidenceScore(b.confidence) - confidenceScore(a.confidence);
    if (confidenceDiff !== 0) {
      return confidenceDiff;
    }
    return a.name.localeCompare(b.name);
  });
}

function topByCategory(detections: DetectedTechnology[], category: TechCategory): string[] {
  return detections
    .filter((item) => item.category === category && confidenceScore(item.confidence) >= 2)
    .slice(0, 2)
    .map((item) => item.name);
}

export function buildSummary(detections: DetectedTechnology[]): string {
  const frontend = topByCategory(detections, "Frontend / framework");
  const infra = topByCategory(detections, "Infra / hosting / CDN");
  const analytics = topByCategory(detections, "Analytics / tracking");

  if (frontend.length === 0 && infra.length === 0 && analytics.length === 0) {
    return "Detection is inconclusive. The site may be using custom or obscured technology with limited public fingerprints.";
  }

  const frontendText = frontend.length > 0 ? frontend.join(" or ") : "a custom stack";
  const infraText = infra.length > 0 ? infra.join(" or ") : "an unknown hosting/CDN layer";
  if (analytics.length > 0) {
    return `This site is likely built with ${frontendText}, deployed on ${infraText}, and uses ${analytics.join(", ")}.`;
  }

  return `This site is likely built with ${frontendText}, deployed on ${infraText}, and no strong analytics signatures were detected.`;
}

export function buildReport(pageData: PageData): WebsiteTechStackReport {
  const signals = extractSignals(pageData);
  const detected = detectTechnologies(signals);
  const detectedNames = new Set(detected.map((item) => item.name));
  const notDetected = KNOWN_TECHNOLOGIES.filter((name) => !detectedNames.has(name));

  return {
    analyzedUrl: pageData.analyzedUrl,
    finalUrl: pageData.finalUrl,
    status: pageData.status,
    redirectCount: pageData.redirectCount,
    title: pageData.title,
    summary: buildSummary(detected),
    detected,
    notDetected,
  };
}
