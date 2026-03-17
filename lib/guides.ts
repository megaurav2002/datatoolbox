import { toolsBySlug } from "@/lib/tools";
import type { ToolDefinition } from "@/lib/types";
import type { HubSlug } from "@/lib/hubs";
import { toolsCategoryCanonical } from "@/lib/tool-category-content";

export type GuideSlug =
  | "how-to-convert-json-to-csv"
  | "how-to-clean-csv-data"
  | "how-to-import-csv-into-sql"
  | "how-to-flatten-json"
  | "how-to-compare-json"
  | "how-to-validate-yaml"
  | "how-to-parse-a-url"
  | "how-to-open-csv-files-online";

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
  {
    slug: "how-to-compare-json",
    title: "How to Compare JSON",
    description: "Compare two JSON documents online and quickly spot added, removed, and changed paths.",
    introduction:
      "When two payloads look similar, it is easy to miss important differences. This guide shows a fast way to compare JSON side by side and identify what changed.",
    whyItMatters:
      "JSON comparison helps with API debugging, config reviews, and regression checks, especially when nested fields or array values change.",
    exampleInput:
      '{\n  "name": "Alice",\n  "age": 30,\n  "tags": ["admin", "editor"],\n  "profile": {\n    "city": "Melbourne"\n  }\n}\n\n{\n  "name": "Alice",\n  "age": 31,\n  "tags": ["admin", "owner"],\n  "profile": {\n    "city": "Sydney"\n  },\n  "active": true\n}',
    solutionSummary:
      "Use JSON Diff Checker to compare both documents and review grouped Added, Removed, and Changed paths with nested field details.",
    steps: [
      "Paste the first JSON document in the left input.",
      "Paste the second JSON document in the right input.",
      "Optionally keep Ignore key order enabled for logical comparisons.",
      "Run comparison and review Added, Removed, and Changed groups.",
      "Use the reported paths to validate payload changes or troubleshoot regressions.",
    ],
    primaryToolSlug: "json-diff-checker",
    relatedToolSlugs: ["json-formatter", "json-validator", "json-minifier", "json-path-extractor"],
    relatedGuideSlugs: ["how-to-convert-json-to-csv", "how-to-flatten-json"],
    relatedHubSlugs: ["json-tools", "developer-data-tools"],
  },
  {
    slug: "how-to-validate-yaml",
    title: "How to Validate YAML",
    description: "Validate YAML syntax online and catch indentation errors before deployment.",
    introduction:
      "YAML mistakes are easy to miss, especially when indentation is inconsistent. This guide shows a quick way to validate YAML and fix parser errors before deploy.",
    whyItMatters:
      "Broken YAML can fail CI pipelines, Kubernetes applies, and configuration loading. Fast validation reduces rollout risk.",
    exampleInput:
      "services:\n  api:\n\timage: node:20\n    ports:\n      - 3000:3000",
    solutionSummary:
      "Use YAML Validator to check syntax, identify line-level errors, and optionally format valid YAML before final validation.",
    steps: [
      "Paste YAML content or upload a `.yaml` / `.yml` file.",
      "Run validation and read the error message details.",
      "Fix indentation and tabs-vs-spaces issues.",
      "Optionally format valid YAML, then validate again.",
      "Use YAML Formatter for final cleanup before committing config changes.",
    ],
    primaryToolSlug: "yaml-validator",
    relatedToolSlugs: ["yaml-formatter", "json-formatter", "json-validator"],
    relatedGuideSlugs: ["how-to-compare-json"],
    relatedHubSlugs: ["developer-data-tools", "json-tools"],
  },
  {
    slug: "how-to-parse-a-url",
    title: "How to Parse a URL",
    description: "Parse URL components and query parameters online for API and redirect debugging.",
    introduction:
      "Complex URLs often hide important details in query parameters, fragments, and ports. This guide shows how to break a URL into structured parts quickly.",
    whyItMatters:
      "URL parsing helps troubleshoot callbacks, redirects, tracking links, and integration issues where a single parameter can change behavior.",
    exampleInput:
      "https://api.example.com:8443/v1/orders/42?expand=items&include=payments&env=staging#response",
    solutionSummary:
      "Use URL Parser to extract protocol, host, subdomain, port, path, query string, and query rows for faster debugging.",
    steps: [
      "Paste a full absolute URL including protocol.",
      "Run parser and review each extracted component.",
      "Inspect query parameters in key/value rows.",
      "Copy parsed output for tickets, logs, or handoff notes.",
      "Use URL Encoder/Decoder and Query String tools for follow-up edits.",
    ],
    primaryToolSlug: "url-parser",
    relatedToolSlugs: ["query-string-parser", "query-string-builder", "url-encoder", "url-decoder"],
    relatedGuideSlugs: ["how-to-compare-json"],
    relatedHubSlugs: ["developer-data-tools"],
  },
  {
    slug: "how-to-open-csv-files-online",
    title: "How to Open CSV Files Online",
    description: "Open CSV files online, preview rows cleanly, and spot delimiter or structure issues fast.",
    introduction:
      "When spreadsheet apps mangle delimiters or large files are hard to inspect, an online CSV viewer helps you preview data quickly.",
    whyItMatters:
      "A quick CSV preview step catches malformed rows, wrong delimiters, and header issues before data import.",
    exampleInput:
      "delimiter=comma\n\nid,name,email\n1,Ana,ana@example.com\n2,Bob,bob@example.com",
    solutionSummary:
      "Use CSV Viewer to preview tabular output in-browser, then clean, split, merge, or validate your CSV as needed.",
    steps: [
      "Paste CSV content into CSV Viewer.",
      "Set delimiter mode (comma, semicolon, tab, or pipe).",
      "Run preview and inspect headers and row alignment.",
      "Use CSV Cleaner if values need normalization.",
      "Validate the final CSV before import.",
    ],
    primaryToolSlug: "csv-viewer",
    relatedToolSlugs: ["csv-cleaner", "csv-splitter", "csv-merge-tool", "csv-validator"],
    relatedGuideSlugs: ["how-to-clean-csv-data", "how-to-import-csv-into-sql"],
    relatedHubSlugs: ["csv-tools", "data-cleaning-tools"],
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
