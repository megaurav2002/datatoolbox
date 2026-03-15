import { NextResponse } from "next/server";
import {
  assertPublicTarget,
  buildReport,
  fetchPageData,
  normalizeUrl,
} from "@/lib/website-tech-stack-detector";

type AnalyzeRequestBody = {
  url?: string;
};

export async function POST(request: Request) {
  let payload: AnalyzeRequestBody;
  try {
    payload = (await request.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  try {
    const normalizedUrl = normalizeUrl(payload.url ?? "");
    assertPublicTarget(normalizedUrl);
    const pageData = await fetchPageData(normalizedUrl);
    const report = buildReport(pageData);
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze this URL.";
    const status = /valid URL|supported|local|private|Invalid JSON|Please enter/i.test(message)
      ? 400
      : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
