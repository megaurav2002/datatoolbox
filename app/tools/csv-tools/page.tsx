import type { Metadata } from "next";
import { getCategoryMetadata, renderCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("csv-tools");

export default function CsvToolsPage() {
  return renderCategoryPage("csv-tools");
}
