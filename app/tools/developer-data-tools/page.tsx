import type { Metadata } from "next";
import {
  getToolsCategoryMetadata,
  renderToolsCategoryPage,
  toolsCategoryStructuredData,
} from "@/lib/tools-category-page";

export const metadata: Metadata = getToolsCategoryMetadata("developer-data-tools");

export default function DeveloperDataToolsPage() {
  const structuredData = toolsCategoryStructuredData("developer-data-tools");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {renderToolsCategoryPage("developer-data-tools")}
    </>
  );
}
