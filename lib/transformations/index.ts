import type { TransformResult } from "@/lib/types";
import {
  ensureInput,
  normalizeLines,
  parseJsonInput,
  toJsonSyntaxErrorMessage,
  toTransformResult,
  uniqueValues,
  withTransformErrorBoundary,
} from "@/lib/transformations/helpers";
import {
  parseCsv,
  parseSpreadsheetLikeInput,
  rowsToHtmlTable,
  toCsv,
} from "@/lib/transformations/csv";
import { cleanCsv } from "@/lib/transformations/csv-cleaner";
import { analyzeCsvForSql, generateSqlFromCsvRows } from "@/lib/transformations/csv-to-sql";
import { flattenJson } from "@/lib/transformations/json-flatten";

const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const numberRegex = /[-+]?\d*\.?\d+/g;
const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

function csvToJson(input: string): TransformResult {
  const rows = parseCsv(ensureInput(input));
  if (rows.length < 2) {
    throw new Error("CSV to JSON requires a header row and at least one data row.");
  }

  const headers = rows[0];
  const objects = rows.slice(1).map((row) => {
    const result: Record<string, string> = {};
    headers.forEach((header, index) => {
      result[header || `column_${index + 1}`] = row[index] ?? "";
    });
    return result;
  });

  return toTransformResult(
    JSON.stringify(objects, null, 2),
    "converted.json",
    "application/json",
  );
}

function jsonToCsv(input: string): TransformResult {
  const parsed = parseJsonInput(input, "JSON to CSV");
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("JSON to CSV requires a non-empty array of objects.");
  }

  const headers = Array.from(
    parsed.reduce((acc: Set<string>, item: unknown) => {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        Object.keys(item).forEach((key) => acc.add(key));
      }
      return acc;
    }, new Set<string>()),
  );

  if (headers.length === 0) {
    throw new Error("JSON to CSV could not find object keys to build columns.");
  }

  const rows = [
    headers,
    ...parsed.map((item) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new Error("JSON to CSV requires every array item to be an object.");
      }

      return headers.map((header) => String((item as Record<string, unknown>)[header] ?? ""));
    }),
  ];

  return toTransformResult(toCsv(rows), "converted.csv", "text/csv");
}

function csvCleaner(input: string): TransformResult {
  const cleaned = cleanCsv(input, {
    trimWhitespace: true,
    removeEmptyRows: true,
    removeEmptyColumns: true,
    deduplicateRows: true,
    normalizeHeaders: true,
    lowercaseEmails: true,
    normalizePhoneNumbers: false,
    standardizeLineEndings: true,
  });

  return toTransformResult(cleaned.cleanedCsv, "cleaned.csv", "text/csv");
}

function csvValidator(input: string): TransformResult {
  const rows = parseCsv(ensureInput(input));
  if (rows.length === 0) {
    throw new Error("CSV Validator found no rows to validate.");
  }

  const expectedColumns = rows[0].length;
  const invalidRows: string[] = [];

  rows.forEach((row, index) => {
    if (row.length !== expectedColumns) {
      invalidRows.push(
        `Row ${index + 1}: expected ${expectedColumns} columns, found ${row.length}.`,
      );
    }
  });

  if (invalidRows.length === 0) {
    return toTransformResult(
      `Valid CSV. ${rows.length} rows checked with ${expectedColumns} columns.`,
    );
  }

  return toTransformResult(`CSV has structural issues:\n${invalidRows.join("\n")}`);
}

function csvToExcel(input: string): TransformResult {
  const rows = parseCsv(ensureInput(input));
  if (rows.length === 0) {
    throw new Error("CSV to Excel requires at least one row.");
  }

  const table = rowsToHtmlTable(rows);
  const html = `<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`;
  return toTransformResult(html, "converted.xls", "application/vnd.ms-excel");
}

function excelToCsv(input: string): TransformResult {
  const rows = parseSpreadsheetLikeInput(ensureInput(input));
  if (rows.length === 0) {
    throw new Error("Excel to CSV found no spreadsheet data.");
  }

  return toTransformResult(toCsv(rows), "converted.csv", "text/csv");
}

function jsonFormatter(input: string): TransformResult {
  return toTransformResult(
    JSON.stringify(parseJsonInput(input, "JSON Formatter"), null, 2),
  );
}

function jsonValidator(input: string): TransformResult {
  const source = ensureInput(input);
  try {
    JSON.parse(source);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(toJsonSyntaxErrorMessage(source, "JSON Validator", error));
    }
    throw error;
  }
  return toTransformResult("Valid JSON.");
}

