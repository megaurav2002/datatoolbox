import type { Metadata } from "next";
import { getHubMetadata, hubStructuredData, renderHubPage } from "@/lib/hub-page";

export const metadata: Metadata = getHubMetadata("data-cleaning-tools");

export default function DataCleaningToolsHubPage() {
  const structuredData = hubStructuredData("data-cleaning-tools");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {renderHubPage("data-cleaning-tools")}
    </>
  );
}
