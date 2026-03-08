import type { Metadata } from "next";
import { getCategoryMetadata, renderCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("text-tools");

export default function TextToolsPage() {
  return renderCategoryPage("text-tools");
}