function jsonMinifier(input: string): TransformResult {
  return toTransformResult(
    JSON.stringify(parseJsonInput(input, "JSON Minifier")),
    "minified.json",
    "application/json",
  );
}

function removeDuplicateLines(input: string): TransformResult {
  const deduped = uniqueValues(normalizeLines(input));
  return toTransformResult(deduped.join("\n"));
}

function sortLinesAlphabetically(input: string): TransformResult {
  const sorted = normalizeLines(input).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

  return toTransformResult(sorted.join("\n"));
}

function extractEmails(input: string): TransformResult {
  const matches = ensureInput(input).match(emailRegex) ?? [];
  return toTransformResult(uniqueValues(matches).join("\n") || "No emails found.");
}

function extractNumbers(input: string): TransformResult {
  const matches = ensureInput(input).match(numberRegex) ?? [];
  return toTransformResult(matches.join("\n") || "No numbers found.");
}

function encodeBase64Utf8(value: string): string {
  if (typeof btoa === "function" && typeof TextEncoder !== "undefined") {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64Utf8(value: string): string {
  if (typeof atob === "function" && typeof TextDecoder !== "undefined") {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  return Buffer.from(value, "base64").toString("utf8");
}

function validateBase64Input(value: string): string {
  const cleaned = value.trim().replace(/\s+/g, "");
  if (!cleaned) {
    throw new Error("Please provide input.");
  }

  if (!base64Regex.test(cleaned) || cleaned.length % 4 !== 0) {
    throw new Error("Base64 Decoder requires valid Base64 input.");
  }

  return cleaned;
}

function base64Encoder(input: string): TransformResult {
  return toTransformResult(encodeBase64Utf8(ensureInput(input)));
}

function base64Decoder(input: string): TransformResult {
  const cleaned = validateBase64Input(input);

  try {
    return toTransformResult(decodeBase64Utf8(cleaned));
  } catch {
    throw new Error("Base64 Decoder requires valid Base64 input.");
  }
}

function uuidGenerator(input: string): TransformResult {
  const trimmed = input.trim();
  const count = trimmed ? Number(trimmed) : 1;

  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error("UUID Generator expects a whole number between 1 and 100.");
  }

  const uuids = Array.from({ length: count }, () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    // Fallback v4 format for environments without crypto.randomUUID.
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = Math.floor(Math.random() * 16);
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  });

  return toTransformResult(uuids.join("\n"));
}

function urlEncoder(input: string): TransformResult {
  return toTransformResult(encodeURIComponent(ensureInput(input)));
}

function urlDecoder(input: string): TransformResult {
  try {
    return toTransformResult(decodeURIComponent(ensureInput(input)));
  } catch (error) {
    if (error instanceof Error && error.message === "Please provide input.") {
      throw error;
    }
    throw new Error("URL Decoder requires valid URL-encoded input.");
  }
}

function parseRegexDescriptor(descriptor: string): { pattern: string; flags: string } {
  const slashFormat = descriptor.match(/^\/([\s\S]*)\/([dgimsuvy]*)$/);
  if (slashFormat) {
    return { pattern: slashFormat[1], flags: slashFormat[2] };
  }

  return { pattern: descriptor, flags: "" };
}

function regexTester(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [descriptor, ...textLines] = normalized.split("\n");
  const text = textLines.join("\n");

  if (!descriptor.trim()) {
    throw new Error("Regex Tester requires a pattern on the first line.");
  }

  if (!text.trim()) {
    throw new Error("Regex Tester requires test text below the pattern.");
  }

  const { pattern, flags } = parseRegexDescriptor(descriptor.trim());

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    throw new Error("Regex Tester requires a valid regular expression pattern.");
  }

  const globalFlags = flags.includes("g") ? flags : `${flags}g`;
  const matcher = new RegExp(regex.source, globalFlags);
  const matches = Array.from(text.matchAll(matcher), (match) => match[0]);

  if (matches.length === 0) {
    return toTransformResult(`Pattern: /${pattern}/${flags}\nTotal matches: 0\nNo matches found.`);
  }

  const lines = matches.map((value, index) => `${index + 1}. ${value}`).join("\n");
  return toTransformResult(
    `Pattern: /${pattern}/${flags}\nTotal matches: ${matches.length}\nMatches:\n${lines}`,
  );
}

