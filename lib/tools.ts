import type { ToolCategorySlug, ToolDefinition } from "@/lib/types";

export const tools: ToolDefinition[] = [
  {
    slug: "csv-to-json",
    title: "CSV to JSON Converter",
    shortDescription: "Convert CSV rows into JSON objects instantly.",
    tags: ["csv", "json", "converter", "spreadsheet", "data transformation"],
    intro: "Convert comma-separated values into structured JSON for APIs and JavaScript apps.",
    howToUse: [
      "Paste CSV with headers in the first row.",
      "Click Transform to generate JSON.",
      "Copy output or download the JSON file.",
    ],
    exampleInput: "name,email\nAna,ana@example.com",
    exampleOutput: '[\n  {\n    "name": "Ana",\n    "email": "ana@example.com"\n  }\n]',
    whyUseful: "Great for moving spreadsheet data into web apps quickly.",
    faq: [
      { question: "Does this support headers?", answer: "Yes. First CSV row is used as object keys." },
      { question: "Can I download output?", answer: "Yes, download button exports JSON." },
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
    shortDescription: "Turn JSON arrays into CSV for spreadsheets.",
    tags: ["json", "csv", "converter", "spreadsheet", "export"],
    intro: "Convert JSON arrays of objects into CSV format compatible with Excel and Sheets.",
    howToUse: ["Paste JSON array.", "Click Transform.", "Copy or download CSV."],
    exampleInput: '[{"name":"Ana","email":"ana@example.com"}]',
    exampleOutput: "name,email\nAna,ana@example.com",
    whyUseful: "Useful for exporting API data to spreadsheet workflows.",
    faq: [
      { question: "What JSON shape is expected?", answer: "A non-empty array of objects." },
      { question: "Are missing keys handled?", answer: "Yes. Missing values are left empty." },
    ],
    related: ["csv-to-json", "json-flatten-to-csv", "json-minifier", "csv-validator"],
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
    related: ["csv-validator", "csv-to-json", "csv-to-sql"],
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
    intro: "Validate that each CSV row has the same number of columns.",
    howToUse: ["Paste CSV text.", "Click Transform to validate.", "Review validation result."],
    exampleInput: "name,email\nAna,ana@example.com\nBob",
    exampleOutput: "CSV has structural issues:\nRow 3: expected 2 columns, found 1.",
    whyUseful: "Finds import-breaking CSV problems quickly.",
    faq: [
      { question: "Does it validate data types?", answer: "No, it validates CSV structure." },
      { question: "Will it report row numbers?", answer: "Yes, each issue includes the row number." },
    ],
    related: ["csv-cleaner", "csv-to-json", "json-validator"],
    kind: "standard",
    categories: ["csv-tools", "spreadsheet-tools"],
    createdAt: "2026-03-04",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    shortDescription: "Beautify JSON with indentation.",
    tags: ["json", "formatter", "beautify", "developer"],
    intro: "Format minified or compact JSON into readable structure.",
    howToUse: ["Paste JSON.", "Click Transform.", "Copy formatted JSON."],
    exampleInput: '{"name":"Ana","active":true}',
    exampleOutput: '{\n  "name": "Ana",\n  "active": true\n}',
    whyUseful: "Improves readability and debugging speed.",
    faq: [
      { question: "Does this validate JSON too?", answer: "Yes. Invalid JSON returns an error." },
      { question: "Will key order change?", answer: "No, existing key order is preserved." },
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
    intro: "Check whether your JSON is syntactically valid before using it.",
    howToUse: ["Paste JSON.", "Click Transform.", "Read validation result."],
    exampleInput: '{"name":"Ana"}',
    exampleOutput: "Valid JSON.",
    whyUseful: "Prevents parser errors in code and APIs.",
    faq: [
      { question: "Do you fix invalid JSON?", answer: "No, this tool validates and reports errors." },
      { question: "Can large files be checked?", answer: "Yes, if your browser can load them." },
    ],
    related: ["json-formatter", "json-minifier", "csv-to-json"],
    kind: "standard",
    categories: ["json-tools", "developer-tools"],
    createdAt: "2026-03-06",
  },
  {
    slug: "json-minifier",
    title: "JSON Minifier",
    shortDescription: "Compress JSON by removing whitespace.",
    tags: ["json", "minifier", "compress", "developer"],
    intro: "Minify JSON payloads for faster transfer and smaller file size.",
    howToUse: ["Paste JSON.", "Click Transform.", "Copy or download minified output."],
    exampleInput: '{\n  "name": "Ana"\n}',
    exampleOutput: '{"name":"Ana"}',
    whyUseful: "Reduces payload sizes in APIs and configs.",
    faq: [
      { question: "Does it change data?", answer: "No, only formatting whitespace is removed." },
      { question: "Can I download output?", answer: "Yes. Download as JSON is supported." },
    ],
    related: ["json-formatter", "json-validator", "json-to-csv"],
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
    intro: "Delete repeated lines from text and keep first occurrences.",
    howToUse: ["Paste text with one item per line.", "Click Transform.", "Copy deduplicated text."],
    exampleInput: "apple\nbanana\napple",
    exampleOutput: "apple\nbanana",
    whyUseful: "Useful for cleaning lists, tags, and logs.",
    faq: [
      { question: "Is original order preserved?", answer: "Yes. First appearance order is kept." },
      { question: "Case-sensitive?", answer: "Yes. 'A' and 'a' are treated as different lines." },
    ],
    related: ["sort-lines-alphabetically", "extract-emails", "extract-numbers"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-08",
  },
  {
    slug: "sort-lines-alphabetically",
    title: "Sort Lines Alphabetically",
    shortDescription: "Sort multiline text in alphabetical order.",
    tags: ["text", "sort", "alphabetical", "lines"],
    intro: "Order lines A-Z for easier review and deduplication.",
    howToUse: ["Paste lines.", "Click Transform.", "Copy sorted result."],
    exampleInput: "zebra\napple\nBanana",
    exampleOutput: "apple\nBanana\nzebra",
    whyUseful: "Useful for organizing keywords, names, and IDs.",
    faq: [
      { question: "Is sorting case-sensitive?", answer: "Sorting is case-insensitive." },
      { question: "Will blank lines stay?", answer: "Yes, blank lines are included in sorting." },
    ],
    related: ["remove-duplicate-lines", "extract-emails", "extract-numbers"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-09",
  },
  {
    slug: "extract-emails",
    title: "Extract Emails from Text",
    shortDescription: "Find and list emails from any text block.",
    tags: ["text", "email", "extract", "parser"],
    intro: "Extract email addresses from logs, documents, or pasted content.",
    howToUse: ["Paste text.", "Click Transform.", "Copy extracted email list."],
    exampleInput: "Contact ana@example.com or bob@site.io",
    exampleOutput: "ana@example.com\nbob@site.io",
    whyUseful: "Speeds up lead cleanup and data extraction tasks.",
    faq: [
      { question: "Are duplicates removed?", answer: "Yes. Output includes unique addresses." },
      { question: "What if none found?", answer: "Tool returns 'No emails found.'" },
    ],
    related: ["extract-numbers", "remove-duplicate-lines", "sort-lines-alphabetically"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-10",
  },
  {
    slug: "extract-numbers",
    title: "Extract Numbers from Text",
    shortDescription: "Pull numeric values from mixed text.",
    tags: ["text", "numbers", "extract", "parser"],
    intro: "Extract decimals and integers from paragraphs, logs, or notes.",
    howToUse: ["Paste text.", "Click Transform.", "Copy extracted numbers."],
    exampleInput: "Order 102, price 49.95, qty 3",
    exampleOutput: "102\n49.95\n3",
    whyUseful: "Quickly isolate numeric values for analysis.",
    faq: [
      { question: "Does it support decimals?", answer: "Yes. Decimal values are extracted." },
      { question: "Are negative numbers supported?", answer: "Yes." },
    ],
    related: ["extract-emails", "remove-duplicate-lines", "sort-lines-alphabetically"],
    kind: "standard",
    categories: ["text-tools"],
    createdAt: "2026-03-11",
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder",
    shortDescription: "Encode plain text into Base64 format.",
    tags: ["base64", "encoder", "developer", "text"],
    intro: "Convert regular text input into Base64 for transport, tokens, and quick debugging.",
    howToUse: ["Paste plain text.", "Click Transform.", "Copy the Base64 output."],
    exampleInput: "hello world",
    exampleOutput: "aGVsbG8gd29ybGQ=",
    whyUseful: "Useful when APIs or tools require Base64-encoded text payloads.",
    faq: [
      { question: "Does this support Unicode text?", answer: "Yes. Unicode text is encoded safely." },
      { question: "Can I encode multiline text?", answer: "Yes. Newlines are preserved in encoding." },
    ],
    related: ["base64-decoder", "url-encoder", "uuid-generator"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-12",
  },
  {
    slug: "base64-decoder",
    title: "Base64 Decoder",
    shortDescription: "Decode Base64 content back into readable text.",
    tags: ["base64", "decoder", "developer", "text"],
    intro: "Decode Base64 strings into plain text for inspection and debugging.",
    howToUse: ["Paste Base64 input.", "Click Transform.", "Copy decoded text output."],
    exampleInput: "aGVsbG8gd29ybGQ=",
    exampleOutput: "hello world",
    whyUseful: "Quickly inspect encoded values from APIs, logs, and payloads.",
    faq: [
      { question: "Why does decoding fail?", answer: "Input must be valid Base64 with proper padding." },
      { question: "Can I decode URL-safe Base64?", answer: "Standard Base64 input is expected." },
    ],
    related: ["base64-encoder", "url-decoder", "json-formatter"],
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
    whyUseful: "Saves time when you need valid UUIDs for test records and integrations.",
    faq: [
      { question: "Which UUID version is generated?", answer: "This tool generates UUID version 4 values." },
      { question: "Can I generate many IDs at once?", answer: "Yes, enter a number up to 100." },
    ],
    related: ["base64-encoder", "url-encoder", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-14",
  },
  {
    slug: "url-encoder",
    title: "URL Encoder",
    shortDescription: "Encode text for safe use in URL query strings.",
    tags: ["url", "encoder", "developer", "query string"],
    intro: "Encode reserved characters so text can be safely used in URLs and query parameters.",
    howToUse: ["Paste text.", "Click Transform.", "Copy encoded URL text."],
    exampleInput: "name=John Doe&city=New York",
    exampleOutput: "name%3DJohn%20Doe%26city%3DNew%20York",
    whyUseful: "Prevents URL-breaking characters from causing request and parsing issues.",
    faq: [
      { question: "When should I URL-encode text?", answer: "Encode text before placing it in query parameters." },
      { question: "Why are spaces changed?", answer: "Spaces are encoded to keep URLs valid and unambiguous." },
    ],
    related: ["url-decoder", "base64-encoder", "json-formatter"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-15",
  },
  {
    slug: "url-decoder",
    title: "URL Decoder",
    shortDescription: "Decode URL-encoded strings into readable text.",
    tags: ["url", "decoder", "developer", "query string"],
    intro: "Convert encoded URL strings back to human-readable text for debugging and analysis.",
    howToUse: ["Paste URL-encoded text.", "Click Transform.", "Copy decoded output."],
    exampleInput: "name%3DJohn%20Doe%26city%3DNew%20York",
    exampleOutput: "name=John Doe&city=New York",
    whyUseful: "Makes encoded query strings and logs easier to inspect and troubleshoot.",
    faq: [
      { question: "What if decoding fails?", answer: "Input may contain malformed percent-encoding." },
      { question: "Does this decode full URLs?", answer: "Yes, encoded URL strings and query values are supported." },
    ],
    related: ["url-encoder", "base64-decoder", "extract-emails"],
    kind: "standard",
    categories: ["developer-tools"],
    createdAt: "2026-03-16",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    shortDescription: "Test regular expressions against sample text instantly.",
    tags: ["regex", "tester", "developer", "pattern matching"],
    intro:
      "Validate regular expression patterns and quickly inspect matching results using your own input text.",
    howToUse: [
      "Enter the regex on the first line using /pattern/flags format, or plain pattern text.",
      "Add the test text on the following lines.",
      "Click Transform to view match count and matched values.",
    ],
    exampleInput: "/\\b\\w{4}\\b/g\nThis line has many word tokens in text.",
    exampleOutput:
      "Pattern: /\\b\\w{4}\\b/g\nTotal matches: 5\nMatches:\n1. This\n2. line\n3. many\n4. word\n5. text",
    whyUseful:
      "Helps developers debug and validate regex patterns before using them in code, filters, or search logic.",
    faq: [
      { question: "Can I use regex flags?", answer: "Yes. Use /pattern/flags syntax such as /test/gi." },
      { question: "Does it show all matches?", answer: "Yes, it reports total matches and each matched value." },
    ],
    related: ["extract-emails", "extract-numbers", "json-validator"],
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
    faq: [
      { question: "Does this verify JWT signatures?", answer: "No. This tool decodes token content only and does not verify signatures." },
      { question: "Is my token uploaded?", answer: "No. Decoding happens in your browser." },
    ],
    related: ["base64-decoder", "json-formatter", "json-validator", "url-decoder"],
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
      "Create deterministic hash digests from text using MD5, SHA-1, SHA-256, SHA-384, or SHA-512.",
    howToUse: [
      "Paste text into the input field.",
      "Choose a hash algorithm from the dropdown.",
      "Generate and copy/download the hash output.",
    ],
    exampleInput: "hello world",
    exampleOutput: "5eb63bbbe01eeed093cb22bb8f5acdc3",
    whyUseful:
      "Useful for checksums, deterministic IDs, and validating content integrity across systems.",
    faq: [
      { question: "Which algorithms are supported?", answer: "MD5, SHA-1, SHA-256, SHA-384, and SHA-512 are supported." },
      { question: "Should I use MD5 for security?", answer: "No. MD5 is weak for security purposes and should only be used for compatibility checks." },
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
    related: ["timestamp-converter", "date-format-converter", "regex-tester", "url-parser"],
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
      "Make SQL easier to read by normalizing whitespace, uppercasing keywords, and adding line breaks around clauses.",
    howToUse: [
      "Paste SQL query text.",
      "Click Transform to format the query.",
      "Copy or download the formatted SQL output.",
    ],
    exampleInput: "select id,name from users where active = 1 order by name",
    exampleOutput: "SELECT id, name\nFROM users\nWHERE active = 1\nORDER BY name",
    whyUseful:
      "Improves readability in pull requests, debugging sessions, and SQL query reviews.",
    faq: [
      { question: "Is this a dialect-aware formatter?", answer: "No. It is a lightweight formatter for common SQL patterns." },
      { question: "Does it change query logic?", answer: "No. It only changes formatting." },
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
    shortDescription: "Parse URLs into protocol, host, path, hash, and query parameters.",
    tags: ["url parser", "parse query string", "url analyzer", "developer tools"],
    intro:
      "Break a full URL into structured components and decoded query parameters for debugging.",
    howToUse: [
      "Paste a full absolute URL including protocol.",
      "Click Transform to parse URL components.",
      "Inspect and copy/download the parsed JSON output.",
    ],
    exampleInput:
      "https://example.com:8080/path/to/page?utm_source=newsletter&id=42#section",
    exampleOutput:
      '{\n  "protocol": "https:",\n  "host": "example.com:8080",\n  "pathname": "/path/to/page",\n  "queryParams": {\n    "utm_source": "newsletter",\n    "id": "42"\n  }\n}',
    whyUseful:
      "Useful for debugging redirects, query params, tracking links, and API callback URLs.",
    faq: [
      { question: "Does this support relative URLs?", answer: "No. Input must be an absolute URL with protocol." },
      { question: "How are duplicate query params shown?", answer: "Duplicate keys are returned as arrays." },
    ],
    related: ["url-encoder", "url-decoder", "jwt-decoder", "regex-tester"],
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
      "Convert Unix seconds, Unix milliseconds, or date strings into UTC, local time, and normalized timestamp output.",
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
    faq: [
      { question: "Does it support seconds and milliseconds?", answer: "Yes, both Unix seconds and milliseconds are supported." },
      { question: "Can I convert date strings too?", answer: "Yes, standard date strings can be parsed and converted." },
    ],
    related: ["json-formatter", "uuid-generator", "url-decoder"],
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
