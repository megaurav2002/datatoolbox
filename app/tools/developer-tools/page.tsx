import type { Metadata } from "next";
import { getCategoryMetadata, renderCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("developer-tools");

export default function DeveloperToolsPage() {
  return renderCategoryPage("developer-tools");
}
