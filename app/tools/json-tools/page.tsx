import type { Metadata } from "next";
import {
  getToolsCategoryMetadata,
  renderToolsCategoryPage,
  toolsCategoryStructuredData,
} from "@/lib/tools-category-page";

export const metadata: Metadata = getToolsCategoryMetadata("json-tools");

export default function JsonToolsPage() {
  const structuredData = toolsCategoryStructuredData("json-tools");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {renderToolsCategoryPage("json-tools")}
    </>
  );
}
