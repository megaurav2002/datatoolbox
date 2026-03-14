import { toolsBySlug } from "@/lib/tools";
import type { ToolDefinition } from "@/lib/types";

export type HubSlug =
  | "csv-tools"
  | "json-tools"
  | "data-cleaning-tools"
  | "developer-data-tools";

export type HubDefinition = {
  slug: HubSlug;
  title: string;
  description: string;
  intro: string;
  commonTasks: string[];
  toolSlugs: string[];
  relatedHubs: HubSlug[];
};

export const hubs: HubDefinition[] = [
  {
    slug: "csv-tools",
    title: "CSV Tools",
    description: "Convert, clean, validate, and prepare CSV files for imports and analysis.",
    intro:
      "CSV tools help you clean spreadsheet exports, transform columns, and generate outputs that are ready for apps, databases, and analytics workflows.",
    commonTasks: [
      "Convert CSV exports into JSON for APIs and JavaScript apps.",
      "Generate SQL INSERT scripts from CSV before importing into a database.",
      "Clean inconsistent rows and remove duplicate records before analysis.",
    ],
    toolSlugs: [
      "csv-to-json",
      "csv-to-sql",
      "csv-cleaner",
      "csv-validator",
      "csv-column-mapper",
      "csv-viewer",
      "csv-merge-tool",
      "csv-splitter",
      "sql-to-csv",
      "json-to-csv",
      "ndjson-to-csv",
    ],
    relatedHubs: ["json-tools", "data-cleaning-tools", "developer-data-tools"],
  },
  {
    slug: "json-tools",
    title: "JSON Tools",
    description: "Format, validate, flatten, and convert JSON data in your browser.",
    intro:
      "JSON tools are useful when you are working with API payloads, configuration files, or nested objects that need cleanup, validation, or conversion.",
    commonTasks: [
      "Format compact JSON for easier debugging and code reviews.",
      "Validate JSON syntax before using payloads in production.",
      "Flatten nested JSON and convert it into CSV for spreadsheet workflows.",
    ],
    toolSlugs: [
      "json-formatter",
      "json-validator",
      "json-minifier",
      "json-to-yaml",
      "yaml-to-json",
      "json-to-csv",
      "json-flatten-to-csv",
      "json-schema-generator",
      "json-path-extractor",
      "json-diff-checker",
      "ndjson-formatter",
      "jwt-decoder",
      "jwt-encoder",
      "ndjson-to-csv",
      "json-to-xml",
      "xml-to-json",
    ],
    relatedHubs: ["csv-tools", "developer-data-tools", "data-cleaning-tools"],
  },
  {
    slug: "data-cleaning-tools",
    title: "Data Cleaning Tools",
    description: "Remove duplicates, validate structure, and normalize messy data quickly.",
    intro:
      "Data cleaning tools help you fix formatting issues, remove duplicates, and standardize raw input before imports, reporting, or automation.",
    commonTasks: [
      "Remove duplicate rows or duplicate lines from exported data.",
      "Validate CSV structure before uploading to another system.",
      "Normalize contact fields and text values for consistent records.",
    ],
    toolSlugs: [
      "csv-cleaner",
      "csv-validator",
      "remove-duplicate-lines",
      "remove-empty-lines",
      "remove-extra-spaces",
      "sort-lines-alphabetically",
      "reverse-text",
      "extract-emails",
      "extract-urls",
      "extract-numbers",
      "character-counter",
      "word-counter",
      "case-converter",
      "remove-line-breaks",
      "text-diff-checker",
      "slug-generator",
      "random-string-generator",
      "lorem-ipsum-generator",
    ],
    relatedHubs: ["csv-tools", "json-tools", "developer-data-tools"],
  },
  {
    slug: "developer-data-tools",
    title: "Developer Data Tools",
    description: "Developer-focused tools for transformations, encoding, parsing, and debugging.",
    intro:
      "Developer data tools speed up common engineering tasks like converting payloads, generating identifiers, testing patterns, and debugging encoded values.",
    commonTasks: [
      "Convert data between CSV, JSON, and SQL for development workflows.",
      "Encode or decode URL and Base64 content while debugging requests.",
      "Generate UUIDs and inspect timestamps during testing and seeding.",
    ],
    toolSlugs: [
      "csv-to-sql",
      "json-schema-generator",
      "ndjson-to-csv",
      "json-flatten-to-csv",
      "json-formatter",
      "mermaid-editor",
      "cron-expression-parser",
      "cron-expression-builder",
      "sql-formatter",
      "sql-minifier",
      "sql-to-csv",
      "url-parser",
      "date-format-converter",
      "json-path-extractor",
      "ndjson-formatter",
      "jwt-decoder",
      "hash-generator",
      "base64-encoder",
      "base64-decoder",
      "uuid-generator",
      "url-encoder",
      "url-decoder",
      "regex-tester",
      "timestamp-converter",
      "password-generator",
      "bcrypt-hash-generator",
      "hmac-generator",
      "yaml-validator",
      "yaml-formatter",
      "yaml-to-json",
      "json-to-yaml",
      "curl-to-fetch",
      "html-encoder",
      "html-decoder",
      "csv-viewer",
      "word-counter",
      "case-converter",
      "remove-line-breaks",
      "lorem-ipsum-generator",
      "jwt-encoder",
      "query-string-builder",
      "query-string-parser",
      "xml-validator",
      "xml-to-json",
      "json-to-xml",
      "json-diff-checker",
      "markdown-to-html",
      "html-to-markdown",
      "character-counter",
      "slug-generator",
      "text-diff-checker",
      "random-string-generator",
    ],
    relatedHubs: ["csv-tools", "json-tools", "data-cleaning-tools"],
  },
];

export const hubsBySlug = Object.fromEntries(hubs.map((hub) => [hub.slug, hub])) as Record<
  HubSlug,
  HubDefinition
>;

export function hubPath(slug: HubSlug): string {
  return `/${slug}`;
}

export function hubTools(slug: HubSlug): ToolDefinition[] {
  return hubsBySlug[slug].toolSlugs
    .map((toolSlug) => toolsBySlug[toolSlug])
    .filter((tool): tool is ToolDefinition => Boolean(tool));
}

export function relatedHubsForTool(toolSlug: string): HubDefinition[] {
  return hubs.filter((hub) => hub.toolSlugs.includes(toolSlug));
}
