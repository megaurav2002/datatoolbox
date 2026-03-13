import { toolsBySlug } from "@/lib/tools";
import type { ToolDefinition } from "@/lib/types";
import type { HubSlug } from "@/lib/hubs";
import { toolsCategoryCanonical } from "@/lib/tool-category-content";

export type GuideSlug =
  | "how-to-convert-json-to-csv"
  | "how-to-clean-csv-data"
  | "how-to-import-csv-into-sql"
  | "how-to-flatten-json";

export type GuideDefinition = {
  slug: GuideSlug;
  title: string;
  description: string;
  introduction: string;
  whyItMatters: string;
  exampleInput: string;
  solutionSummary: string;
  steps: string[];
  primaryToolSlug: string;
  relatedToolSlugs: string[];
  relatedGuideSlugs: GuideSlug[];
  relatedHubSlugs: HubSlug[];
};

export const guides: GuideDefinition[] = [
  {
    slug: "how-to-convert-json-to-csv",
    title: "How to Convert JSON to CSV",
    description: "A step-by-step guide for converting JSON arrays into spreadsheet-ready CSV.",
    introduction:
      "JSON data is common in APIs, but CSV is easier for spreadsheet workflows. This guide shows how to convert JSON arrays into clean CSV output quickly.",
    whyItMatters:
      "Teams often need to move API responses into Excel or Google Sheets for analysis, reporting, and handoff. JSON to CSV conversion makes this process faster.",
    exampleInput: '[{"name":"Ana","email":"ana@example.com"},{"name":"Bob","email":"bob@example.com"}]',
    solutionSummary:
      "Use the JSON to CSV converter to transform your array of objects into columns, then copy or download the CSV output.",
    steps: [
      "Prepare a valid JSON array where each item is an object.",
      "Open the JSON to CSV tool and paste your JSON input.",
      "Run the conversion and verify the generated column headers.",
      "Copy or download the CSV file for spreadsheet use.",
    ],
    primaryToolSlug: "json-to-csv",
    relatedToolSlugs: ["json-flatten-to-csv", "json-validator", "json-formatter", "csv-cleaner", "csv-validator"],
    relatedGuideSlugs: ["how-to-flatten-json", "how-to-clean-csv-data"],
    relatedHubSlugs: ["json-tools", "csv-tools"],
  },
  {
    slug: "how-to-clean-csv-data",
    title: "How to Clean CSV Data",
    description: "Learn how to clean inconsistent CSV rows before imports and analysis.",
    introduction:
      "CSV files often contain duplicate rows, empty records, inconsistent casing, and malformed columns. Cleaning your data first prevents downstream errors.",
    whyItMatters:
      "Clean CSV data imports more reliably into databases, CRMs, and analytics platforms. It also improves report quality and reduces manual fixes later.",
    exampleInput:
      " Full Name , Email , Phone \n Ana Doe , ANA@Example.com , +61 (412) 555-009 \n Ana Doe , ANA@Example.com , +61 (412) 555-009 ",
    solutionSummary:
      "Run the CSV Cleaner to trim values, normalize key fields, and remove duplicates. Validate the final structure before importing.",
    steps: [
      "Paste or upload your CSV file into the CSV Cleaner tool.",
      "Enable cleaning options such as deduplication and normalization.",
      "Run the cleaner and inspect preview stats for changed rows.",
      "Validate the cleaned file and then export it for your target system.",
    ],
    primaryToolSlug: "csv-cleaner",
    relatedToolSlugs: ["csv-validator", "remove-duplicate-lines", "sort-lines-alphabetically", "csv-to-json"],
    relatedGuideSlugs: ["how-to-import-csv-into-sql"],
    relatedHubSlugs: ["data-cleaning-tools", "csv-tools"],
  },
  {
    slug: "how-to-import-csv-into-sql",
    title: "How to Import CSV into SQL",
    description: "Convert CSV into SQL table and INSERT statements for faster database imports.",
    introduction:
      "If you have spreadsheet exports but need SQL scripts, converting CSV into CREATE TABLE and INSERT statements saves setup time.",
    whyItMatters:
      "CSV to SQL conversion is useful for seeding development databases, migration scripts, and one-time data backfills.",
    exampleInput: "id,name,email\n1,Ana,ana@example.com\n2,Bob,bob@example.com",
    solutionSummary:
      "Use the CSV to SQL Generator to infer columns and data types, select a SQL dialect, and export executable SQL.",
    steps: [
      "Prepare CSV with headers in the first row.",
      "Open CSV to SQL Generator and paste or upload your file.",
      "Review detected columns, types, and table name settings.",
      "Select SQL dialect, generate output, and copy/download SQL statements.",
    ],
    primaryToolSlug: "csv-to-sql",
    relatedToolSlugs: ["csv-cleaner", "csv-validator", "csv-to-json", "sql-formatter"],
    relatedGuideSlugs: ["how-to-clean-csv-data"],
    relatedHubSlugs: ["csv-tools", "developer-data-tools"],
  },
  {
    slug: "how-to-flatten-json",
    title: "How to Flatten JSON",
    description: "Flatten nested JSON structures into tabular fields for analysis and exports.",
    introduction:
      "Nested JSON is hard to analyze in spreadsheets and BI tools. Flattening transforms nested keys into a tabular structure.",
    whyItMatters:
      "Flat key/value output makes it easier to filter, aggregate, and import JSON data into tabular systems without losing structure context.",
    exampleInput: '{"user":{"name":"Ana","address":{"city":"Melbourne"}},"roles":["admin"]}',
    solutionSummary:
      "Use the JSON Flatten tool to create dot-notation fields, then export flattened data as JSON or CSV.",
    steps: [
      "Paste nested JSON into the flatten tool.",
      "Choose whether you want flattened JSON or CSV output.",
      "Run transformation and validate flattened keys.",
      "Copy or download the output for downstream use.",
    ],
    primaryToolSlug: "json-flatten-to-csv",
    relatedToolSlugs: ["json-to-csv", "json-formatter", "json-validator", "csv-cleaner"],
    relatedGuideSlugs: ["how-to-convert-json-to-csv"],
    relatedHubSlugs: ["json-tools", "developer-data-tools"],
  },
];

export const guidesBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide])) as Record<
  GuideSlug,
  GuideDefinition
>;

export function guidePath(slug: GuideSlug): string {
  return `/guides/${slug}`;
}

export function relatedGuidesForTool(toolSlug: string): GuideDefinition[] {
  return guides.filter(
    (guide) => guide.primaryToolSlug === toolSlug || guide.relatedToolSlugs.includes(toolSlug),
  );
}

export function guideTools(guide: GuideDefinition): ToolDefinition[] {
  return [guide.primaryToolSlug, ...guide.relatedToolSlugs]
    .map((slug) => toolsBySlug[slug])
    .filter((tool): tool is ToolDefinition => Boolean(tool));
}

export function guideHubLinks(guide: GuideDefinition): Array<{ slug: HubSlug; href: string }> {
  return guide.relatedHubSlugs.map((slug) => ({ slug, href: toolsCategoryCanonical(slug) }));
}
