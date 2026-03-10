import type { Metadata } from "next";
import { getHubMetadata, hubStructuredData, renderHubPage } from "@/lib/hub-page";

export const metadata: Metadata = getHubMetadata("csv-tools");

export default function CsvToolsHubPage() {
  const structuredData = hubStructuredData("csv-tools");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {renderHubPage("csv-tools")}
    </>
  );
}
