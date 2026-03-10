import type { Metadata } from "next";
import { getHubMetadata, hubStructuredData, renderHubPage } from "@/lib/hub-page";

export const metadata: Metadata = getHubMetadata("developer-data-tools");

export default function DeveloperDataToolsHubPage() {
  const structuredData = hubStructuredData("developer-data-tools");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {renderHubPage("developer-data-tools")}
    </>
  );
}