function timestampConverter(input: string): TransformResult {
  const raw = ensureInput(input).trim();
  let date: Date;
  let milliseconds: number;

  if (/^-?\d+$/.test(raw)) {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) {
      throw new Error("Timestamp Converter requires a valid timestamp or date string.");
    }

    // Infer seconds vs milliseconds using magnitude to handle negatives correctly.
    milliseconds = Math.abs(numeric) < 1e12 ? numeric * 1000 : numeric;
    date = new Date(milliseconds);
  } else {
    date = new Date(raw);
    milliseconds = date.getTime();
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Timestamp Converter requires a valid timestamp or date string.");
  }

  return toTransformResult(
    JSON.stringify(
      {
        input: raw,
        unixSeconds: Math.floor(milliseconds / 1000),
        unixMilliseconds: milliseconds,
        utc: date.toISOString(),
        local: date.toString(),
      },
      null,
      2,
    ),
  );
}

function csvToSql(input: string): TransformResult {
  const analysis = analyzeCsvForSql(input);
  const sql = generateSqlFromCsvRows(analysis.rows, {
    tableName: analysis.suggestedTableName,
    dialect: "generic",
    mode: "create-and-insert",
    columns: analysis.columns,
  });

  return toTransformResult(sql, "generated.sql", "text/sql");
}

function csvColumnMapper(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [mappingBlock, csvBlock] = normalized.split(/\n\s*\n/, 2);

  if (!mappingBlock || !csvBlock) {
    throw new Error(
      "CSV Column Mapper requires mapping rules first, then a blank line, then CSV data.",
    );
  }

  const mappingEntries = mappingBlock
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (mappingEntries.length === 0) {
    throw new Error("CSV Column Mapper requires at least one mapping rule.");
  }

  const mapping = new Map<string, string>();
  mappingEntries.forEach((entry) => {
    const [source, target, ...rest] = entry.split(":").map((value) => value.trim());
    if (!source || !target || rest.length > 0) {
      throw new Error(
        "CSV Column Mapper mapping rules must use source:target format, e.g. name:full_name.",
      );
    }
    mapping.set(source, target);
  });

  const rows = parseCsv(csvBlock);
  if (rows.length === 0) {
    throw new Error("CSV Column Mapper requires CSV data with a header row.");
  }

  const nextHeaders = rows[0].map((header) => mapping.get(header) ?? header);
  const uniqueHeaders = new Set(nextHeaders);
  if (uniqueHeaders.size !== nextHeaders.length) {
    throw new Error("CSV Column Mapper produced duplicate target headers. Adjust mapping rules.");
  }

  const outputRows = [nextHeaders, ...rows.slice(1)];
  return toTransformResult(toCsv(outputRows), "mapped.csv", "text/csv");
}

function inferJsonSchema(value: unknown): Record<string, unknown> {
  if (value === null) {
    return { type: "null" };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: "array", items: {} };
    }

    const itemSchema = value
      .map((item) => inferJsonSchema(item))
      .reduce((acc, schema) => mergeJsonSchemas(acc, schema));

    return { type: "array", items: itemSchema };
  }

  switch (typeof value) {
    case "string":
      return { type: "string" };
    case "number":
      return { type: Number.isInteger(value) ? "integer" : "number" };
    case "boolean":
      return { type: "boolean" };
    case "object": {
      const objectValue = value as Record<string, unknown>;
      const properties = Object.fromEntries(
        Object.entries(objectValue).map(([key, nested]) => [key, inferJsonSchema(nested)]),
      );
      return {
        type: "object",
        properties,
        required: Object.keys(objectValue),
      };
    }
    default:
      return {};
  }
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function schemaSignature(schema: unknown): string {
  if (!schema || typeof schema !== "object") {
    return JSON.stringify(schema);
  }

  if (Array.isArray(schema)) {
    return `[${schema.map((item) => schemaSignature(item)).sort().join(",")}]`;
  }

  const entries = Object.entries(schema as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `"${key}":${schemaSignature(value)}`);
  return `{${entries.join(",")}}`;
}

