import type { GuideSlug } from "@/lib/guides";
import { toolsByCategory, toolsBySlug } from "@/lib/tools";
import { absoluteUrl } from "@/lib/seo";

export type ToolsCategorySeoSlug =
  | "csv-tools"
  | "json-tools"
  | "data-cleaning-tools"
  | "developer-data-tools";

export type ToolsCategorySeoContent = {
  slug: ToolsCategorySeoSlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  usedFor: string[];
  popularTasks: string[];
  toolSlugs: string[];
  relatedCategoryLinks: Array<{ href: string; label: string }>;
  relatedGuideSlugs: GuideSlug[];
  faq: Array<{ question: string; answer: string }>;
};

export const toolsCategoryContent: Record<ToolsCategorySeoSlug, ToolsCategorySeoContent> = {
  "csv-tools": {
    slug: "csv-tools",
    title: "CSV Tools",
    metaTitle: "CSV Tools for Cleaning, Converting, and Restructuring Data",
    metaDescription:
      "Use DataToolbox CSV tools to clean rows, map columns, split and merge files, validate structure, and convert CSV into JSON or SQL.",
    intro:
      "CSV is still the most common format for operational exports, and it is also one of the easiest ways for hidden data issues to reach production. Teams regularly deal with inconsistent headers, duplicate rows, broken delimiters, and files that look fine in spreadsheets but fail during import. This page groups practical CSV utilities for developers, analysts, and spreadsheet-heavy teams that need quick fixes without opening heavy desktop software. You can convert CSV to JSON for API payloads, generate SQL from rows for database seeding, validate row width before upload, map columns to match destination schemas, and split or merge files for batch processing. Each tool is designed for browser-first usage with copy and download actions, so you can move from raw exports to clean, usable data in minutes. If your workflow starts with spreadsheets and ends in apps, reports, or databases, this hub is meant to be your operational shortcut. It is especially valuable when repeated import failures are caused by subtle file quality issues.",
    usedFor: [
      "Converting CSV exports into developer-friendly formats like JSON and SQL.",
      "Preparing files for CRM, data warehouse, and application imports.",
      "Fixing schema and row consistency issues before downstream processing.",
    ],
    popularTasks: [
      "Convert CSV to JSON for API seed data.",
      "Generate SQL inserts from spreadsheet exports.",
      "Map old header names to target schema fields.",
      "Split large CSVs into chunked files for staged upload.",
    ],
    toolSlugs: toolsByCategory("csv-tools").map((tool) => tool.slug),
    relatedCategoryLinks: [
      { href: "/tools/json-tools", label: "JSON Tools" },
      { href: "/tools/data-cleaning-tools", label: "Data Cleaning Tools" },
      { href: "/tools/developer-data-tools", label: "Developer Data Tools" },
    ],
    relatedGuideSlugs: [
      "how-to-clean-csv-data",
      "how-to-import-csv-into-sql",
      "how-to-convert-json-to-csv",
    ],
    faq: [
      {
        question: "Can I clean CSV data before converting it?",
        answer: "Yes. Run CSV Cleaner first, then convert with CSV to JSON or CSV to SQL for better output quality.",
      },
      {
        question: "Do these CSV tools handle different column sets?",
        answer: "CSV Merge Tool can combine files with different headers and fills missing columns with empty values.",
      },
      {
        question: "What is the fastest way to check CSV upload readiness?",
        answer: "Use CSV Validator to detect row-width mismatches, then CSV Column Mapper to align headers.",
      },
      {
        question: "Can I work with large CSV files?",
        answer: "These tools run in-browser, so capacity depends on your device memory. Split files if needed.",
      },
    ],
  },
  "json-tools": {
    slug: "json-tools",
    title: "JSON Tools",
    metaTitle: "JSON Tools for Formatting, Validation, and Extraction",
    metaDescription:
      "Format, validate, minify, flatten, and query JSON with practical browser tools for developers and analysts.",
    intro:
      "JSON appears in nearly every modern workflow, from API responses and webhook events to config files and analytics payloads. The problem is not access to JSON; it is making complex payloads readable, trustworthy, and ready for downstream use. This hub focuses on practical tasks developers and analysts perform daily: validating syntax before deployment, formatting payloads for reviews, minifying output for transport, flattening nested objects for table-based analysis, and extracting specific fields when debugging large responses. It also includes conversion tools that move JSON into CSV when business teams need spreadsheet outputs instead of nested objects. Everything is built for direct paste-and-go usage with clear results, copy actions, and downloadable output. If your team touches APIs, event streams, or integration payloads, these tools help cut through noisy raw JSON and turn it into data you can inspect, share, and use with confidence. It is built for day-to-day operational use, not one-off demos, so workflows stay fast and repeatable.",
    usedFor: [
      "Debugging API responses and webhook payloads.",
      "Preparing nested JSON for BI and spreadsheet analysis.",
      "Generating schemas and extracting precise fields from large objects.",
    ],
    popularTasks: [
      "Validate JSON before saving config changes.",
      "Minify JSON payloads for transport efficiency.",
      "Extract one nested field using JSON path syntax.",
      "Convert NDJSON event streams to CSV for reporting.",
    ],
    toolSlugs: toolsByCategory("json-tools").map((tool) => tool.slug),
    relatedCategoryLinks: [
      { href: "/tools/csv-tools", label: "CSV Tools" },
      { href: "/tools/developer-data-tools", label: "Developer Data Tools" },
      { href: "/tools/data-cleaning-tools", label: "Data Cleaning Tools" },
    ],
    relatedGuideSlugs: [
      "how-to-convert-json-to-csv",
      "how-to-flatten-json",
    ],
    faq: [
      {
        question: "Which JSON tools are best for API debugging?",
        answer: "Use JSON Validator and JSON Formatter first, then JSON Path Extractor for targeted field checks.",
      },
      {
        question: "How do I move JSON data into spreadsheets?",
        answer: "Use JSON to CSV or JSON Flatten to CSV depending on whether your payload is nested.",
      },
      {
        question: "Can I inspect JWT payloads here too?",
        answer: "Yes. JWT Decoder is included in this hub and decodes header/payload into readable JSON.",
      },
      {
        question: "Do these tools modify key order?",
        answer: "Formatting tools preserve parsed structure, while conversion tools generate output based on discovered keys.",
      },
    ],
  },
  "data-cleaning-tools": {
    slug: "data-cleaning-tools",
    title: "Data Cleaning Tools",
    metaTitle: "Data Cleaning Tools for CSV and Text Preparation",
    metaDescription:
      "Clean messy exports by removing duplicates, validating structure, normalizing fields, and preparing data for import.",
    intro:
      "Most analysis and import failures start with preventable input problems: duplicate records, inconsistent casing, malformed rows, mixed header names, and empty values from upstream exports. This data cleaning hub is focused on those pre-processing steps that save the most time later. Instead of manually fixing rows in spreadsheets, you can normalize and deduplicate CSV files, validate structure before import, merge partial datasets, split oversized files into manageable chunks, and clean supporting text lists such as IDs or emails. These tools are useful for analysts preparing reports, operations teams loading systems, and developers who need predictable input for automation pipelines. The objective is straightforward: reduce manual cleanup work, catch issues earlier, and produce import-ready files that behave consistently across tools. If your workflow depends on reliable source data, this category gives you a faster and more repeatable cleanup path. It also makes team handoffs cleaner by standardizing data quality checks before imports happen.",
    usedFor: [
      "Fixing import errors caused by malformed rows and mismatched headers.",
      "Normalizing and deduplicating datasets before analysis.",
      "Preparing large files for staged upload or downstream automation.",
    ],
    popularTasks: [
      "Remove duplicate rows from CSV exports.",
      "Validate row widths before loading into a database.",
      "Merge two partial CSV datasets and align columns.",
      "Split oversized CSVs into manageable chunks.",
    ],
    toolSlugs: [
      "csv-cleaner",
      "csv-validator",
      "csv-merge-tool",
      "csv-splitter",
      "remove-duplicate-lines",
      "remove-empty-lines",
      "remove-extra-spaces",
      "sort-lines-alphabetically",
      "reverse-text",
      "extract-emails",
      "extract-urls",
      "extract-numbers",
      "word-counter",
      "case-converter",
      "remove-line-breaks",
      "character-counter",
      "slug-generator",
      "text-diff-checker",
      "lorem-ipsum-generator",
    ].filter((slug) => Boolean(toolsBySlug[slug])),
    relatedCategoryLinks: [
      { href: "/tools/csv-tools", label: "CSV Tools" },
      { href: "/tools/json-tools", label: "JSON Tools" },
      { href: "/tools/developer-data-tools", label: "Developer Data Tools" },
    ],
    relatedGuideSlugs: ["how-to-clean-csv-data", "how-to-import-csv-into-sql"],
    faq: [
      {
        question: "Should I clean data before converting formats?",
        answer: "Yes. Cleaning first usually prevents downstream conversion and import errors.",
      },
      {
        question: "Can I combine cleaning with validation?",
        answer: "Yes. Use CSV Cleaner for normalization, then CSV Validator for structural checks.",
      },
      {
        question: "What if files are too large to handle at once?",
        answer: "Use CSV Splitter to create smaller chunks, process them, then merge as needed.",
      },
    ],
  },
  "developer-data-tools": {
    slug: "developer-data-tools",
    title: "Developer Data Tools",
    metaTitle: "Developer Data Tools for Encoding, Parsing, SQL, and Debugging",
    metaDescription:
      "Fast developer-focused utilities for JWT decoding, hashing, SQL cleanup, URL parsing, regex testing, and timestamp conversion.",
    intro:
      "Developer workflows are full of small, repetitive data tasks that interrupt focus: decoding a token, checking a hash, formatting SQL, parsing a callback URL, testing a regex, or converting timestamps between systems. This hub brings those transformations into one practical workspace so engineering teams can troubleshoot faster without jumping between scripts and browser tabs. It is designed for backend and frontend developers, QA engineers, and data engineers who need deterministic output with minimal setup. Use these tools to inspect auth payloads, normalize encoded values, validate schedule syntax, convert date formats, and prepare structured data during integration work or incident response. Most tools run fully in-browser and are optimized for quick copy and download actions. If you often perform utility transformations while coding, reviewing logs, or debugging integrations, this category is built to reduce friction and keep workflow momentum. It is especially useful during production incidents where fast, reliable utilities reduce investigation time.",
    usedFor: [
      "Debugging auth tokens, encoded values, and URL/query data.",
      "Formatting and minifying SQL in development pipelines.",
      "Converting date/time formats and validating cron schedules.",
    ],
    popularTasks: [
      "Decode JWT claims during auth troubleshooting.",
      "Generate SHA hashes for deterministic checks.",
      "Format SQL before code review.",
      "Parse callback URLs and query params during integration debugging.",
    ],
    toolSlugs: toolsByCategory("developer-tools").map((tool) => tool.slug),
    relatedCategoryLinks: [
      { href: "/tools/json-tools", label: "JSON Tools" },
      { href: "/tools/csv-tools", label: "CSV Tools" },
      { href: "/tools/data-cleaning-tools", label: "Data Cleaning Tools" },
    ],
    relatedGuideSlugs: ["how-to-import-csv-into-sql", "how-to-flatten-json"],
    faq: [
      {
        question: "Are these tools safe for quick production debugging?",
        answer: "They are useful for inspection and formatting, but always verify critical outputs in your codebase and tests.",
      },
      {
        question: "Do these tools run client-side?",
        answer: "Most transformations are client-side. AI features, if enabled, use explicit API calls.",
      },
      {
        question: "Can I chain tools in one workflow?",
        answer: "Yes. For example, parse URL data, decode tokens, then format JSON or SQL outputs in sequence.",
      },
      {
        question: "Which tools are best for backend debugging?",
        answer: "Start with JWT Decoder, Hash Generator, URL Parser, SQL Formatter, and Timestamp Converter.",
      },
    ],
  },
};

export function toolsCategoryCanonical(slug: ToolsCategorySeoSlug): string {
  return `/tools/${slug}`;
}

export function toolsCategoryAbsoluteUrl(slug: ToolsCategorySeoSlug): string {
  return absoluteUrl(toolsCategoryCanonical(slug));
}
