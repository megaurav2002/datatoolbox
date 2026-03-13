import type { Metadata } from "next";
import {
  getToolsCategoryMetadata,
  renderToolsCategoryPage,
  toolsCategoryStructuredData,
} from "@/lib/tools-category-page";

export const metadata: Metadata = getToolsCategoryMetadata("data-cleaning-tools");

export default function DataCleaningToolsPage() {
  const structuredData = toolsCategoryStructuredData("data-cleaning-tools");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {renderToolsCategoryPage("data-cleaning-tools")}
    </>
  );
}
