import type { ToolCategorySlug } from "@/lib/types";

export type CategoryDefinition = {
  slug: ToolCategorySlug;
  title: string;
  description: string;
};

export const categories: CategoryDefinition[] = [
  {
    slug: "csv-tools",
    title: "CSV Tools",
    description: "Clean, validate, and convert CSV files for fast spreadsheet workflows.",
  },
  {
    slug: "json-tools",
    title: "JSON Tools",
    description: "Format, validate, and convert JSON data quickly in your browser.",
  },
  {
    slug: "text-tools",
    title: "Text Tools",
    description: "Extract, sort, and clean text data for analysis and exports.",
  },
  {
    slug: "developer-tools",
    title: "Developer Tools",
    description: "Developer-focused utilities for debugging, formatting, and query assistance.",
  },
  {
    slug: "spreadsheet-tools",
    title: "Spreadsheet Tools",
    description: "Spreadsheet-focused tools for formulas and tabular data transformations.",
  },
];

export const categoriesBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));
