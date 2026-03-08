import type { Metadata } from "next";
import { getCategoryMetadata, renderCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("spreadsheet-tools");

export default function SpreadsheetToolsPage() {
  return renderCategoryPage("spreadsheet-tools");
}
