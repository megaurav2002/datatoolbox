import type { Metadata } from "next";
import { getHubMetadata, hubStructuredData, renderHubPage } from "@/lib/hub-page";

export const metadata: Metadata = getHubMetadata("json-tools");

export default function JsonToolsHubPage() {
  const structuredData = hubStructuredData("json-tools");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {renderHubPage("json-tools")}
    </>
  );
}