function mergeJsonSchemas(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): Record<string, unknown> {
  if (schemaSignature(left) === schemaSignature(right)) {
    return left;
  }

  if (left.type === "object" && right.type === "object") {
    const leftProperties = (left.properties as Record<string, Record<string, unknown>>) ?? {};
    const rightProperties = (right.properties as Record<string, Record<string, unknown>>) ?? {};
    const allKeys = Array.from(
      new Set([...Object.keys(leftProperties), ...Object.keys(rightProperties)]),
    );

    const mergedProperties = Object.fromEntries(
      allKeys.map((key) => {
        const leftSchema = leftProperties[key];
        const rightSchema = rightProperties[key];
        if (leftSchema && rightSchema) {
          return [key, mergeJsonSchemas(leftSchema, rightSchema)];
        }
        return [key, leftSchema ?? rightSchema];
      }),
    );

    const leftRequired = asArray(left.required as string[] | string | undefined);
    const rightRequired = asArray(right.required as string[] | string | undefined);
    const required = leftRequired.filter((key) => rightRequired.includes(key));

    return {
      type: "object",
      properties: mergedProperties,
      ...(required.length > 0 ? { required } : {}),
    };
  }

  if (left.type === "array" && right.type === "array") {
    const leftItems = (left.items as Record<string, unknown>) ?? {};
    const rightItems = (right.items as Record<string, unknown>) ?? {};
    return {
      type: "array",
      items: mergeJsonSchemas(leftItems, rightItems),
    };
  }

  const variants = [...asArray(left.anyOf as Record<string, unknown>[] | undefined), ...asArray(right.anyOf as Record<string, unknown>[] | undefined)];
  const seeds = variants.length > 0 ? variants : [left, right];
  const unique = Array.from(new Map(seeds.map((schema) => [schemaSignature(schema), schema])).values());
  return { anyOf: unique };
}

function jsonSchemaGenerator(input: string): TransformResult {
  const parsed = parseJsonInput(input, "JSON Schema Generator");
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    ...inferJsonSchema(parsed),
  };
  return toTransformResult(JSON.stringify(schema, null, 2), "schema.json", "application/json");
}

function ndjsonToCsv(input: string): TransformResult {
  const lines = ensureInput(input)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("NDJSON to CSV requires at least one JSON object line.");
  }

  const records = lines.map((line, index) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      throw new Error(`NDJSON to CSV found invalid JSON at line ${index + 1}.`);
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error(`NDJSON to CSV expects objects on each line. Invalid record at line ${index + 1}.`);
    }

    return parsed as Record<string, unknown>;
  });

  const headers = Array.from(
    records.reduce((set, record) => {
      Object.keys(record).forEach((key) => set.add(key));
      return set;
    }, new Set<string>()),
  );

  const rows = [
    headers,
    ...records.map((record) =>
      headers.map((header) => {
        const value = record[header];
        if (value === null || value === undefined) {
          return "";
        }
        if (typeof value === "object") {
          return JSON.stringify(value);
        }
        return String(value);
      }),
    ),
  ];

  return toTransformResult(toCsv(rows), "converted.csv", "text/csv");
}

function jsonFlattenToCsv(input: string): TransformResult {
  const result = flattenJson(input);
  return toTransformResult(result.csv, "flattened.csv", "text/csv");
}

export const transformations: Record<string, (input: string) => TransformResult> = {
  "csv-column-mapper": withTransformErrorBoundary(csvColumnMapper),
  "csv-to-json": withTransformErrorBoundary(csvToJson),
  "csv-to-sql": withTransformErrorBoundary(csvToSql),
  "json-schema-generator": withTransformErrorBoundary(jsonSchemaGenerator),
  "json-to-csv": withTransformErrorBoundary(jsonToCsv),
  "ndjson-to-csv": withTransformErrorBoundary(ndjsonToCsv),
  "json-flatten-to-csv": withTransformErrorBoundary(jsonFlattenToCsv),
  "csv-cleaner": withTransformErrorBoundary(csvCleaner),
  "csv-validator": withTransformErrorBoundary(csvValidator),
  "csv-to-excel": withTransformErrorBoundary(csvToExcel),
  "excel-to-csv": withTransformErrorBoundary(excelToCsv),
  "json-formatter": withTransformErrorBoundary(jsonFormatter),
  "json-validator": withTransformErrorBoundary(jsonValidator),
  "json-minifier": withTransformErrorBoundary(jsonMinifier),
  "remove-duplicate-lines": withTransformErrorBoundary(removeDuplicateLines),
  "sort-lines-alphabetically": withTransformErrorBoundary(sortLinesAlphabetically),
  "extract-emails": withTransformErrorBoundary(extractEmails),
  "extract-numbers": withTransformErrorBoundary(extractNumbers),
  "base64-encoder": withTransformErrorBoundary(base64Encoder),
  "base64-decoder": withTransformErrorBoundary(base64Decoder),
  "uuid-generator": withTransformErrorBoundary(uuidGenerator),
  "url-encoder": withTransformErrorBoundary(urlEncoder),
  "url-decoder": withTransformErrorBoundary(urlDecoder),
  "regex-tester": withTransformErrorBoundary(regexTester),
  "timestamp-converter": withTransformErrorBoundary(timestampConverter),
};
