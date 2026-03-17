import type { ToolCategorySlug, ToolDefinition } from "@/lib/types";

export const tools: ToolDefinition[] = [
  {
    slug: "csv-to-json",
    title: "CSV to JSON Converter",
    shortDescription: "Convert CSV rows into structured JSON objects for apps and APIs.",
    tags: ["csv", "json", "converter", "spreadsheet", "data transformation"],
    intro:
      "Convert CSV files into JSON objects that are easier to consume in JavaScript applications, API fixtures, and automation scripts. The converter reads the first row as field names, maps each data row to an object, and returns clean JSON output you can copy or download.",
    howToUse: [
      "Paste CSV content with a header row in line one.",
      "Click Transform to parse rows and create JSON objects.",
      "Review the output, then copy it or download a `.json` file.",
    ],
    exampleInput: "name,email\nAna,ana@example.com",
    exampleOutput: '[\n  {\n    "name": "Ana",\n    "email": "ana@example.com"\n  }\n]',
    whyUseful:
      "This is useful when spreadsheet exports need to become API seed data, mock payloads, or JSON fixtures in development.",
    commonMistakes: [
      "Using CSV without a header row, which causes unclear output keys.",
      "Leaving inconsistent column counts across rows, which can create missing values.",
      "Forgetting to clean duplicate or empty rows before conversion.",
    ],
    faq: [
      { question: "Does this support headers?", answer: "Yes. First CSV row is used as object keys." },
      { question: "Can I download output?", answer: "Yes, download button exports JSON." },
      {
        question: "How are missing column values handled?",
        answer: "Missing cells are returned as empty strings so each object keeps a consistent shape.",
      },
    ],
    related: ["json-formatter", "csv-cleaner", "csv-to-sql", "json-validator"],
    kind: "standard",
    categories: ["csv-tools", "json-tools", "spreadsheet-tools"],
    createdAt: "2026-03-01",
    outputFileName: "converted.json",
    outputMimeType: "application/json",
  },
  {
    slug: "json-to-csv",
    title: "JSON to CSV Converter",
    shortDescription:
      "Convert a JSON array of objects into spreadsheet-ready CSV instantly. Free online JSON to CSV converter for Excel, Google Sheets, and data exports.",
    tags: [
      "json to csv converter",
      "json to csv",
      "convert json to csv",
      "free json to csv converter",
      "how to convert json to csv",
      "spreadsheet export",
    ],
    intro:
      "Convert a JSON array of objects into spreadsheet-ready CSV. This is useful for API responses, exports, and quick analysis in Excel or Google Sheets. If your JSON contains nested objects or arrays, flatten JSON first so each value maps to a clean column.",
    howToUse: [
      "Paste a valid JSON array of objects.",
      "Check that all records use the fields you expect.",
      "Run the conversion.",
      "Review the generated header row and values.",
      "Copy or download the CSV.",
    ],
    exampleInput:
      '[\n  { "name": "Ana", "email": "ana@example.com", "age": 28 },\n  { "name": "Bob", "email": "bob@example.com", "age": 34 }\n]',
    exampleOutput: "name,email,age\nAna,ana@example.com,28\nBob,bob@example.com,34",
    exampleNotes: [
      "Keys become column headers.",
      "Each object becomes one CSV row.",
      "Missing keys become empty cells.",
    ],
    whyUseful:
      "Useful when you need to convert API JSON into CSV quickly for spreadsheet review, team sharing, or import into CSV-based systems.",
    commonMistakes: [
      "Pasting a single JSON object instead of an array of objects.",
      "Using invalid JSON syntax (missing quotes, commas, or brackets).",
      "Expecting nested objects to flatten automatically.",
      "Using inconsistent keys across objects and misreading empty cells.",
      "Pasting NDJSON (one object per line) instead of a JSON array.",
    ],
    faq: [
      {
        question: "What JSON format does this converter accept?",
        answer: "It expects a non-empty JSON array of objects, for example `[{\"name\":\"Ana\"},{\"name\":\"Bob\"}]`.",
      },
      {
        question: "Can I convert a single JSON object to CSV?",
        answer: "Yes. Wrap it in an array first, for example `[{\"name\":\"Ana\"}]`.",
      },
      {
        question: "How are missing keys handled?",
        answer: "If an object is missing a key that exists in the header set, that row gets an empty CSV cell for that column.",
      },
      {
        question: "Can this convert nested JSON?",
        answer: "Not directly into separate columns. Use JSON Flatten / JSON to CSV first for nested payloads.",
      },
      {
        question: "Why did my JSON to CSV conversion fail?",
        answer: "Typical causes are invalid JSON, using a single object instead of an array, or including non-object values in the array.",
      },
      {
        question: "Is this JSON to CSV converter free?",
        answer: "Yes, it is free to use.",
      },
      {
        question: "Does this run in the browser?",
        answer: "Yes. Conversion runs entirely in your browser.",
      },
      {
        question: "Can I open the output in Excel or Google Sheets?",
        answer: "Yes. The generated CSV is compatible with Excel, Google Sheets, and most CSV import workflows.",
      },
    ],
    related: ["json-flatten-to-csv", "csv-to-json", "json-validator", "json-formatter", "ndjson-to-csv"],
    kind: "standard",
    categories: ["csv-tools", "json-tools", "spreadsheet-tools"],
    createdAt: "2026-03-02",
    outputFileName: "converted.csv",
    outputMimeType: "text/csv",
  },
  {
    slug: "csv-to-sql",
    title: "CSV to SQL Generator",
    shortDescription: "Generate CREATE TABLE and INSERT statements from CSV data.",
    tags: [
      "csv to sql",
      "csv to insert statements",
      "csv to mysql insert",
      "csv to postgres insert",
      "sql generator",
      "database",
    ],
    intro:
      "Convert CSV input into SQL schema and INSERT statements with editable column names, inferred data types, and dialect-specific output.",
    howToUse: [
      "Paste CSV data or upload a CSV file.",
      "Detect columns, adjust table name, column names, and data types if needed.",
      "Choose SQL dialect and output mode, then generate and copy/download SQL.",
    ],
    exampleInput:
      "id,name,email,active,created_at\n1,Ana,ana@example.com,true,2024-01-05\n2,Bob,bob@example.com,false,2024-01-06",
    exampleOutput:
      "CREATE TABLE \"imported_data\" (\n  \"id\" INTEGER,\n  \"name\" TEXT,\n  \"email\" TEXT,\n  \"active\" BOOLEAN,\n  \"created_at\" DATE\n);\n\nINSERT INTO \"imported_data\" (\"id\", \"name\", \"email\", \"active\", \"created_at\")\nVALUES\n(1, 'Ana', 'ana@example.com', TRUE, '2024-01-05'),\n(2, 'Bob', 'bob@example.com', FALSE, '2024-01-06');",
    whyUseful:
      "Speeds up database imports and seed script creation when moving spreadsheet data into SQL systems.",
    faq: [
      { question: "Can I generate INSERT-only SQL?", answer: "Yes. Switch output mode to INSERT statements only." },
      { question: "Does this support PostgreSQL and MySQL?", answer: "Yes. You can choose Generic, PostgreSQL, MySQL, or SQLite output." },
    ],
    related: ["csv-cleaner", "csv-to-json", "json-flatten-to-csv"],
    kind: "standard",
    categories: ["csv-tools", "developer-tools", "spreadsheet-tools"],
    createdAt: "2026-03-19",
    outputFileName: "generated.sql",
    outputMimeType: "text/sql",
  },
  {
    slug: "json-flatten-to-csv",
    title: "JSON Flatten / JSON to CSV",
    shortDescription: "Flatten nested JSON into dot-notation fields and convert to CSV.",
    tags: [
      "flatten json",
      "nested json to csv",
      "json to table",
      "json flatten online",
      "json to csv",
      "data conversion",
    ],
    intro:
      "Flatten nested JSON objects into dot-notation keys and export the result as flattened JSON or CSV for tabular workflows.",
    howToUse: [
      "Paste nested JSON or upload a JSON file.",
      "Choose output mode: flattened JSON or CSV.",
      "Transform data, preview rows, then copy/download the output.",
    ],
    exampleInput:
      '{"user":{"name":"Ana","address":{"city":"Melbourne"}},"roles":["admin","editor"]}',
    exampleOutput:
      '{\n  "user.name": "Ana",\n  "user.address.city": "Melbourne",\n  "roles": "[\\"admin\\",\\"editor\\"]"\n}',
    whyUseful:
      "Makes nested API payloads easier to analyze in spreadsheets and BI tools by producing tabular-friendly columns.",
    faq: [
      { question: "How are arrays handled when flattening JSON?", answer: "Arrays are preserved as JSON strings in a single flattened field by default." },
      { question: "Can I export both flattened JSON and CSV?", answer: "Yes. The tool provides copy and download actions for both outputs." },
    ],
    related: ["json-to-csv", "json-formatter", "csv-to-sql"],
    kind: "standard",
    categories: ["json-tools", "developer-tools", "spreadsheet-tools"],
    createdAt: "2026-03-20",
    outputFileName: "flattened.csv",
    outputMimeType: "text/csv",
  },
  {
    slug: "csv-cleaner",
    title: "CSV Cleaner",
    shortDescription: "Clean and normalize messy CSV with deterministic data-cleaning options.",
    tags: ["csv cleaner", "clean csv online", "deduplicate csv", "normalize csv data", "spreadsheet"],
    intro:
      "Clean inconsistent CSV files by trimming cells, removing empty rows/columns, deduplicating records, and normalizing header and contact fields.",
    howToUse: [
      "Paste CSV content or upload a CSV file.",
      "Choose cleaning options like deduplication, header normalization, and contact normalization.",
      "Run the cleaner, review stats/table preview, then copy or download cleaned CSV.",
    ],
    exampleInput: " Full Name , Email , Phone \n Ana Doe , ANA@Example.com , +61 (412) 555-009 \n Ana Doe , ANA@Example.com , +61 (412) 555-009 \n , , ",
    exampleOutput: "full_name,email,phone\nAna Doe,ana@example.com,+61412555009",
    whyUseful: "Prepares CSV data for imports, analytics, and automation by fixing common formatting issues fast.",
    faq: [
      { question: "Can this deduplicate repeated rows?", answer: "Yes. Enable deduplicate rows to keep one instance of each record." },
      { question: "Can it normalize emails and phone values?", answer: "Yes. Optional toggles lower-case emails and apply basic phone normalization." },
    ],
    related: ["csv-validator", "csv-viewer", "csv-to-json", "csv-to-sql"],
    kind: "standard",
    categories: ["csv-tools", "spreadsheet-tools"],
    createdAt: "2026-03-21",
    outputFileName: "cleaned.csv",
    outputMimeType: "text/csv",
  },
  {
    slug: "csv-column-mapper",
    title: "CSV Column Mapper",
    shortDescription: "Rename CSV headers using simple source:target mapping rules.",
    tags: ["csv column mapper", "rename csv headers", "csv mapping", "csv import prep"],
    intro:
      "Map old CSV column names to new headers before importing into another system.",
    howToUse: [
      "Add mapping rules at the top using source:target format, separated by commas or new lines.",
      "Leave one blank line after mapping rules, then paste CSV data.",
      "Click Transform to generate CSV with renamed headers.",
    ],
    exampleInput:
      "name:full_name,email:email_address\n\nname,email,city\nAna,ana@example.com,Melbourne",
    exampleOutput:
      "full_name,email_address,city\nAna,ana@example.com,Melbourne",
    whyUseful:
      "Helps match target-system schema requirements when importing CSV files from different sources.",
    faq: [
      { question: "What format should mapping rules use?", answer: "Use source:target, for example name:full_name." },
      { question: "Do unmapped headers stay the same?", answer: "Yes. Only mapped headers are renamed." },
    ],
    related: ["csv-cleaner", "csv-validator", "csv-to-sql", "json-to-csv"],
    kind: "standard",
    categories: ["csv-tools", "spreadsheet-tools"],
    createdAt: "2026-03-22",
    outputFileName: "mapped.csv",
    outputMimeType: "text/csv",
  },
  {
    slug: "csv-validator",
    title: "CSV Validator",
    shortDescription: "Check CSV structure for inconsistent rows.",
    tags: ["csv", "validator", "data quality", "spreadsheet"],
    intro:
      "Validate CSV structural integrity by checking that each row has the expected column count. This helps catch import-breaking issues before data reaches your CRM, warehouse, or script.",
    howToUse: [
      "Paste CSV content including the header row.",
      "Click Transform to run row-width validation.",
      "Review any row-numbered errors and fix the source file before importing.",
    ],
    exampleInput: "id,name,email\n1,Ana,ana@example.com\n2,Bob",
    exampleOutput: "CSV has structural issues:\nRow 3: expected 3 columns, found 2.",
    whyUseful: "Finds row-shape errors early so bulk imports do not fail halfway through processing.",
    faq: [
      { question: "Does it validate data types?", answer: "No, it validates CSV structure." },
      { question: "Will it report row numbers?", answer: "Yes, each issue includes the row number." },
    ],
    related: ["csv-cleaner", "csv-viewer", "csv-to-json", "json-validator"],
    kind: "standard",
    categories: ["csv-tools", "spreadsheet-tools"],
    createdAt: "2026-03-04",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    shortDescription: "Beautify JSON with indentation.",
    tags: ["json", "formatter", "beautify", "developer"],
    intro:
      "Format compact or minified JSON into readable, consistently indented output. This helps when reviewing API payloads, configuration files, and logs that are hard to scan in one-line form.",
    howToUse: [
      "Paste JSON into the input box.",
      "Click Transform to validate and pretty-print the payload.",
      "Copy the formatted JSON or continue into related tools.",
    ],
    exampleInput: '{"name":"Ana","active":true}',
    exampleOutput: '{\n  "name": "Ana",\n  "active": true\n}',
    whyUseful:
      "Readable JSON reduces debugging time and makes payload reviews easier in pull requests, docs, and incident analysis.",
    commonMistakes: [
      "Pasting JavaScript-style objects with trailing commas or single quotes.",
      "Expecting formatter output to fix schema or business-logic errors.",
      "Formatting only one branch of a payload and missing nested issues elsewhere.",
    ],
    faq: [
      { question: "Does this validate JSON too?", answer: "Yes. Invalid JSON returns an error." },
      { question: "Will key order change?", answer: "No, existing key order is preserved." },
      {
        question: "Can I use this before minifying?",
        answer: "Yes. A common workflow is format for review, validate, then minify for transport.",
      },
    ],
    related: ["json-validator", "json-minifier", "json-flatten-to-csv", "csv-to-json"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-03-05",
  },
  {
    slug: "json-validator",
    title: "JSON Validator",
    shortDescription: "Validate JSON syntax instantly.",
    tags: ["json", "validator", "syntax", "developer"],
    intro:
      "Validate JSON syntax before sending data to APIs, config loaders, or downstream transformations. The validator gives fast pass/fail feedback so you can catch malformed payloads early.",
    howToUse: [
      "Paste JSON input into the editor.",
      "Click Transform to run syntax validation.",
      "Read the result and fix any parsing errors before proceeding.",
    ],
    exampleInput: '{"name":"Ana"}',
    exampleOutput: "Valid JSON.",
    whyUseful:
      "Early syntax validation prevents avoidable parser failures in production services, automation jobs, and deployment pipelines.",
    commonMistakes: [
      "Assuming valid syntax means the data also matches your schema.",
      "Overlooking quote, comma, or bracket mismatches in long payloads.",
      "Validating fragments that are not complete JSON documents.",
    ],
    faq: [
      { question: "Do you fix invalid JSON?", answer: "No, this tool validates and reports errors." },
      { question: "Can large files be checked?", answer: "Yes, if your browser can load them." },
      {
        question: "Does validation include business rules?",
        answer: "No. This checks syntax only. Use JSON Schema Generator for structure planning.",
      },
    ],
    related: ["json-formatter", "json-minifier", "csv-to-json", "json-schema-generator"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-03-06",
  },
  {
    slug: "json-minifier",
    title: "JSON Minifier",
    shortDescription: "Compress JSON by removing whitespace.",
    tags: ["json", "minifier", "compress", "developer"],
    intro:
      "Minify JSON by removing non-essential whitespace while preserving data values. This is useful when payload size matters for requests, embedded configs, or storage constraints.",
    howToUse: [
      "Paste valid JSON.",
      "Click Transform to generate compact output.",
      "Copy or download the minified JSON for use in your workflow.",
    ],
    exampleInput: '{\n  "name": "Ana"\n}',
    exampleOutput: '{"name":"Ana"}',
    whyUseful:
      "Smaller JSON payloads reduce transfer overhead and keep configuration blobs compact without changing semantics.",
    commonMistakes: [
      "Trying to minify invalid JSON that should be validated first.",
      "Minifying before review, which makes debugging harder.",
      "Assuming minification performs compression beyond whitespace removal.",
    ],
    faq: [
      { question: "Does it change data?", answer: "No, only formatting whitespace is removed." },
      { question: "Can I download output?", answer: "Yes. Download as JSON is supported." },
      {
        question: "Should I validate before minifying?",
        answer: "Yes. Run JSON Validator first when data comes from unknown or user-provided sources.",
      },
    ],
    related: ["json-formatter", "json-validator", "json-to-csv", "json-schema-generator"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-03-07",
    outputFileName: "minified.json",
    outputMimeType: "application/json",
  },
  {
    slug: "json-schema-generator",
    title: "JSON Schema Generator",
    shortDescription: "Generate a JSON Schema draft from sample JSON input.",
    tags: ["json schema generator", "json schema from json", "schema inference", "developer"],
    intro:
      "Create a draft JSON Schema from sample JSON to document and validate API payload structures.",
    howToUse: [
      "Paste a JSON object or array as sample input.",
      "Click Transform to infer a schema.",
      "Copy or download the generated schema JSON.",
    ],
    exampleInput:
      '{"id":1,"name":"Ana","active":true,"tags":["admin"],"profile":{"city":"Melbourne"}}',
    exampleOutput:
      '{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "properties": {\n    "id": {\n      "type": "integer"\n    },\n    "name": {\n      "type": "string"\n    }\n  },\n  "required": [\n    "id",\n    "name"\n  ]\n}',
    whyUseful:
      "Speeds up schema documentation, payload validation setup, and API contract communication.",
    faq: [
      { question: "Can this infer nested objects and arrays?", answer: "Yes. Nested values are represented in the generated schema." },
      { question: "Which JSON Schema draft is used?", answer: "The output includes Draft-07 schema metadata." },
    ],
    related: ["json-formatter", "json-validator", "json-minifier", "ndjson-to-csv"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-03-23",
    outputFileName: "schema.json",
    outputMimeType: "application/json",
  },
  {
    slug: "ndjson-to-csv",
    title: "NDJSON to CSV Converter",
    shortDescription: "Convert newline-delimited JSON records into CSV columns.",
    tags: ["ndjson to csv", "json lines", "logs to csv", "event export"],
    intro:
      "Convert JSON Lines (NDJSON) data into CSV for spreadsheet analysis and exports.",
    howToUse: [
      "Paste one JSON object per line.",
      "Click Transform to parse lines and build CSV headers.",
      "Copy or download the generated CSV output.",
    ],
    exampleInput:
      '{"id":1,"event":"signup","meta":{"plan":"pro"}}\n{"id":2,"event":"login"}',
    exampleOutput:
      'id,event,meta\n1,signup,"{\\"plan\\":\\"pro\\"}"\n2,login,',
    whyUseful:
      "Useful for converting log streams and analytics events into tabular files for quick reporting.",
    faq: [
      { question: "What NDJSON format is expected?", answer: "Each non-empty line must be a valid JSON object." },
      { question: "How are nested objects handled?", answer: "Nested values are serialized as JSON strings in CSV cells." },
    ],
    related: ["json-to-csv", "json-flatten-to-csv", "csv-cleaner", "json-schema-generator"],
    kind: "standard",
    categories: ["json-tools", "csv-tools", "developer-tools"],
    createdAt: "2026-03-24",
    outputFileName: "converted.csv",
    outputMimeType: "text/csv",
  },
  {
    slug: "remove-duplicate-lines",
    title: "Remove Duplicate Lines",
    shortDescription: "Keep unique lines while preserving order.",
    tags: ["text", "duplicate", "cleanup", "lines"],
    intro:
      "Remove repeated lines from plain text while keeping the first occurrence and original order. This is useful for cleanup tasks where duplicates create noise in lists, exports, and logs.",
    howToUse: [
      "Paste plain text with one item per line.",
      "Click Transform to remove repeated lines.",
      "Copy the cleaned list and reuse it in your workflow.",
    ],
    exampleInput: "ana@example.com\nbob@example.com\nana@example.com\nwarning: retrying request\nwarning: retrying request",
    exampleOutput: "ana@example.com\nbob@example.com\nwarning: retrying request",
    whyUseful: "Cuts noise from repeated records before sharing, importing, or further processing.",
    faq: [
      { question: "Is original order preserved?", answer: "Yes. First appearance order is kept." },
      { question: "Case-sensitive?", answer: "Yes. 'A' and 'a' are treated as different lines." },
    ],
    related: ["remove-empty-lines", "remove-extra-spaces", "sort-lines-alphabetically", "extract-emails"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-08",
  },
  {
    slug: "sort-lines-alphabetically",
    title: "Sort Lines Alphabetically",
    shortDescription: "Sort multiline text in alphabetical order.",
    tags: ["text", "sort", "alphabetical", "lines"],
    intro:
      "Sort newline-separated text entries into alphabetical order so lists are easier to scan, compare, and diff in reviews.",
    howToUse: [
      "Paste text with one value per line.",
      "Click Transform to sort lines alphabetically.",
      "Copy the sorted output for documents, imports, or audits.",
    ],
    exampleInput: "zeta-feature\nalpha-feature\nbeta-feature\nalpha-feature",
    exampleOutput: "alpha-feature\nalpha-feature\nbeta-feature\nzeta-feature",
    whyUseful: "Makes large text lists easier to inspect and combine with deduplication workflows.",
    faq: [
      { question: "Is sorting case-sensitive?", answer: "Sorting is case-insensitive." },
      { question: "Will blank lines stay?", answer: "Yes, blank lines are included in sorting." },
    ],
    related: ["remove-empty-lines", "remove-duplicate-lines", "remove-extra-spaces", "extract-emails"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-09",
  },
  {
    slug: "extract-emails",
    title: "Extract Emails from Text",
    shortDescription: "Find and list emails from any text block.",
    tags: ["text", "email", "extract", "parser"],
    intro:
      "Scan mixed text and pull out email addresses into a clean newline list. Useful when emails are buried in logs, notes, support threads, or export dumps.",
    howToUse: [
      "Paste raw text containing one or many email addresses.",
      "Click Transform to extract detected emails.",
      "Copy the resulting email list for outreach, cleanup, or review.",
    ],
    exampleInput: "Owner: ana@example.com; backup: ops@company.io; invalid: test@",
    exampleOutput: "ana@example.com\nops@company.io",
    whyUseful: "Saves manual scanning time when you need reliable email extraction from unstructured text.",
    faq: [
      { question: "Are duplicates removed?", answer: "Yes. Output includes unique addresses." },
      { question: "What if none found?", answer: "Tool returns 'No emails found.'" },
    ],
    related: ["extract-urls", "extract-numbers", "remove-duplicate-lines", "sort-lines-alphabetically"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-10",
  },
  {
    slug: "extract-numbers",
    title: "Extract Numbers from Text",
    shortDescription: "Pull numeric values from mixed text.",
    tags: ["text", "numbers", "extract", "parser"],
    intro:
      "Extract integer and decimal values from mixed content such as logs, notes, invoices, and free-form messages.",
    howToUse: [
      "Paste text containing embedded numeric values.",
      "Click Transform to isolate numbers.",
      "Copy the extracted values for analysis or cleanup.",
    ],
    exampleInput: "Invoice #2041: subtotal 49.95, tax 4.99, total 54.94, refund -10",
    exampleOutput: "2041\n49.95\n4.99\n54.94\n-10",
    whyUseful: "Useful for quick numeric extraction before spreadsheet analysis or anomaly checks.",
    faq: [
      { question: "Does it support decimals?", answer: "Yes. Decimal values are extracted." },
      { question: "Are negative numbers supported?", answer: "Yes." },
    ],
    related: ["extract-urls", "extract-emails", "remove-duplicate-lines", "sort-lines-alphabetically"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-11",
  },
  {
    slug: "character-counter",
    title: "Character Counter",
    shortDescription: "Count characters, words, and lines in text input.",
    tags: ["character counter", "word count", "text statistics", "text tools"],
    intro:
      "Count characters, non-whitespace characters, words, and lines from plain text so you can quickly validate content length limits.",
    howToUse: [
      "Paste your text into the input area.",
      "Click Transform to generate text statistics.",
      "Review the JSON output for character, word, and line counts.",
    ],
    exampleInput: "Release notes for sprint 12.\nFixes: login timeout, CSV import error.",
    exampleOutput:
      '{\n  "characters": 68,\n  "charactersExcludingSpaces": 58,\n  "words": 10,\n  "lines": 2\n}',
    whyUseful:
      "Useful when preparing social posts, meta descriptions, commit messages, and text fields with strict length limits.",
    commonMistakes: [
      "Assuming spaces are excluded from the default character count.",
      "Comparing counts across tools that handle newline characters differently.",
      "Expecting punctuation to be ignored in word counts.",
    ],
    faq: [
      { question: "Does Character Counter include spaces in character count?", answer: "Yes. `characters` includes spaces and punctuation." },
      { question: "Does Character Counter count line breaks?", answer: "Yes. Newline characters are included in the total character count." },
      { question: "What is charactersExcludingSpaces?", answer: "It removes all whitespace characters so you can measure compact text length." },
    ],
    related: ["word-counter", "case-converter", "slug-generator", "text-diff-checker"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-04-07",
    outputFileName: "character-count.json",
    outputMimeType: "application/json",
  },
  {
    slug: "slug-generator",
    title: "Slug Generator",
    shortDescription: "Convert text into clean URL-friendly slugs.",
    tags: ["slug generator", "url slug", "seo", "text tools"],
    intro:
      "Generate lowercase, URL-safe slugs from titles and phrases by removing punctuation and replacing spacing with hyphens.",
    howToUse: [
      "Paste a title or phrase.",
      "Click Transform to generate a slug.",
      "Copy the slug for routes, blog URLs, or content systems.",
    ],
    exampleInput: "How to Import CSV into SQL (Step-by-Step)",
    exampleOutput: "how-to-import-csv-into-sql-step-by-step",
    whyUseful:
      "Helps produce consistent URL paths for CMS entries, documentation pages, and SEO-friendly internal routes.",
    commonMistakes: [
      "Expecting uppercase letters to be preserved in slugs.",
      "Pasting only symbols, which can produce an empty slug.",
      "Assuming every locale-specific character maps perfectly without review.",
    ],
    faq: [
      { question: "Does Slug Generator remove punctuation?", answer: "Yes. Non-alphanumeric characters are removed or replaced with hyphens." },
      { question: "Can Slug Generator handle accented characters?", answer: "Yes. Common accented characters are normalized before slug generation." },
      { question: "Why did I get an empty slug?", answer: "Input with only symbols or whitespace cannot form a valid slug." },
    ],
    related: ["character-counter", "url-encoder", "remove-duplicate-lines", "random-string-generator"],
    kind: "standard",
    categories: ["text-tools", "developer-tools"],
    createdAt: "2026-04-08",
  },
  {
    slug: "text-diff-checker",
    title: "Text Diff Checker",
    shortDescription: "Compare two text blocks and see lines that changed.",
    tags: ["text diff checker", "compare text", "line diff", "developer tools"],
    intro:
      "Compare two text blocks line-by-line to identify lines that appear only in the first input, only in the second input, or in both.",
    howToUse: [
      "Paste the first text block.",
      "Leave a blank line, then paste the second text block.",
      "Click Transform to view grouped line differences.",
    ],
    exampleInput:
      "name,email\nAna,ana@example.com\nBob,bob@example.com\n\nname,email\nAna,ana@example.com\nCam,cam@example.com",
    exampleOutput:
      "First input lines: 3\n\nSecond input lines: 3\n\nOnly in first input:\n- Bob,bob@example.com\n\nOnly in second input:\n- Cam,cam@example.com\n\nIn both inputs:\n- name,email\n- Ana,ana@example.com",
    whyUseful:
      "Useful for quick diff checks on config files, exports, and list changes without opening a full code diff tool.",
    commonMistakes: [
      "Forgetting the blank line separator between the two inputs.",
      "Expecting character-level highlighting when this tool compares by line.",
      "Assuming reordered lines are treated as unchanged in the same section.",
    ],
    faq: [
      { question: "Does Text Diff Checker compare by line or character?", answer: "It compares by line, not by character." },
      { question: "How do I separate the two inputs?", answer: "Use one blank line between the first and second text blocks." },
      { question: "Does Text Diff Checker keep duplicate lines?", answer: "Yes. It compares line presence and reports section membership." },
    ],
    related: ["remove-duplicate-lines", "sort-lines-alphabetically", "csv-validator", "character-counter"],
    kind: "standard",
    categories: ["text-tools", "developer-tools"],
    createdAt: "2026-04-09",
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    shortDescription:
      "Generate strong passwords with selectable length and character sets (uppercase, lowercase, numbers, symbols).",
    tags: ["password generator", "strong password", "security tools", "developer tools"],
    intro:
      "Generate strong passwords by choosing length and exactly which character sets to include: uppercase letters, lowercase letters, numbers, and symbols.",
    howToUse: [
      "Choose password length (8 to 128).",
      "Select which character sets to include: uppercase, lowercase, numbers, and symbols.",
      "Click Generate Password.",
      "Copy the output and store it in your password manager.",
    ],
    exampleInput:
      "Length: 24\nInclude uppercase: Yes\nInclude lowercase: Yes\nInclude numbers: Yes\nInclude symbols: Yes",
    exampleOutput: "A9!fQ2#kLm7@xP4$wR8&nT1?",
    whyUseful:
      "Provides quick password generation without external tools when provisioning accounts or rotating credentials.",
    commonMistakes: [
      "Choosing a password length that is too short for your policy requirements.",
      "Unchecking too many character sets and reducing password entropy.",
      "Turning off symbols for accounts that require special characters.",
      "Storing generated passwords in plain text notes.",
      "Reusing one generated password across multiple accounts.",
    ],
    faq: [
      { question: "What length does Password Generator support?", answer: "You can generate passwords from 8 to 128 characters." },
      {
        question: "Can I choose which character types to include?",
        answer: "Yes. You can enable or disable uppercase, lowercase, numbers, and symbols.",
      },
      {
        question: "Can I generate a password without symbols?",
        answer: "Yes. Disable symbols if needed, but include enough length and other character types for strength.",
      },
      {
        question: "What happens if I disable all character sets?",
        answer: "Generation will fail because at least one character set must be selected.",
      },
      {
        question: "Will the password include every selected character type?",
        answer: "Yes. If you select uppercase, lowercase, numbers, or symbols, the generated password includes at least one character from each selected set.",
      },
      {
        question: "Are generated passwords random?",
        answer: "Yes. Each click generates a new random password based on your selected options.",
      },
      {
        question: "Can I use this for production credentials?",
        answer: "Yes. Generate here, then store credentials in a secure password manager.",
      },
    ],
    related: ["random-string-generator", "hash-generator", "uuid-generator", "jwt-encoder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-10",
    outputFileName: "password.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "random-string-generator",
    title: "Random String Generator",
    shortDescription: "Generate random alphanumeric strings for test data.",
    tags: ["random string generator", "alphanumeric generator", "test data", "developer tools"],
    intro:
      "Generate random alphanumeric strings for sample data, temporary identifiers, and testing workflows where deterministic format is not required.",
    howToUse: [
      "Leave input empty for a 16-character string, or enter a length from 1 to 512.",
      "Click Transform to generate output.",
      "Copy the random string for your test case or seed data.",
    ],
    exampleInput: "12",
    exampleOutput: "a8F2mK9qT1bZ",
    whyUseful:
      "Helps create quick placeholder values in test payloads, forms, and integration fixtures.",
    commonMistakes: [
      "Using random strings where cryptographic tokens are required.",
      "Assuming alphanumeric output includes symbols by default.",
      "Forgetting to set a fixed length when schema fields are strict.",
    ],
    faq: [
      { question: "Does Random String Generator include symbols?", answer: "No. It generates alphanumeric characters only." },
      { question: "What length range is supported?", answer: "You can request between 1 and 512 characters." },
      { question: "Is this the same as a password generator?", answer: "No. Password Generator includes symbols and stronger complexity by default." },
    ],
    related: ["password-generator", "uuid-generator", "character-counter", "slug-generator"],
    kind: "standard",
    categories: ["developer-tools", "text-tools"],
    createdAt: "2026-04-11",
  },
  {
    slug: "yaml-validator",
    title: "YAML Validator",
    shortDescription: "Validate YAML syntax, catch indentation errors, and troubleshoot line-level issues quickly.",
    tags: ["yaml validator", "validate yaml", "yaml linter", "kubernetes yaml", "config validation"],
    intro:
      "Validate YAML files and catch syntax problems before they break deployments or config loading. This tool flags indentation and parsing issues, helps you identify line-level failures faster, and supports formatter-assisted validation when you need clean, consistent YAML output.",
    howToUse: [
      "Paste YAML input or upload a `.yaml` / `.yml` file.",
      "Optionally enable Format before validate for normalized output.",
      "Run validation and review syntax errors with line-aware hints.",
      "Fix indentation and tabs/spaces issues, then validate again.",
      "Open YAML Formatter for additional cleanup if needed.",
    ],
    exampleInput: "version: 1\nservices:\n  api:\n    image: node:20\n    ports:\n      - 3000:3000",
    exampleOutput: "Valid YAML. No syntax or indentation issues found.",
    whyUseful:
      "Prevents runtime failures caused by malformed YAML in CI pipelines, infrastructure-as-code manifests, and app config files.",
    commonMistakes: [
      "Mixing tabs and spaces in indentation.",
      "Forgetting list item markers (`-`) for sequence values.",
      "Using invalid key-value formatting in nested blocks.",
      "Assuming valid YAML syntax also guarantees schema correctness.",
    ],
    faq: [
      {
        question: "How do I validate YAML online?",
        answer: "Paste YAML or upload a file, run validation, then fix reported syntax and indentation errors.",
      },
      {
        question: "Can this tool catch indentation problems?",
        answer: "Yes. Indentation and nested-block structure errors are surfaced as parse failures.",
      },
      {
        question: "Does this report line-aware YAML errors?",
        answer: "Yes. When parser details are available, line and column hints are shown to speed up fixes.",
      },
      {
        question: "Can I format YAML before validating?",
        answer: "Yes. Enable Format before validate to normalize valid YAML before final checks.",
      },
      {
        question: "What about tabs vs spaces?",
        answer: "YAML is space-sensitive. Tabs frequently cause parse issues, so this tool highlights indentation mistakes.",
      },
      {
        question: "Can I validate Kubernetes YAML manifests?",
        answer: "Yes. It validates YAML syntax used by Kubernetes and other deployment manifests.",
      },
      {
        question: "Does this YAML Validator check schemas?",
        answer: "No. It validates YAML syntax only. Use schema-specific tooling for semantic validation.",
      },
      {
        question: "Does validation run in the browser?",
        answer: "Yes. Validation runs in-browser.",
      },
    ],
    related: ["yaml-formatter", "yaml-to-json", "json-to-yaml", "json-validator", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-12",
  },
  {
    slug: "website-tech-stack-detector",
    title: "Website Tech Stack Detector",
    shortDescription:
      "Detect website technology stack from a URL. Find likely framework, hosting/CDN, analytics, and libraries with confidence and evidence.",
    tags: [
      "website tech stack detector",
      "detect website technology",
      "website built with checker",
      "what tech stack is this site using",
      "tech stack finder",
      "website technology checker",
    ],
    intro:
      "Analyze a live website URL and detect likely technologies from HTML, scripts, headers, and platform fingerprints. This tool is useful for quick competitor research, lead qualification, migration planning, and technical due diligence. It reports likely framework, hosting/CDN, analytics providers, and common UI libraries with confidence levels and evidence.",
    howToUse: [
      "Paste a full URL (for example, https://example.com).",
      "Click Analyze Website to fetch and inspect the page safely.",
      "Review detected technologies grouped by category.",
      "Check evidence lines and confidence before making decisions.",
      "Copy the summary or download the JSON report.",
    ],
    exampleInput: "https://example.com",
    exampleOutput:
      "Likely framework: Next.js\nLikely hosting/CDN: Vercel\nLikely analytics: Google Analytics\n\nEvidence:\n- Found /_next/ asset paths\n- Found x-vercel-id response header\n- Found gtag/js script",
    whyUseful:
      "Gives a fast, self-serve way to estimate what technologies a site is using without running heavy scanners or relying on generic AI guesses.",
    commonMistakes: [
      "Entering a URL without protocol and assuming non-web protocols are supported.",
      "Treating low-confidence detections as guaranteed facts.",
      "Assuming hidden or server-only technologies can always be detected from public HTML/headers.",
      "Expecting detection to work on blocked pages that require login, bot challenges, or JS execution.",
    ],
    faq: [
      {
        question: "How does this website tech stack detector work?",
        answer: "It inspects HTML, script URLs, response headers, meta tags, and common platform fingerprints to infer likely technologies.",
      },
      {
        question: "Is detection always 100% accurate?",
        answer: "No. This is heuristic detection. High-confidence matches are strong signals, while medium/low confidence should be treated as likely or possible.",
      },
      {
        question: "Can this detect server-side technologies that are hidden?",
        answer: "Only if public signals expose them. Fully hidden backend stacks may not be detectable from a single page fetch.",
      },
      {
        question: "What if nothing is detected?",
        answer: "The report still returns best-effort findings and marks detection as inconclusive when strong signals are missing.",
      },
      {
        question: "Does this execute third-party scripts?",
        answer: "No. It only inspects fetched HTML and headers for safety and speed.",
      },
      {
        question: "Can I use this as a website built with checker?",
        answer: "Yes. It is designed for that use case and shows confidence plus evidence for each detected technology.",
      },
    ],
    related: ["json-validator", "url-parser", "query-string-parser", "regex-tester", "timestamp-converter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-05-10",
    outputFileName: "tech-stack-report.json",
    outputMimeType: "application/json",
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    shortDescription: "Count words, characters, lines, and paragraphs in text.",
    tags: ["word counter", "text count", "content length", "text tools"],
    intro:
      "Count words, characters, lines, and paragraphs from plain text so you can validate content limits and writing targets quickly.",
    howToUse: [
      "Paste your text into the input area.",
      "Click Transform to calculate text metrics.",
      "Review the JSON output for words, characters, lines, and paragraphs.",
    ],
    exampleInput: "First paragraph has three words.\n\nSecond paragraph has four words now.",
    exampleOutput:
      '{\n  "words": 11,\n  "characters": 67,\n  "charactersExcludingSpaces": 56,\n  "lines": 3,\n  "paragraphs": 2\n}',
    whyUseful:
      "Useful for content drafting, editorial checks, social post limits, and text fields with strict constraints.",
    commonMistakes: [
      "Assuming blank lines are ignored in line count.",
      "Comparing counts across tools that use different whitespace rules.",
      "Expecting punctuation to be removed before word counting.",
    ],
    faq: [
      { question: "Does Word Counter include punctuation?", answer: "Yes. Punctuation is included in character counts." },
      { question: "How are paragraphs counted?", answer: "Paragraphs are split by blank lines." },
      { question: "Is this different from Character Counter?", answer: "Yes. Word Counter prioritizes word totals and paragraph metrics." },
    ],
    related: ["character-counter", "remove-line-breaks", "case-converter", "remove-duplicate-lines"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-04-24",
    outputFileName: "word-count.json",
    outputMimeType: "application/json",
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    shortDescription: "Convert text between upper, lower, title, sentence, kebab, snake, and camel case.",
    tags: ["case converter", "text case", "camel case", "snake case", "kebab case"],
    intro:
      "Convert text between common casing styles used in writing, URLs, code variables, and data-cleaning workflows.",
    howToUse: [
      "On the first line, enter mode: uppercase, lowercase, title, sentence, kebab, snake, or camel.",
      "Leave a blank line, then paste the text.",
      "Click Transform to apply case conversion.",
    ],
    exampleInput: "snake\n\nCustomer Order ID",
    exampleOutput: "customer_order_id",
    whyUseful:
      "Useful when normalizing labels, preparing variable names, and transforming human-readable text into machine-friendly formats.",
    commonMistakes: [
      "Forgetting the required blank line between mode and text.",
      "Using unsupported mode names.",
      "Expecting punctuation to always be preserved in kebab/snake/camel outputs.",
    ],
    faq: [
      { question: "What modes does Case Converter support?", answer: "uppercase, lowercase, title, sentence, kebab, snake, and camel." },
      { question: "Can I convert multi-line text?", answer: "Yes. Multi-line input is supported." },
      { question: "How do kebab and snake differ?", answer: "Kebab uses hyphens (`-`), snake uses underscores (`_`)." },
    ],
    related: ["slug-generator", "remove-extra-spaces", "character-counter", "remove-line-breaks"],
    kind: "standard",
    categories: ["text-tools", "developer-tools"],
    createdAt: "2026-04-25",
  },
  {
    slug: "remove-line-breaks",
    title: "Remove Line Breaks",
    shortDescription: "Collapse multiline text into one line or normalize line breaks.",
    tags: ["remove line breaks", "text cleanup", "single line text", "text tools"],
    intro:
      "Collapse multi-line text into a single line for compact output, or normalize excessive blank lines for cleaner formatting.",
    howToUse: [
      "Optional: first line mode (`single-line` or `normalize`).",
      "If using mode, add a blank line, then paste your text.",
      "Click Transform to process line breaks.",
    ],
    exampleInput: "single-line\n\nLine one.\nLine two.\nLine three.",
    exampleOutput: "Line one. Line two. Line three.",
    whyUseful:
      "Useful for cleaning pasted content before CSV import, URL parameters, form fields, and logs.",
    commonMistakes: [
      "Using unsupported mode names.",
      "Expecting punctuation cleanup; this tool only changes line breaks.",
      "Forgetting that `single-line` collapses all lines into one space-separated line.",
    ],
    faq: [
      { question: "What modes are supported?", answer: "`single-line` and `normalize`." },
      { question: "What does normalize mode do?", answer: "It preserves line structure but reduces long blank-line runs." },
      { question: "Can I run this without mode?", answer: "Yes. It defaults to single-line behavior." },
    ],
    related: ["sort-lines-alphabetically", "remove-duplicate-lines", "case-converter", "word-counter"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-04-26",
  },
  {
    slug: "remove-extra-spaces",
    title: "Remove Extra Spaces",
    shortDescription: "Normalize repeated spaces and clean uneven spacing in text.",
    tags: ["remove extra spaces", "normalize spacing", "text cleanup", "text tools"],
    intro:
      "Remove duplicate spaces and normalize spacing across text lines so copied content is cleaner and easier to parse.",
    howToUse: [
      "Paste your text into the input area.",
      "Click Transform to collapse repeated spaces and tabs.",
      "Copy cleaned output for reuse in docs, CSV cells, or scripts.",
    ],
    exampleInput: "Hello   world   this   is   text",
    exampleOutput: "Hello world this is text",
    whyUseful:
      "Useful when content comes from PDFs, chats, or exported fields with inconsistent spacing.",
    commonMistakes: [
      "Expecting this tool to remove line breaks automatically.",
      "Assuming punctuation will be reformatted.",
      "Forgetting that leading and trailing spaces on each line are trimmed.",
    ],
    faq: [
      { question: "Does Remove Extra Spaces work line by line?", answer: "Yes. It normalizes spacing inside each line and preserves line breaks." },
      { question: "Will tabs be normalized too?", answer: "Yes. Tabs are treated as extra spacing and collapsed." },
      { question: "Does it remove blank lines?", answer: "No. Use Remove Empty Lines for blank-line cleanup." },
    ],
    related: ["remove-duplicate-lines", "remove-empty-lines", "sort-lines-alphabetically", "case-converter"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-05-04",
  },
  {
    slug: "remove-empty-lines",
    title: "Remove Empty Lines",
    shortDescription: "Delete blank lines from multiline text while keeping content lines in order.",
    tags: ["remove empty lines", "delete blank lines", "text cleanup", "text tools"],
    intro:
      "Remove empty lines from multiline text so lists and logs are compact, consistent, and ready for sorting or deduplication.",
    howToUse: [
      "Paste multiline text with blank lines.",
      "Click Transform to remove empty rows.",
      "Copy the cleaned output for import or sharing.",
    ],
    exampleInput: "apple\n\nbanana\n\n\norange",
    exampleOutput: "apple\nbanana\norange",
    whyUseful:
      "Useful for preparing clean one-item-per-line lists before running additional text tools.",
    commonMistakes: [
      "Expecting it to trim inner spaces inside lines.",
      "Assuming duplicate lines are removed automatically.",
      "Using it when you need paragraph separation preserved.",
    ],
    faq: [
      { question: "Does Remove Empty Lines change line order?", answer: "No. It keeps original order and only removes blank lines." },
      { question: "Will whitespace-only lines be removed?", answer: "Yes. Lines containing only spaces or tabs are removed." },
      { question: "Should I run deduplication after this?", answer: "If needed, yes. Use Remove Duplicate Lines next." },
    ],
    related: ["remove-duplicate-lines", "remove-extra-spaces", "sort-lines-alphabetically", "remove-line-breaks"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-05-05",
  },
  {
    slug: "reverse-text",
    title: "Reverse Text",
    shortDescription: "Reverse text characters or reverse word order for quick text transformations.",
    tags: ["reverse text", "reverse words", "text utility", "text tools"],
    intro:
      "Reverse text by characters or by words, depending on your input mode, for testing, puzzles, or quick string manipulation tasks.",
    howToUse: [
      "Default behavior reverses characters in the full input.",
      "Optional: first line `words`, blank line, then text to reverse word order.",
      "Click Transform and copy the result.",
    ],
    exampleInput: "hello world",
    exampleOutput: "dlrow olleh",
    whyUseful:
      "Useful for quick string checks, test fixtures, and simple transformation workflows.",
    commonMistakes: [
      "Expecting punctuation-aware grammar handling.",
      "Forgetting to use `words` mode when word-order reversal is needed.",
      "Assuming line breaks are preserved exactly in words mode.",
    ],
    faq: [
      { question: "What is the default reverse mode?", answer: "By default, it reverses characters." },
      { question: "How do I reverse by words?", answer: "Use `words` on the first line, then a blank line, then your text." },
      { question: "Can I reverse multiline text?", answer: "Yes. Character mode supports multiline input." },
    ],
    related: ["case-converter", "random-string-generator", "character-counter", "remove-extra-spaces"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-05-06",
  },
  {
    slug: "extract-urls",
    title: "Extract URLs from Text",
    shortDescription: "Find and list HTTP/HTTPS URLs from mixed text input.",
    tags: ["extract urls", "url extractor", "find links in text", "text tools"],
    intro:
      "Scan raw text and extract HTTP/HTTPS URLs into a clean list, useful for audits, migrations, and content cleanup.",
    howToUse: [
      "Paste text containing one or more links.",
      "Click Transform to extract URLs.",
      "Copy unique URL output for validation or reporting.",
    ],
    exampleInput: "Visit https://example.com and https://google.com for details.",
    exampleOutput: "https://example.com\nhttps://google.com",
    whyUseful:
      "Useful when links are scattered across notes, logs, or exported text and need to be reviewed quickly.",
    commonMistakes: [
      "Expecting non-HTTP protocols to be included.",
      "Pasting markdown links and expecting link text output.",
      "Assuming malformed URLs will be corrected automatically.",
    ],
    faq: [
      { question: "Does Extract URLs remove duplicates?", answer: "Yes. Duplicate URLs are deduplicated in output." },
      { question: "Which protocols are supported?", answer: "It extracts `http://` and `https://` URLs." },
      { question: "What if no links are found?", answer: "The tool returns `No URLs found.`" },
    ],
    related: ["extract-emails", "extract-numbers", "regex-tester", "url-parser"],
    kind: "standard",
    categories: ["text-tools", "developer-tools"],
    createdAt: "2026-05-07",
  },
  {
    slug: "csv-viewer",
    title: "CSV Viewer",
    shortDescription: "Preview CSV data as a readable table with delimiter support.",
    tags: ["csv viewer", "csv table preview", "csv preview", "spreadsheet tools"],
    intro:
      "Preview CSV content as a readable table directly in your browser, including support for comma, semicolon, tab, and pipe delimiters.",
    howToUse: [
      "Paste CSV data into the input panel.",
      "Select delimiter: comma, semicolon, tab, or pipe.",
      "Click Preview CSV to render a table.",
    ],
    exampleInput: "id;name;city\n1;Ana;Melbourne\n2;Bob;Sydney",
    exampleOutput: "id | name | city\n1  | Ana  | Melbourne\n2  | Bob  | Sydney",
    whyUseful:
      "Useful for quick sanity checks before imports, transformations, and data-sharing workflows.",
    commonMistakes: [
      "Using the wrong delimiter for the source file.",
      "Leaving delimiter set to comma for semicolon-separated exports.",
      "Expecting CSV Viewer to mutate data; it is a preview tool.",
    ],
    faq: [
      { question: "Which delimiters does CSV Viewer support?", answer: "comma, semicolon, tab, and pipe." },
      { question: "Can CSV Viewer handle large files?", answer: "It previews up to a practical row limit for browser readability." },
      { question: "Does CSV Viewer edit or clean data?", answer: "No. It previews rows and columns without transformation." },
    ],
    related: ["csv-validator", "csv-cleaner", "csv-splitter", "csv-merge-tool"],
    kind: "standard",
    categories: ["csv-tools", "spreadsheet-tools"],
    createdAt: "2026-04-27",
  },
  {
    slug: "html-encoder",
    title: "HTML Encoder",
    shortDescription: "Escape unsafe HTML characters into entity-safe text.",
    tags: ["html encoder", "escape html", "html entities", "developer tools"],
    intro:
      "Encode special HTML characters into entities so text can be safely displayed without being interpreted as markup.",
    howToUse: [
      "Paste raw text or HTML snippet.",
      "Click Transform to encode entities.",
      "Copy the encoded output for safe rendering contexts.",
    ],
    exampleInput: "<script>alert('xss')</script>",
    exampleOutput: "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;",
    whyUseful:
      "Useful for preventing accidental HTML rendering when displaying user-provided or dynamic strings.",
    commonMistakes: [
      "Encoding already encoded strings multiple times.",
      "Assuming encoding removes malicious intent by itself.",
      "Expecting this tool to sanitize full HTML documents with policy controls.",
    ],
    faq: [
      { question: "What does HTML Encoder escape?", answer: "It escapes `&`, `<`, `>`, `\"`, and `'` characters." },
      { question: "When should I use HTML encoding?", answer: "When inserting text into HTML contexts where raw tags should not execute." },
      { question: "Is HTML encoding the same as sanitization?", answer: "No. Encoding is context-safe escaping, not full sanitization policy enforcement." },
    ],
    related: ["html-decoder", "url-encoder", "base64-encoder", "markdown-to-html"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-28",
  },
  {
    slug: "html-decoder",
    title: "HTML Decoder",
    shortDescription: "Decode HTML entities back into readable text.",
    tags: ["html decoder", "decode html entities", "html entities", "developer tools"],
    intro:
      "Decode escaped HTML entities into readable characters for debugging rendered content and copied encoded strings.",
    howToUse: [
      "Paste HTML-encoded text.",
      "Click Transform to decode entities.",
      "Copy decoded output for inspection or reuse.",
    ],
    exampleInput: "&lt;div&gt;Hello &amp; welcome&lt;/div&gt;",
    exampleOutput: "<div>Hello & welcome</div>",
    whyUseful:
      "Useful when inspecting encoded logs, CMS content, or payloads containing entity-escaped text.",
    commonMistakes: [
      "Expecting decoder to execute or render HTML rather than decode characters.",
      "Providing partially encoded text and expecting full normalization.",
      "Decoding repeatedly and losing expected escaped representation.",
    ],
    faq: [
      { question: "What entities does HTML Decoder handle?", answer: "It decodes common entities such as `&lt;`, `&gt;`, `&amp;`, `&quot;`, and `&#39;`." },
      { question: "Can I decode full HTML snippets?", answer: "Yes. It decodes entity-encoded characters within snippet text." },
      { question: "Does decoding sanitize HTML?", answer: "No. Decoding only converts entities back to characters." },
    ],
    related: ["html-encoder", "url-decoder", "base64-decoder", "html-to-markdown"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-29",
  },
  {
    slug: "yaml-formatter",
    title: "YAML Formatter",
    shortDescription: "Format YAML with consistent indentation for readability.",
    tags: ["yaml formatter", "format yaml", "prettify yaml", "developer tools"],
    intro:
      "Format YAML documents with normalized indentation and clean structure so configuration files are easier to review.",
    howToUse: [
      "Paste YAML input into the editor.",
      "Click Transform to parse and format YAML output.",
      "Copy or download the formatted YAML.",
    ],
    exampleInput: "service: {name: api, ports: [3000, 3001]}",
    exampleOutput: "service:\n  name: api\n  ports:\n    - 3000\n    - 3001",
    whyUseful:
      "Useful for improving readability of CI configs, deployment manifests, and shared YAML snippets.",
    commonMistakes: [
      "Pasting invalid YAML and expecting formatting to succeed.",
      "Assuming comments and original style are always preserved.",
      "Using tabs in source YAML indentation.",
    ],
    faq: [
      { question: "Does YAML Formatter validate syntax?", answer: "Yes. Invalid YAML returns a parse error instead of formatted output." },
      { question: "Will key order change?", answer: "Parsed key order is generally preserved, but style is normalized." },
      { question: "Can I download formatted YAML?", answer: "Yes. Output can be copied or downloaded." },
    ],
    related: ["json-formatter", "yaml-validator", "json-validator", "yaml-to-json"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-05-08",
    outputFileName: "formatted.yaml",
    outputMimeType: "application/x-yaml",
  },
  {
    slug: "yaml-to-json",
    title: "YAML to JSON Converter",
    shortDescription: "Convert valid YAML into formatted JSON output.",
    tags: ["yaml to json", "convert yaml", "yaml converter", "developer tools"],
    intro:
      "Convert YAML configuration or manifest files into JSON for API workflows, debugging, and tooling that expects JSON input.",
    howToUse: [
      "Paste valid YAML input.",
      "Click Transform to convert YAML to JSON.",
      "Copy or download the generated JSON output.",
    ],
    exampleInput: "version: 1\nservices:\n  api:\n    image: node:20",
    exampleOutput: '{\n  "version": 1,\n  "services": {\n    "api": {\n      "image": "node:20"\n    }\n  }\n}',
    whyUseful:
      "Useful for bridging YAML-based configs with JSON-based APIs and debug tools.",
    commonMistakes: [
      "Using invalid YAML indentation.",
      "Assuming conversion validates domain schema rules.",
      "Expecting comments to be preserved after conversion.",
    ],
    faq: [
      { question: "Does YAML to JSON preserve nested structure?", answer: "Yes. Nested YAML objects are converted to equivalent JSON objects." },
      { question: "Can YAML to JSON convert arrays?", answer: "Yes. YAML sequences become JSON arrays." },
      { question: "Does conversion keep YAML comments?", answer: "No. Comments are not retained in JSON output." },
    ],
    related: ["yaml-formatter", "json-formatter", "json-validator", "json-to-yaml"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-04-30",
    outputFileName: "converted.json",
    outputMimeType: "application/json",
  },
  {
    slug: "json-to-yaml",
    title: "JSON to YAML Converter",
    shortDescription: "Convert JSON objects into YAML format.",
    tags: ["json to yaml", "convert json", "yaml converter", "developer tools"],
    intro:
      "Convert JSON objects into YAML output for configuration files, manifests, and tooling that prefers YAML syntax.",
    howToUse: [
      "Paste valid JSON input.",
      "Click Transform to generate YAML.",
      "Copy or download the YAML output.",
    ],
    exampleInput: '{"service":{"name":"api","port":3000},"env":["prod","staging"]}',
    exampleOutput: "service:\n  name: api\n  port: 3000\nenv:\n  - prod\n  - staging",
    whyUseful:
      "Useful for moving API/config JSON into YAML-based ecosystems such as CI and infrastructure tools.",
    commonMistakes: [
      "Pasting invalid JSON and expecting conversion.",
      "Assuming YAML comments can be generated from JSON.",
      "Expecting key order to always match source formatting preferences.",
    ],
    faq: [
      { question: "Does JSON to YAML require object input?", answer: "It supports valid JSON values and renders YAML equivalents." },
      { question: "Can JSON to YAML convert arrays?", answer: "Yes. Arrays are emitted as YAML lists." },
      { question: "Should I validate JSON before converting?", answer: "Yes. Run JSON Validator if input comes from unknown sources." },
    ],
    related: ["json-formatter", "yaml-formatter", "json-validator", "yaml-to-json"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-05-01",
    outputFileName: "converted.yaml",
    outputMimeType: "application/x-yaml",
  },
  {
    slug: "curl-to-fetch",
    title: "Curl to Fetch Converter",
    shortDescription: "Convert curl commands into JavaScript fetch() code.",
    tags: ["curl to fetch", "curl converter", "fetch generator", "developer tools"],
    intro:
      "Convert curl commands into JavaScript fetch() snippets to speed up API debugging and frontend integration work.",
    howToUse: [
      "Paste a curl command, including URL and optional flags.",
      "Click Transform to generate fetch() output.",
      "Copy the JavaScript snippet into your code or test scripts.",
    ],
    exampleInput: "curl https://api.example.com",
    exampleOutput: 'fetch("https://api.example.com");',
    whyUseful:
      "Useful when API docs provide curl examples but your app code requires fetch syntax.",
    commonMistakes: [
      "Pasting commands that do not start with `curl`.",
      "Expecting shell-specific substitutions to be resolved automatically.",
      "Assuming every advanced curl option maps directly to fetch.",
    ],
    faq: [
      { question: "Does Curl to Fetch support headers?", answer: "Yes. `-H` / `--header` values are converted into fetch headers." },
      { question: "What happens with `-d` data flags?", answer: "Data is mapped to `body`, and method defaults to POST if needed." },
      { question: "Can it convert every curl feature?", answer: "No. It covers common request options for practical conversion." },
    ],
    related: ["url-parser", "query-string-builder", "query-string-parser", "url-encoder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-05-09",
    outputFileName: "fetch-snippet.js",
    outputMimeType: "application/javascript",
  },
  {
    slug: "cron-expression-builder",
    title: "Cron Expression Builder",
    shortDescription: "Build 5-field cron expressions from structured schedule input.",
    tags: ["cron expression builder", "build cron", "crontab builder", "developer tools"],
    intro:
      "Build valid 5-field cron expressions from structured schedule selections for recurring jobs and automation tasks.",
    howToUse: [
      "Use the schedule controls to set minute, hour, day-of-month, month, and day-of-week.",
      "Click Generate Expression to build the cron string.",
      "Copy the generated expression and validate it with Cron Expression Parser.",
    ],
    exampleInput: "Minute: 30\nHour: 9\nDay of month: *\nMonth: *\nDay of week: 1-5",
    exampleOutput: "30 9 * * 1-5",
    whyUseful:
      "Useful for quickly building cron schedules without memorizing field order every time.",
    commonMistakes: [
      "Mixing up day-of-month and day-of-week fields.",
      "Using invalid value ranges for minute or hour.",
      "Assuming builder validates business logic of your schedule intent.",
    ],
    faq: [
      { question: "What cron format does this builder generate?", answer: "It generates standard 5-field cron expressions." },
      { question: "Can I use this with Cron Expression Parser?", answer: "Yes. Build here, then validate intent in the parser tool." },
      { question: "Does this support seconds field cron syntax?", answer: "No. It targets 5-field cron expressions only." },
    ],
    related: ["cron-expression-parser", "timestamp-converter", "date-format-converter", "query-string-builder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-05-02",
    outputFileName: "cron-expression.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    shortDescription: "Generate placeholder text by words, sentences, or paragraphs.",
    tags: ["lorem ipsum generator", "placeholder text", "dummy text", "developer tools"],
    intro:
      "Generate placeholder text by word, sentence, or paragraph count for mockups, UI testing, and content layout validation.",
    howToUse: [
      "First line mode: `words`, `sentences`, or `paragraphs`.",
      "Second line count (for example `50` words or `3` paragraphs).",
      "Click Transform to generate lorem ipsum output.",
    ],
    exampleInput: "paragraphs\n2",
    exampleOutput: "Lorem ipsum dolor sit amet consectetur adipiscing elit...\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    whyUseful:
      "Useful for quickly filling prototypes, docs, and form fields with realistic placeholder content.",
    commonMistakes: [
      "Using unsupported mode names.",
      "Setting very large counts when short placeholder output is enough.",
      "Expecting semantically meaningful production copy from lorem text.",
    ],
    faq: [
      { question: "What modes does Lorem Ipsum Generator support?", answer: "words, sentences, and paragraphs." },
      { question: "Can I control output size?", answer: "Yes. Set the count on the second line." },
      { question: "Is output deterministic?", answer: "No. Output is randomized for varied placeholder text." },
    ],
    related: ["random-string-generator", "slug-generator", "case-converter", "word-counter"],
    kind: "standard",
    categories: ["text-tools", "developer-tools"],
    createdAt: "2026-05-03",
  },
  {
    slug: "markdown-to-html",
    title: "Markdown to HTML Converter",
    shortDescription: "Convert Markdown text into clean HTML output.",
    tags: ["markdown to html", "markdown converter", "html conversion", "developer tools"],
    intro:
      "Convert Markdown content into HTML markup for documentation, blog content, and CMS publishing workflows.",
    howToUse: [
      "Paste Markdown content into the input area.",
      "Click Transform to generate HTML output.",
      "Copy or download the converted HTML.",
    ],
    exampleInput: "# Release Notes\n\n- Added **JSON Diff Checker**\n- Fixed `CSV` import bug",
    exampleOutput: "<h1>Release Notes</h1>\n<ul>\n<li>Added <strong>JSON Diff Checker</strong></li>\n<li>Fixed <code>CSV</code> import bug</li>\n</ul>",
    whyUseful:
      "Useful when you draft in Markdown but need HTML for CMS fields, emails, or embedded content blocks.",
    commonMistakes: [
      "Expecting full GitHub-flavored Markdown support for every edge case.",
      "Pasting HTML and expecting Markdown parsing behavior.",
      "Forgetting to verify links and code blocks after conversion.",
    ],
    faq: [
      { question: "Does Markdown to HTML support headings and lists?", answer: "Yes. Headings, lists, links, bold, italics, and inline code are supported." },
      { question: "Can I convert long Markdown documents?", answer: "Yes. Conversion runs in-browser and handles large text blocks." },
      { question: "Does Markdown to HTML sanitize unsafe tags?", answer: "This tool focuses on conversion; review output before publishing to untrusted contexts." },
    ],
    related: ["html-encoder", "html-decoder", "text-diff-checker", "html-to-markdown"],
    kind: "standard",
    categories: ["text-tools", "developer-tools"],
    createdAt: "2026-04-14",
    outputFileName: "converted.html",
    outputMimeType: "text/html",
  },
  {
    slug: "html-to-markdown",
    title: "HTML to Markdown Converter",
    shortDescription: "Convert HTML into Markdown-friendly text.",
    tags: ["html to markdown", "html converter", "markdown conversion", "developer tools"],
    intro:
      "Convert HTML snippets into Markdown format for docs, README files, and text-first publishing systems.",
    howToUse: [
      "Paste HTML content into the input area.",
      "Click Transform to convert markup to Markdown.",
      "Copy the result and review formatting before publishing.",
    ],
    exampleInput: "<h2>Changelog</h2><p>Fixed <strong>CSV parser</strong> edge cases.</p>",
    exampleOutput: "## Changelog\n\nFixed **CSV parser** edge cases.",
    whyUseful:
      "Helpful when migrating content from HTML-heavy systems into Markdown-based documentation or version-controlled docs.",
    commonMistakes: [
      "Expecting perfect round-trip conversion for complex nested HTML.",
      "Using malformed HTML, which can lead to odd markdown output.",
      "Assuming CSS or layout information is preserved in Markdown.",
    ],
    faq: [
      { question: "Does HTML to Markdown preserve links?", answer: "Yes. Anchor tags are converted to Markdown link syntax." },
      { question: "Will inline styling be preserved?", answer: "No. Markdown focuses on structure and text semantics, not CSS styles." },
      { question: "Can I convert full HTML pages?", answer: "Yes, but review output because script/style/layout tags are not represented in Markdown." },
    ],
    related: ["markdown-to-html", "text-diff-checker", "character-counter", "slug-generator"],
    kind: "standard",
    categories: ["text-tools", "developer-tools"],
    createdAt: "2026-04-15",
  },
  {
    slug: "json-diff-checker",
    title: "JSON Diff Checker",
    shortDescription: "Compare two JSON documents online and highlight added, removed, and changed paths instantly.",
    tags: ["json diff checker", "json compare", "json diff", "compare json online", "compare two json files"],
    intro:
      "Compare two JSON documents and instantly see changed values, added keys, removed fields, and nested path differences. This is useful for API response debugging, config reviews, payload verification, and regression checks across environments. The comparison runs in your browser, so you can inspect sensitive JSON safely without uploading files.",
    howToUse: [
      "Paste the first JSON document in the left panel.",
      "Paste the second JSON document in the right panel.",
      "Optionally keep Ignore key order enabled for logical comparisons.",
      "Click Compare JSON to format input and run the diff.",
      "Review Added, Removed, and Changed path groups.",
      "Copy the results or inspect specific paths directly in the output.",
    ],
    exampleInput:
      '{\n  "name": "Alice",\n  "age": 30,\n  "tags": ["admin", "editor"],\n  "profile": {\n    "city": "Melbourne"\n  }\n}\n\n{\n  "name": "Alice",\n  "age": 31,\n  "tags": ["admin", "owner"],\n  "profile": {\n    "city": "Sydney"\n  },\n  "active": true\n}',
    exampleOutput:
      'Changed:\n- age: 30 -> 31\n- tags[1]: "editor" -> "owner"\n- profile.city: "Melbourne" -> "Sydney"\n\nAdded:\n- active: true\n\nRemoved:\n(none)',
    whyUseful:
      "Helps engineers and analysts compare JSON quickly without manual scanning, especially when payloads are deeply nested.",
    commonMistakes: [
      "Comparing invalid JSON syntax and expecting a valid diff output.",
      "Assuming key order differences matter when logical content is otherwise identical.",
      "Confusing formatting changes (minified vs pretty) with actual data changes.",
      "Expecting reordered array values to be treated as unchanged.",
    ],
    faq: [
      {
        question: "How do I compare two JSON files?",
        answer:
          "Paste one JSON document on the left and the second on the right, then run Compare JSON to review added, removed, and changed paths.",
      },
      {
        question: "Does key order affect the comparison?",
        answer:
          "By default this tool ignores object key order for logical comparisons. You can toggle this behavior when strict ordering matters.",
      },
      {
        question: "Can this compare nested JSON objects?",
        answer:
          "Yes. Nested objects and arrays are compared recursively, and differences are reported with dot and bracket paths.",
      },
      {
        question: "How are arrays compared?",
        answer:
          "Arrays are compared by index. If values move to different indexes, the tool reports those index paths as changed.",
      },
      {
        question: "What happens if one JSON document is invalid?",
        answer:
          "The tool stops and shows a side-specific syntax error so you can fix invalid JSON before running the diff.",
      },
      {
        question: "Can I compare minified and formatted JSON?",
        answer:
          "Yes. Whitespace differences are ignored because JSON is parsed before comparison, not compared as raw text.",
      },
      {
        question: "Is this JSON diff checker free?",
        answer: "Yes. It is free to use with no account required.",
      },
      {
        question: "Does the comparison happen in the browser?",
        answer: "Yes. JSON comparison runs in your browser.",
      },
    ],
    related: ["json-formatter", "json-validator", "json-minifier", "json-path-extractor", "json-schema-generator", "json-flatten-to-csv"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-04-16",
  },
  {
    slug: "xml-validator",
    title: "XML Validator",
    shortDescription:
      "Validate XML and instantly detect syntax errors with line-level hints before using XML in APIs, feeds, or config workflows.",
    tags: ["xml validator", "validate xml online", "xml syntax validator", "xml checker", "developer tools"],
    intro:
      "This tool validates XML syntax so you can catch malformed tags, invalid nesting, and broken attributes before XML reaches downstream systems. It is useful for API payloads, RSS/Atom feeds, and configuration files where parse failures can break processing. You can optionally format valid XML during validation to improve readability while debugging. It checks syntax and structure, not XSD schema rules.",
    howToUse: [
      "Paste XML into the input field or upload an XML file.",
      "Optionally enable format before validate if you want normalized indentation.",
      "Click Validate XML to run syntax checks.",
      "If invalid, review the highlighted parser error and line hint.",
      "Fix the issue and run validation again until the document is valid.",
    ],
    exampleInput:
      "Valid XML example:\n<users>\n  <user id=\"1\">\n    <name>Ana</name>\n  </user>\n</users>\n\nInvalid XML example:\n<users>\n  <user id=\"1\">\n    <name>Ana</name>\n</users>",
    exampleOutput:
      "Valid result:\nValid XML. No syntax errors found.\n\nInvalid result:\nXML validation failed\nMismatched closing tag near line 5 (exact parser message may vary).",
    whyUseful:
      "Catch XML syntax issues early so API integrations, feed imports, and config parsing do not fail in production.",
    commonMistakes: [
      "Missing closing tags. Invalid: `<user><name>Ana</name>` Fix: `<user><name>Ana</name></user>`.",
      "Closing tags out of order (invalid nesting). Invalid: `<a><b></a></b>` Fix: `<a><b></b></a>`.",
      "Leaving attributes unquoted. Invalid: `<user id=1>` Fix: `<user id=\"1\">`.",
      "Expecting this syntax check to validate XSD schema rules.",
      "Pasting fragments with multiple roots. Invalid: `<a></a><b></b>` Fix: wrap under one root element.",
    ],
    faq: [
      {
        question: "How do I validate XML online with this tool?",
        answer:
          "Paste XML or upload a file, then click Validate XML. The tool parses the document and reports syntax errors immediately.",
      },
      {
        question: "What makes XML invalid?",
        answer:
          "Common causes are missing closing tags, invalid nesting order, unquoted attributes, duplicate attributes, and malformed entities.",
      },
      {
        question: "Can this XML validator show the error line number?",
        answer:
          "Yes. When parser line information is available, the tool displays line and column hints with the error message.",
      },
      {
        question: "Does this validator check XML schemas (XSD)?",
        answer: "No. It validates XML syntax and structure, not XSD schema constraints.",
      },
      {
        question: "Can I validate large XML files?",
        answer:
          "Yes for typical browser-sized files. Very large files may be slower depending on your device and browser memory limits.",
      },
      {
        question: "Can I format XML before validation?",
        answer:
          "Yes. Enable format before validate to normalize indentation when the XML parses successfully.",
      },
      {
        question: "Does this tool store my XML data?",
        answer: "No. Validation runs in your browser.",
      },
      {
        question: "Can I validate XML from API responses and feeds?",
        answer: "Yes. Paste raw XML from API payloads, RSS/Atom feeds, or config files to check syntax quickly.",
      },
    ],
    related: ["xml-to-json", "json-to-xml", "json-validator", "yaml-validator", "json-to-csv", "json-diff-checker"],
    kind: "standard",
    categories: ["developer-tools", "json-tools"],
    createdAt: "2026-04-17",
  },
  {
    slug: "xml-to-json",
    title: "XML to JSON Converter",
    shortDescription: "Convert XML documents into structured JSON.",
    tags: ["xml to json", "convert xml", "xml parser", "developer tools"],
    intro:
      "Convert XML data into JSON objects for modern APIs, JavaScript processing, and easier inspection in developer workflows.",
    howToUse: [
      "Paste XML input into the tool.",
      "Click Transform to parse and convert XML.",
      "Copy or download the JSON result.",
    ],
    exampleInput: "<user id=\"1\"><name>Ana</name><role>admin</role></user>",
    exampleOutput: '{\n  "user": {\n    "@attributes": {\n      "id": "1"\n    },\n    "name": "Ana",\n    "role": "admin"\n  }\n}',
    whyUseful:
      "Useful when bridging XML-based legacy systems with JSON-centric applications and internal tooling.",
    commonMistakes: [
      "Using invalid XML and expecting conversion to succeed.",
      "Assuming every XML attribute maps to a top-level JSON field.",
      "Expecting identical round-trip output when converting back to XML.",
    ],
    faq: [
      { question: "How are XML attributes represented in JSON?", answer: "Attributes are stored under an `@attributes` object." },
      { question: "Can XML to JSON convert nested XML documents?", answer: "Yes. Nested elements are converted recursively." },
      { question: "Does XML to JSON support repeated tags?", answer: "Yes. Repeated tags are grouped into arrays." },
    ],
    related: ["json-to-xml", "xml-validator", "json-formatter", "json-validator"],
    kind: "standard",
    categories: ["developer-tools", "json-tools"],
    createdAt: "2026-04-18",
    outputFileName: "converted.json",
    outputMimeType: "application/json",
  },
  {
    slug: "json-to-xml",
    title: "JSON to XML Converter",
    shortDescription: "Convert JSON objects into XML markup.",
    tags: ["json to xml", "convert json", "xml generator", "developer tools"],
    intro:
      "Convert JSON object input into XML markup so you can interoperate with XML-based systems and integrations.",
    howToUse: [
      "Paste a JSON object.",
      "Click Transform to generate XML output.",
      "Copy or download XML for your integration target.",
    ],
    exampleInput: '{"user":{"@attributes":{"id":"1"},"name":"Ana","role":"admin"}}',
    exampleOutput: "<user id=\"1\"><name>Ana</name><role>admin</role></user>",
    whyUseful:
      "Useful when applications produce JSON but downstream services require XML payloads or config formats.",
    commonMistakes: [
      "Providing JSON arrays as the top-level value.",
      "Expecting invalid JSON to convert successfully.",
      "Assuming key order has semantic meaning in generated XML.",
    ],
    faq: [
      { question: "What JSON shape does JSON to XML require?", answer: "Top-level input must be a JSON object." },
      { question: "How do I create XML attributes from JSON?", answer: "Use an `@attributes` object inside the element object." },
      { question: "What if my JSON has multiple root keys?", answer: "The converter wraps them under a `root` element." },
    ],
    related: ["xml-to-json", "xml-validator", "json-formatter", "json-validator"],
    kind: "standard",
    categories: ["developer-tools", "json-tools"],
    createdAt: "2026-04-19",
    outputFileName: "converted.xml",
    outputMimeType: "application/xml",
  },
  {
    slug: "query-string-builder",
    title: "Query String Builder",
    shortDescription: "Build URL query strings from JSON parameters.",
    tags: ["query string builder", "url params", "query params", "developer tools"],
    intro:
      "Convert JSON key-value pairs into URL query strings for API requests, tracking links, and integration tests.",
    howToUse: [
      "Paste a JSON object with query parameter fields.",
      "Click Transform to build the query string.",
      "Copy the output and append it to your URL.",
    ],
    exampleInput: '{"utm_source":"newsletter","id":42,"tag":["a","b"]}',
    exampleOutput: "utm_source=newsletter&id=42&tag=a&tag=b",
    whyUseful:
      "Speeds up API testing and tracking URL creation when you need correctly encoded query parameters quickly.",
    commonMistakes: [
      "Providing arrays at the top level instead of an object.",
      "Assuming null values are included in output.",
      "Forgetting to parse duplicate keys as repeated parameters.",
    ],
    faq: [
      { question: "Can Query String Builder handle array values?", answer: "Yes. Arrays are emitted as repeated key=value pairs." },
      { question: "Are values URL-encoded?", answer: "Yes. Output is encoded for query-string compatibility." },
      { question: "Does Query String Builder support nested objects?", answer: "Nested objects should be flattened before building query strings." },
    ],
    related: ["query-string-parser", "url-encoder", "url-parser", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-20",
  },
  {
    slug: "query-string-parser",
    title: "Query String Parser",
    shortDescription: "Parse query strings or URLs into JSON parameters.",
    tags: ["query string parser", "parse url params", "query params parser", "developer tools"],
    intro:
      "Parse query strings or full URLs into structured JSON so you can inspect parameter values and repeated keys.",
    howToUse: [
      "Paste a query string or full URL.",
      "Click Transform to parse parameters.",
      "Review JSON output and copy it for debugging.",
    ],
    exampleInput: "https://example.com/callback?state=abc&scope=read&scope=write",
    exampleOutput: '{\n  "state": "abc",\n  "scope": [\n    "read",\n    "write"\n  ]\n}',
    whyUseful:
      "Useful for debugging redirects, callback URLs, and query parameter handling in frontend and backend code.",
    commonMistakes: [
      "Including malformed percent-encoded values.",
      "Expecting fragment/hash values to appear as query parameters.",
      "Assuming duplicate keys are collapsed to one value.",
    ],
    faq: [
      { question: "Can Query String Parser parse full URLs?", answer: "Yes. It extracts and parses the query portion of a full URL." },
      { question: "How are duplicate parameters represented?", answer: "Duplicate keys are returned as arrays." },
      { question: "Can I parse strings starting with `?` only?", answer: "Yes. Raw query strings are supported." },
    ],
    related: ["query-string-builder", "url-parser", "url-decoder", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-21",
    outputFileName: "parsed-query.json",
    outputMimeType: "application/json",
  },
  {
    slug: "hmac-generator",
    title: "HMAC Generator",
    shortDescription: "Generate HMAC-SHA256 digests from secret and message.",
    tags: ["hmac generator", "hmac sha256", "message authentication", "developer tools"],
    intro:
      "Generate HMAC-SHA256 signatures for request signing, webhook verification tests, and secure message integrity checks.",
    howToUse: [
      "Paste the secret key in the first block.",
      "Leave a blank line, then paste the message in the second block.",
      "Click Transform to generate the HMAC digest.",
    ],
    exampleInput: "super-secret-key\n\n{\"event\":\"invoice.paid\",\"id\":\"evt_123\"}",
    exampleOutput: "2a19052d5c9e4c42f96b59df3d3d75a1f4d7f033e24b0e8fce8f4e40a89c7a3d",
    whyUseful:
      "Useful for quickly verifying signatures when debugging webhook callbacks and signed API request flows.",
    commonMistakes: [
      "Not separating secret and message with a blank line.",
      "Using a different secret than the source system.",
      "Comparing hashes generated from message strings with different whitespace.",
    ],
    faq: [
      { question: "Which algorithm does HMAC Generator use?", answer: "This tool generates HMAC using SHA-256." },
      { question: "How do I provide secret and message?", answer: "Use two blocks separated by one blank line: secret first, message second." },
      { question: "Can I verify webhook signatures with this?", answer: "Yes. Generate the digest from the same secret and raw payload for comparison." },
    ],
    related: ["hash-generator", "base64-encoder", "jwt-encoder", "query-string-builder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-22",
    outputFileName: "hmac.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "bcrypt-hash-generator",
    title: "Bcrypt Hash Generator",
    shortDescription: "Generate bcrypt password hashes with configurable rounds.",
    tags: ["bcrypt generator", "password hash", "bcrypt hash tool", "developer tools"],
    intro:
      "Generate bcrypt password hashes for authentication development and migration workflows where secure password storage format is required.",
    howToUse: [
      "Paste the password in the first block.",
      "Optionally add a blank line and bcrypt rounds (4-15) in the second block.",
      "Click Transform to generate the bcrypt hash.",
    ],
    exampleInput: "myS3curePass!\n\n12",
    exampleOutput: "$2b$12$QnQe3z2h4Yw6pL8nTu8Q8eW6u1Yt6m5oS8VQ1c2oL4l1fQmA1p8aG",
    whyUseful:
      "Useful for auth testing and migrations when you need bcrypt hashes generated quickly with controlled rounds.",
    commonMistakes: [
      "Using very low rounds in production-like environments.",
      "Assuming bcrypt output is deterministic for the same password.",
      "Pasting rounds in the first block instead of the optional second block.",
    ],
    faq: [
      { question: "What rounds does Bcrypt Hash Generator support?", answer: "Rounds from 4 to 15 are supported." },
      { question: "Why do I get a different hash each time?", answer: "Bcrypt uses random salts, so hashes vary even for the same password." },
      { question: "Is this suitable for production secrets?", answer: "Use output for development/testing workflows and follow your production security policy." },
    ],
    related: ["password-generator", "hash-generator", "hmac-generator", "random-string-generator"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-23",
    outputFileName: "bcrypt-hash.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder",
    shortDescription: "Encode plain text into Base64 format.",
    tags: ["base64", "encoder", "developer", "text"],
    intro:
      "Encode plain text into Base64 for cases where systems require safe text transport in headers, payloads, or config fields. This is useful for debugging encoded content and preparing deterministic test data.",
    howToUse: [
      "Paste raw text that you want to encode.",
      "Click Transform to generate Base64 output.",
      "Copy the encoded string or pass it to Base64 Decoder for verification.",
    ],
    exampleInput: "hello world",
    exampleOutput: "aGVsbG8gd29ybGQ=",
    whyUseful:
      "Useful when APIs, auth systems, or integration tooling require Base64 text instead of raw strings.",
    commonMistakes: [
      "Confusing Base64 encoding with encryption.",
      "Encoding already encoded values multiple times by accident.",
      "Using URL contexts that require URL-safe transformations instead of standard Base64.",
    ],
    faq: [
      { question: "Does this support Unicode text?", answer: "Yes. Unicode text is encoded safely." },
      { question: "Can I encode multiline text?", answer: "Yes. Newlines are preserved in encoding." },
      {
        question: "Is Base64 secure for secrets?",
        answer: "No. Base64 is reversible encoding, not security or encryption.",
      },
    ],
    related: ["base64-decoder", "url-encoder", "url-decoder", "jwt-decoder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-12",
  },
  {
    slug: "base64-decoder",
    title: "Base64 Decoder",
    shortDescription: "Decode Base64 content back into readable text.",
    tags: ["base64", "decoder", "developer", "text"],
    intro:
      "Decode Base64-encoded strings back into readable text to inspect payloads, debug API responses, and verify encoded config values.",
    howToUse: [
      "Paste a Base64 string into the input field.",
      "Click Transform to decode the value.",
      "Review and copy the decoded output for debugging or verification.",
    ],
    exampleInput: "aGVsbG8gd29ybGQ=",
    exampleOutput: "hello world",
    whyUseful:
      "Quickly reveals encoded payload content during API debugging, token analysis, and integration troubleshooting.",
    commonMistakes: [
      "Decoding malformed strings with missing padding characters.",
      "Assuming decoded output is JSON without validating it.",
      "Mixing URL-encoded text with Base64 data in a single step.",
    ],
    faq: [
      { question: "Why does decoding fail?", answer: "Input must be valid Base64 with proper padding." },
      { question: "Can I decode URL-safe Base64?", answer: "Standard Base64 input is expected." },
      {
        question: "Can this decode JWT segments?",
        answer: "For full token inspection use JWT Decoder, which parses header and payload automatically.",
      },
    ],
    related: ["base64-encoder", "url-decoder", "json-formatter", "jwt-decoder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-13",
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    shortDescription: "Generate random UUID v4 identifiers instantly.",
    tags: ["uuid", "generator", "developer", "ids"],
    intro: "Generate one or more UUID v4 values for database keys, test data, or API payloads.",
    howToUse: [
      "Leave input empty to generate one UUID.",
      "Optionally enter a number from 1 to 100 to generate multiple UUIDs.",
      "Click Transform and copy the output list.",
    ],
    exampleInput: "3",
    exampleOutput:
      "3f0b7f2d-7378-4f6c-a2d8-2b7c1d9f0e55\n7f854ec9-fbaf-4db4-9b89-3c6bfa42a4f1\n2146efdf-4a5e-4ec8-98e7-f4291f652d06",
    whyUseful:
      "Saves time when building fixtures, seeding databases, and creating realistic IDs for integration tests.",
    commonMistakes: [
      "Using UUIDs where sequential numeric IDs are required by downstream systems.",
      "Generating too few IDs for bulk test data setup.",
      "Assuming UUID generation guarantees ordering semantics.",
    ],
    faq: [
      { question: "Which UUID version is generated?", answer: "This tool generates UUID version 4 values." },
      { question: "Can I generate many IDs at once?", answer: "Yes, enter a number up to 100." },
      {
        question: "Can I use generated IDs in production?",
        answer: "Yes, UUID v4 values are valid identifiers; verify your system expects this format.",
      },
    ],
    related: ["timestamp-converter", "hash-generator", "base64-encoder", "url-encoder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-14",
  },
  {
    slug: "url-encoder",
    title: "URL Encoder",
    shortDescription: "Encode text for safe use in URL query strings.",
    tags: ["url", "encoder", "developer", "query string"],
    intro:
      "Encode reserved characters so values can be safely inserted into URLs, query strings, and callback parameters without breaking request parsing.",
    howToUse: [
      "Paste raw query value text or a parameter string.",
      "Click Transform to percent-encode reserved characters.",
      "Copy the encoded output into your URL or integration settings.",
    ],
    exampleInput: "name=John Doe&city=New York",
    exampleOutput: "name%3DJohn%20Doe%26city%3DNew%20York",
    whyUseful:
      "Prevents malformed URLs and query parsing errors when values contain spaces, symbols, or special characters.",
    commonMistakes: [
      "Encoding full URLs when only query parameter values should be encoded.",
      "Encoding the same value multiple times and producing unreadable output.",
      "Mixing URL encoding with Base64 encoding when only one is required.",
    ],
    faq: [
      { question: "When should I URL-encode text?", answer: "Encode text before placing it in query parameters." },
      { question: "Why are spaces changed?", answer: "Spaces are encoded to keep URLs valid and unambiguous." },
      {
        question: "Does this replace complete URL builders?",
        answer: "No. It handles encoding; use URL Parser to inspect complete URLs after assembly.",
      },
    ],
    related: ["url-decoder", "url-parser", "base64-encoder", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-15",
  },
  {
    slug: "url-decoder",
    title: "URL Decoder",
    shortDescription: "Decode URL-encoded strings into readable text.",
    tags: ["url", "decoder", "developer", "query string"],
    intro:
      "Decode percent-encoded URL strings back into readable text so you can inspect query parameters, redirect values, and logged request data.",
    howToUse: [
      "Paste URL-encoded text.",
      "Click Transform to decode encoded characters.",
      "Copy the decoded output for debugging or cleanup.",
    ],
    exampleInput: "name%3DJohn%20Doe%26city%3DNew%20York",
    exampleOutput: "name=John Doe&city=New York",
    whyUseful:
      "Makes encoded query strings and callback parameters readable during debugging and incident investigation.",
    commonMistakes: [
      "Decoding malformed strings with partial percent sequences.",
      "Assuming decoded output is safe to execute without validation.",
      "Decoding already plain text and expecting changes.",
    ],
    faq: [
      { question: "What if decoding fails?", answer: "Input may contain malformed percent-encoding." },
      { question: "Does this decode full URLs?", answer: "Yes, encoded URL strings and query values are supported." },
      {
        question: "Should I parse after decoding?",
        answer: "Yes. URL Parser helps inspect host, path, and query fields after decoding.",
      },
    ],
    related: ["url-encoder", "url-parser", "base64-decoder", "extract-emails"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-16",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    shortDescription:
      "Test regex online and generate starter regex from plain-English descriptions.",
    tags: ["regex tester", "test regex online", "regex generator", "regex builder", "pattern matching", "developer"],
    intro:
      "Use this Regex Tester to validate patterns against sample text, inspect matches, and review capture groups. The built-in Regex Generator helps you convert plain-English requests like 'match email addresses' or 'extract 6 digit order numbers' into practical starter patterns. It is designed for developers, analysts, and QA teams who need fast regex checks before shipping filters, validations, and parsing logic. Paste sample text, run the pattern, and verify exactly what matches before using it in code, ETL rules, or spreadsheet cleanup workflows.",
    howToUse: [
      "Start in Generate Regex, describe what you want to match, and click Generate Regex.",
      "Use Use in Tester to send the suggested pattern and flags into the tester.",
      "Paste representative sample text, run Test Regex, and review matches, indexes, and capture groups.",
      "Adjust the pattern or flags (`g`, `i`, `m`) until the highlighted matches are correct.",
    ],
    exampleInput:
      "Description: Match email addresses\n\nPattern: [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\nFlags: g\nSample text: Contact ana@example.com and team@company.io.",
    exampleOutput:
      "Generated regex: /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b/g\nMatch count: 2\nMatches:\n1. ana@example.com\n2. team@company.io",
    whyUseful:
      "Helps you move from plain-language matching goals to tested regex patterns you can trust in production code and data pipelines.",
    commonMistakes: [
      "Testing with sample text that is too clean and does not represent real production data.",
      "Forgetting to enable `g` when you expect all matches instead of the first match.",
      "Using unescaped characters like `.` or `+` when you intended literal text.",
      "Assuming generated patterns handle nested or highly specific formats without review.",
    ],
    faq: [
      {
        question: "What is a regex tester?",
        answer:
          "A regex tester lets you run a regular expression against sample text and inspect exactly what matches before using the pattern in code.",
      },
      {
        question: "Can I generate regex from plain English?",
        answer:
          "Yes. Enter a request like 'extract 6 digit order numbers' and the generator suggests a regex pattern, flags, and explanation.",
      },
      {
        question: "What do regex flags like g, i, and m mean?",
        answer:
          "`g` finds all matches, `i` makes matching case-insensitive, and `m` lets `^` and `$` work per line in multiline text.",
      },
      {
        question: "Why is my regex not matching?",
        answer:
          "Common causes are missing escapes, wrong flags, anchors in the wrong place, or sample text that differs from your real input format.",
      },
      {
        question: "Can I test capture groups in this tool?",
        answer: "Yes. Match output includes capture-group values when your pattern contains grouped subexpressions.",
      },
      {
        question: "Is this regex tester and generator free?",
        answer: "Yes. It is free to use with no signup required.",
      },
      {
        question: "Can I use generated regex directly in JavaScript?",
        answer:
          "Generated patterns are JavaScript-compatible starters. You should still validate edge cases before using them in production logic.",
      },
    ],
    related: ["extract-emails", "extract-urls", "extract-numbers", "text-diff-checker", "case-converter"],
    kind: "standard",
    categories: ["developer-tools", "text-tools"],
    createdAt: "2026-03-17",
  },
  {
    slug: "mermaid-editor",
    title: "Mermaid Editor",
    shortDescription: "Write Mermaid syntax, preview diagrams, and export SVG or PNG instantly.",
    tags: ["mermaid editor", "mermaid live preview", "diagram generator", "developer tools"],
    intro:
      "Create flowcharts, sequence diagrams, and architecture diagrams from Mermaid text with live browser rendering.",
    howToUse: [
      "Paste Mermaid syntax or start from the example template.",
      "Click Render Diagram to generate the preview.",
      "Copy the SVG markup or download the diagram as SVG or PNG.",
    ],
    exampleInput:
      "flowchart TD\n  A[Client] --> B[API Gateway]\n  B --> C[Auth Service]\n  B --> D[Data Service]\n  D --> E[(Database)]",
    exampleOutput:
      "<svg><!-- Rendered Mermaid diagram markup --></svg>",
    whyUseful:
      "Useful for documentation, architecture reviews, and sharing system flows without opening design software.",
    faq: [
      { question: "Is Mermaid data uploaded to a server?", answer: "No. Rendering happens in your browser and your diagram source stays local." },
      { question: "Can I download diagrams as images?", answer: "Yes. You can export SVG directly and also download PNG." },
    ],
    related: ["json-schema-generator", "regex-tester", "json-formatter", "timestamp-converter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-25",
    outputFileName: "diagram.svg",
    outputMimeType: "image/svg+xml",
  },
  {
    slug: "jwt-encoder",
    title: "JWT Encoder",
    shortDescription: "Encode JSON header and payload into an unsigned JWT token.",
    tags: ["jwt encoder", "encode jwt", "jwt payload tool", "developer tools"],
    intro:
      "Encode JWT header and payload JSON into a token string for testing auth flows, mock integrations, and local development scenarios.",
    howToUse: [
      "Paste payload JSON, or provide header JSON then a blank line then payload JSON.",
      "Click Transform to encode Base64URL JWT segments.",
      "Copy the generated unsigned token for testing.",
    ],
    exampleInput:
      '{"sub":"user_123","role":"admin","iat":1710000000}',
    exampleOutput:
      "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMDAwMDAwMH0.",
    whyUseful:
      "Useful for creating mock tokens during development when you need realistic JWT structure without running an auth server.",
    commonMistakes: [
      "Assuming encoded output is signed and secure for production.",
      "Pasting arrays instead of JSON objects for header or payload.",
      "Using tokens with `alg: none` in environments that require signature verification.",
    ],
    faq: [
      { question: "Does JWT Encoder sign the token?", answer: "No. It produces an unsigned token for development and testing." },
      { question: "Can I provide a custom JWT header?", answer: "Yes. Add header JSON, blank line, then payload JSON." },
      { question: "What payload format is required?", answer: "Payload must be a valid JSON object." },
    ],
    related: ["jwt-decoder", "base64-encoder", "json-formatter", "json-validator"],
    kind: "standard",
    categories: ["developer-tools", "json-tools"],
    createdAt: "2026-04-13",
    outputFileName: "encoded-jwt.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    shortDescription: "Decode JWT header and payload claims instantly in your browser.",
    tags: ["jwt decoder", "decode jwt token", "jwt payload", "developer tools"],
    intro:
      "Decode JSON Web Tokens (JWT) to inspect header and payload claims for debugging and integration checks.",
    howToUse: [
      "Paste your full JWT in header.payload.signature format.",
      "Click Transform to decode token sections.",
      "Review header and payload claims, then copy or download the decoded JSON.",
    ],
    exampleInput:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFuYSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    exampleOutput:
      '{\n  "header": {\n    "alg": "HS256",\n    "typ": "JWT"\n  },\n  "payload": {\n    "sub": "1234567890",\n    "name": "Ana"\n  }\n}',
    whyUseful:
      "Helps developers troubleshoot auth flows by quickly inspecting JWT contents without external tooling.",
    commonMistakes: [
      "Assuming decoding means token signature verification.",
      "Sharing production tokens in unsafe channels while debugging.",
      "Ignoring `exp`, `iat`, and `aud` claims during auth investigations.",
    ],
    faq: [
      { question: "Does this verify JWT signatures?", answer: "No. This tool decodes token content only and does not verify signatures." },
      { question: "Is my token uploaded?", answer: "No. Decoding happens in your browser." },
      {
        question: "Can I inspect expired tokens?",
        answer: "Yes. Expired tokens can still be decoded for troubleshooting claim values.",
      },
    ],
    related: ["jwt-encoder", "base64-decoder", "json-formatter", "json-validator"],
    kind: "standard",
    categories: ["developer-tools", "json-tools"],
    createdAt: "2026-03-26",
    outputFileName: "decoded-jwt.json",
    outputMimeType: "application/json",
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    shortDescription: "Generate MD5 and SHA hashes from text input.",
    tags: ["hash generator", "md5 generator", "sha256 hash", "checksum tool"],
    intro:
      "Generate deterministic hash digests from text using MD5, SHA-1, SHA-256, SHA-384, or SHA-512. This is useful for checksum workflows, integrity checks, and reproducible comparisons across systems.",
    howToUse: [
      "Paste text into the input field.",
      "Choose a hash algorithm from the dropdown.",
      "Generate the digest, then copy or download the result.",
    ],
    exampleInput: "hello world",
    exampleOutput: "5eb63bbbe01eeed093cb22bb8f5acdc3",
    whyUseful:
      "Useful for checksums, deterministic IDs, and validating content integrity across systems.",
    commonMistakes: [
      "Using MD5 for security-sensitive scenarios.",
      "Comparing hashes generated from text with hidden whitespace differences.",
      "Assuming one algorithm output is interchangeable with another.",
    ],
    faq: [
      { question: "Which algorithms are supported?", answer: "MD5, SHA-1, SHA-256, SHA-384, and SHA-512 are supported." },
      { question: "Should I use MD5 for security?", answer: "No. MD5 is weak for security purposes and should only be used for compatibility checks." },
      {
        question: "Can I hash multiline input?",
        answer: "Yes. Input is hashed exactly as entered, including newline characters.",
      },
    ],
    related: ["base64-encoder", "base64-decoder", "jwt-decoder", "url-encoder"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-27",
    outputFileName: "hash.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "json-path-extractor",
    title: "JSON Path Extractor",
    shortDescription: "Extract nested values from JSON using dot and bracket path syntax.",
    tags: ["json path extractor", "json path query", "extract json value", "developer tools"],
    intro:
      "Use a JSON path-like expression to retrieve nested values from JSON payloads for debugging and validation.",
    howToUse: [
      "Enter a path on the first line, such as user.profile.email or items[0].id.",
      "Paste JSON data on the following lines.",
      "Click Transform to extract the matching value.",
    ],
    exampleInput:
      'user.profile.email\n{"user":{"profile":{"email":"ana@example.com"}}}',
    exampleOutput: "ana@example.com",
    whyUseful:
      "Speeds up API debugging by quickly pulling specific fields from large JSON payloads.",
    faq: [
      { question: "What path syntax is supported?", answer: "Dot notation with array indices like items[0].id is supported." },
      { question: "What if the path does not exist?", answer: "The tool returns a clear path-not-found error." },
    ],
    related: ["json-formatter", "json-validator", "json-schema-generator", "jwt-decoder"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-03-28",
  },
  {
    slug: "cron-expression-parser",
    title: "Cron Expression Parser",
    shortDescription: "Explain 5-field cron expressions in readable language.",
    tags: ["cron parser", "cron expression parser", "crontab helper", "developer tools"],
    intro:
      "Parse cron schedules and convert them into plain-language descriptions for easier review.",
    howToUse: [
      "Paste a 5-field cron expression (minute hour day-of-month month day-of-week).",
      "Click Transform.",
      "Read the field-by-field schedule explanation.",
    ],
    exampleInput: "*/15 9-17 * * 1-5",
    exampleOutput:
      "Expression: */15 9-17 * * 1-5\nEvery 15 minutes\nhour from 9 to 17\nEvery day-of-month\nEvery month\nDay-of-week from Monday (1) to Friday (5)",
    whyUseful:
      "Prevents scheduling mistakes by making cron intent easy to validate before deployment.",
    faq: [
      { question: "Does this support 6-field cron with seconds?", answer: "No. This tool currently supports standard 5-field cron format." },
      { question: "Are value ranges validated?", answer: "Yes. Out-of-range values return errors." },
    ],
    related: ["cron-expression-builder", "timestamp-converter", "date-format-converter", "url-parser"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-29",
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter",
    shortDescription: "Format SQL queries with normalized spacing and readable line breaks.",
    tags: ["sql formatter", "format sql", "pretty sql", "developer tools"],
    intro:
      "Format SQL into a cleaner, review-friendly layout by normalizing whitespace, uppercasing common keywords, and adding sensible line breaks around major clauses.",
    howToUse: [
      "Paste SQL query text.",
      "Click Transform to format the query.",
      "Copy or download the formatted SQL for review or commits.",
    ],
    exampleInput: "select id,name from users where active = 1 order by name",
    exampleOutput: "SELECT id, name\nFROM users\nWHERE active = 1\nORDER BY name",
    whyUseful:
      "Improves readability in pull requests, debugging sessions, and SQL query reviews.",
    commonMistakes: [
      "Treating formatting output as SQL syntax validation.",
      "Assuming formatter behavior is identical across SQL dialects.",
      "Skipping query testing after manual edits made post-format.",
    ],
    faq: [
      { question: "Is this a dialect-aware formatter?", answer: "No. It is a lightweight formatter for common SQL patterns." },
      { question: "Does it change query logic?", answer: "No. It only changes formatting." },
      {
        question: "Should I run this before minifying SQL?",
        answer: "Yes. Format for readability first, then use SQL Minifier if compact output is needed.",
      },
    ],
    related: ["sql-minifier", "sql-to-csv", "csv-to-sql", "json-to-csv"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-30",
    outputFileName: "formatted.sql",
    outputMimeType: "text/sql",
  },
  {
    slug: "sql-minifier",
    title: "SQL Minifier",
    shortDescription: "Minify SQL by removing comments and extra whitespace.",
    tags: ["sql minifier", "compress sql", "strip sql comments", "developer tools"],
    intro:
      "Reduce SQL text size by removing comments and collapsing whitespace while preserving query meaning.",
    howToUse: [
      "Paste SQL query text.",
      "Click Transform to minify.",
      "Copy or download compact SQL output.",
    ],
    exampleInput:
      "-- user query\nSELECT id, name FROM users\nWHERE active = 1;  ",
    exampleOutput: "SELECT id,name FROM users WHERE active=1;",
    whyUseful:
      "Useful for embedding SQL in scripts, logs, or payloads where compact output is preferred.",
    faq: [
      { question: "Does this remove SQL comments?", answer: "Yes. Line and block comments are removed." },
      { question: "Will it validate SQL syntax?", answer: "No. It minifies text but does not execute or validate SQL." },
    ],
    related: ["sql-formatter", "sql-to-csv", "csv-to-sql", "regex-tester"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-31",
    outputFileName: "minified.sql",
    outputMimeType: "text/sql",
  },
  {
    slug: "sql-to-csv",
    title: "SQL to CSV Converter",
    shortDescription: "Convert SQL INSERT VALUES statements into CSV rows.",
    tags: ["sql to csv", "insert to csv", "sql values parser", "data conversion"],
    intro:
      "Extract table rows from INSERT INTO ... VALUES SQL and convert them into CSV format.",
    howToUse: [
      "Paste an INSERT INTO ... VALUES SQL statement.",
      "Click Transform to parse columns and tuples.",
      "Copy or download the resulting CSV output.",
    ],
    exampleInput:
      "INSERT INTO users (id,name,city) VALUES (1,'Ana','Melbourne'),(2,'Bob','Sydney');",
    exampleOutput: "id,name,city\n1,Ana,Melbourne\n2,Bob,Sydney",
    whyUseful:
      "Helps recover tabular data from SQL scripts for spreadsheet analysis and QA checks.",
    faq: [
      { question: "What SQL patterns are supported?", answer: "This tool supports INSERT INTO ... VALUES statements." },
      { question: "What if columns are omitted in SQL?", answer: "Generic column_1, column_2, etc. headers are generated." },
    ],
    related: ["csv-to-sql", "sql-formatter", "csv-cleaner", "json-to-csv"],
    kind: "standard",
    categories: ["csv-tools", "developer-tools", "spreadsheet-tools"],
    createdAt: "2026-04-01",
    outputFileName: "converted.csv",
    outputMimeType: "text/csv",
  },
  {
    slug: "csv-merge-tool",
    title: "CSV Merge Tool",
    shortDescription: "Merge two CSV blocks into one output with unified headers.",
    tags: ["csv merge", "combine csv files", "merge csv rows", "spreadsheet tools"],
    intro:
      "Merge two CSV datasets by combining headers and appending rows into a single CSV file.",
    howToUse: [
      "Paste first CSV block.",
      "Add a blank line, then paste second CSV block.",
      "Click Transform to merge both files into one CSV.",
    ],
    exampleInput:
      "id,name\n1,Ana\n\nid,email\n2,bob@example.com",
    exampleOutput:
      "id,name,email\n1,Ana,\n2,,bob@example.com",
    whyUseful:
      "Useful for consolidating partial exports and combining records from different CSV sources.",
    faq: [
      { question: "Do both CSV blocks need same headers?", answer: "No. Missing columns are filled with empty values." },
      { question: "How are rows merged?", answer: "Rows are appended; this tool does not perform key-based joins." },
    ],
    related: ["csv-splitter", "csv-cleaner", "csv-validator", "csv-column-mapper"],
    kind: "standard",
    categories: ["csv-tools", "spreadsheet-tools"],
    createdAt: "2026-04-02",
    outputFileName: "merged.csv",
    outputMimeType: "text/csv",
  },
  {
    slug: "csv-splitter",
    title: "CSV Splitter",
    shortDescription: "Split one CSV into chunk previews by row count.",
    tags: ["csv splitter", "split csv file", "csv chunking", "spreadsheet tools"],
    intro:
      "Split a CSV dataset into multiple chunk previews using a configurable rows-per-file value.",
    howToUse: [
      "Enter rows per chunk in the first section.",
      "Add a blank line, then paste CSV data.",
      "Click Transform to generate chunked CSV previews.",
    ],
    exampleInput:
      "2\n\nid,name\n1,Ana\n2,Bob\n3,Cam",
    exampleOutput:
      "--- chunk_1.csv ---\nid,name\n1,Ana\n2,Bob\n\n--- chunk_2.csv ---\nid,name\n3,Cam",
    whyUseful:
      "Helps break large CSV exports into smaller chunks for uploads and incremental processing.",
    faq: [
      { question: "Does this create physical files?", answer: "No. It generates chunk previews that you can copy and save." },
      { question: "What chunk size should I use?", answer: "Use a positive whole number based on your target system limits." },
    ],
    related: ["csv-merge-tool", "csv-cleaner", "csv-validator", "csv-to-json"],
    kind: "standard",
    categories: ["csv-tools", "spreadsheet-tools"],
    createdAt: "2026-04-03",
    outputFileName: "split-preview.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "ndjson-formatter",
    title: "NDJSON Formatter",
    shortDescription: "Format newline-delimited JSON into readable pretty blocks.",
    tags: ["ndjson formatter", "json lines formatter", "format ndjson", "developer tools"],
    intro:
      "Format JSON Lines (NDJSON) input by pretty-printing each line while preserving record boundaries.",
    howToUse: [
      "Paste one JSON object per line.",
      "Click Transform to validate and format each line.",
      "Copy or download the formatted NDJSON output.",
    ],
    exampleInput:
      '{"id":1,"event":"signup"}\n{"id":2,"event":"login"}',
    exampleOutput:
      '{\n  "id": 1,\n  "event": "signup"\n}\n\n{\n  "id": 2,\n  "event": "login"\n}',
    whyUseful:
      "Improves readability when inspecting log pipelines, event streams, and JSONL exports.",
    faq: [
      { question: "Will this validate each line?", answer: "Yes. Invalid JSON lines return line-numbered errors." },
      { question: "Does it change record order?", answer: "No. Output preserves input line order." },
    ],
    related: ["ndjson-to-csv", "json-formatter", "json-validator", "json-to-csv"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-04-04",
    outputFileName: "formatted.ndjson.txt",
    outputMimeType: "text/plain",
  },
  {
    slug: "url-parser",
    title: "URL Parser",
    shortDescription: "Parse URL components and query parameters online for debugging and API troubleshooting.",
    tags: ["url parser", "parse url", "parse query string", "url analyzer", "developer tools"],
    intro:
      "Parse a full URL into protocol, host, subdomain, port, path, query string, fragment, and query parameter rows. This is useful for callback URL debugging, request tracing, integration troubleshooting, and analytics link verification.",
    howToUse: [
      "Paste an absolute URL with protocol (for example `https://...`).",
      "Run URL parsing to extract structured components.",
      "Review query parameters in key/value rows.",
      "Copy parsed JSON output when you need to share or log analysis.",
      "Use URL encoder/decoder tools for follow-up cleanup if needed.",
    ],
    exampleInput:
      "https://api.example.com:8443/v1/orders/42?expand=items&include=payments&env=staging#response",
    exampleOutput:
      '{\n  "protocol": "https:",\n  "host": "api.example.com:8443",\n  "subdomain": "api",\n  "port": "8443",\n  "path": "/v1/orders/42",\n  "queryString": "?expand=items&include=payments&env=staging",\n  "fragment": "#response"\n}',
    whyUseful:
      "Makes complex URLs easier to inspect when debugging redirects, OAuth callbacks, webhooks, and tracked API requests.",
    faq: [
      {
        question: "How do I parse a URL online?",
        answer: "Paste a full URL, run parser, then inspect protocol, host, path, query, and fragment fields.",
      },
      {
        question: "Can this parse query parameters into rows?",
        answer: "Yes. Query params are shown in key/value rows for quick inspection.",
      },
      {
        question: "Does this include subdomain and port parsing?",
        answer: "Yes. Subdomain and port are extracted into separate fields.",
      },
      {
        question: "Are relative URLs supported?",
        answer: "No. Use a full absolute URL including protocol.",
      },
      {
        question: "How are repeated query keys handled?",
        answer: "Repeated keys are listed as separate key/value rows so duplicates remain visible.",
      },
      {
        question: "Can I copy parsed output?",
        answer: "Yes. You can copy parsed JSON output for logs, tickets, or debugging notes.",
      },
      {
        question: "Does URL Parser run in the browser?",
        answer: "Yes. Parsing runs in-browser.",
      },
    ],
    related: ["query-string-parser", "query-string-builder", "url-encoder", "url-decoder", "regex-tester"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-05",
    outputFileName: "parsed-url.json",
    outputMimeType: "application/json",
  },
  {
    slug: "date-format-converter",
    title: "Date Format Converter",
    shortDescription: "Convert date strings and timestamps into common machine-readable formats.",
    tags: ["date format converter", "unix to date", "iso date converter", "developer tools"],
    intro:
      "Convert dates into ISO, UTC, local time, and Unix timestamp representations.",
    howToUse: [
      "Paste a date string or Unix timestamp.",
      "Click Transform to normalize formats.",
      "Copy/download the multi-format JSON output.",
    ],
    exampleInput: "1710000000",
    exampleOutput:
      '{\n  "iso8601": "2024-03-09T16:00:00.000Z",\n  "unixSeconds": 1710000000,\n  "dateOnlyUtc": "2024-03-09"\n}',
    whyUseful:
      "Helps developers and analysts convert dates across APIs, logs, and data pipelines without timezone confusion.",
    faq: [
      { question: "Are both seconds and milliseconds supported?", answer: "Yes. Numeric input auto-detects Unix seconds or milliseconds." },
      { question: "What happens with invalid dates?", answer: "The tool returns a clear validation error." },
    ],
    related: ["timestamp-converter", "cron-expression-parser", "url-parser", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-04-06",
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    shortDescription: "Convert Unix timestamps and date strings into readable time formats.",
    tags: ["timestamp", "converter", "unix", "date", "developer"],
    intro:
      "Convert Unix seconds, Unix milliseconds, or date strings into UTC, local time, and normalized timestamp output so you can debug event timelines and API payloads quickly.",
    howToUse: [
      "Paste a Unix timestamp (seconds or milliseconds) or a date string.",
      "Click Transform to convert it.",
      "Review UTC, local time, and Unix equivalents.",
    ],
    exampleInput: "1710000000",
    exampleOutput:
      '{\n  "input": "1710000000",\n  "unixSeconds": 1710000000,\n  "unixMilliseconds": 1710000000000,\n  "utc": "2024-03-09T16:00:00.000Z"\n}',
    whyUseful:
      "Useful for debugging API payloads, logs, analytics events, and systems that store Unix timestamps.",
    commonMistakes: [
      "Confusing Unix seconds with Unix milliseconds.",
      "Comparing values across systems without checking timezone context.",
      "Assuming ambiguous date strings parse the same way in every environment.",
    ],
    faq: [
      { question: "Does it support seconds and milliseconds?", answer: "Yes, both Unix seconds and milliseconds are supported." },
      { question: "Can I convert date strings too?", answer: "Yes, standard date strings can be parsed and converted." },
      {
        question: "Why do local and UTC values differ?",
        answer: "Local time includes your timezone offset, while UTC is timezone-neutral.",
      },
    ],
    related: ["date-format-converter", "cron-expression-parser", "uuid-generator", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-18",
  },
];

export const toolsBySlug = Object.fromEntries(tools.map((tool) => [tool.slug, tool]));

export const toolsByCategory = (category: ToolCategorySlug): ToolDefinition[] =>
  tools.filter((tool) => tool.categories.includes(category));

export const recentTools = (limit = 6): ToolDefinition[] =>
  [...tools]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
