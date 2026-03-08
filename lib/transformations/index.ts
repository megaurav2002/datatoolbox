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
  const rows = parseCsv(ensureInput(input)).map((row) => row.map((cell) => cell.trim()));
  const nonEmptyRows = rows.filter((row) => row.some((cell) => cell.length > 0));

  if (nonEmptyRows.length === 0) {
    throw new Error("CSV Cleaner found no usable rows after cleaning.");
  }

  return toTransformResult(toCsv(nonEmptyRows), "cleaned.csv", "text/csv");
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

export const transformations: Record<string, (input: string) => TransformResult> = {
  "csv-to-json": withTransformErrorBoundary(csvToJson),
  "json-to-csv": withTransformErrorBoundary(jsonToCsv),
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
};
