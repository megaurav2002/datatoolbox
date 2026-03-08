import type { Metadata } from "next";
import { getCategoryMetadata, renderCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("json-tools");

export default function JsonToolsPage() {
  return renderCategoryPage("json-tools");
}
