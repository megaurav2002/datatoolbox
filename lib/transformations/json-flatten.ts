import { parseJsonInput } from "@/lib/transformations/helpers";
import { toCsv } from "@/lib/transformations/csv";

export type FlattenedRow = Record<string, unknown>;

export type FlattenResult = {
  headers: string[];
  rows: FlattenedRow[];
  csv: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function flattenObject(
  input: Record<string, unknown>,
  prefix = "",
  output: Record<string, unknown> = {},
): Record<string, unknown> {
  Object.entries(input).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      output[path] = JSON.stringify(value);
      return;
    }

    if (isPlainObject(value)) {
      flattenObject(value, path, output);
      return;
    }

    output[path] = value;
  });

  return output;
}

function toCell(value: unknown): string {
  if (value === null || typeof value === "undefined") {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

export function flattenJson(input: string): FlattenResult {
  const parsed = parseJsonInput(input, "JSON Flatten");

  let sourceRows: Record<string, unknown>[];

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      throw new Error("JSON Flatten requires a non-empty object or array of objects.");
    }

    sourceRows = parsed.map((item, index) => {
      if (!isPlainObject(item)) {
        throw new Error(`JSON Flatten expects object items. Item ${index + 1} is not an object.`);
      }
      return item;
    });
  } else if (isPlainObject(parsed)) {
    sourceRows = [parsed];
  } else {
    throw new Error("JSON Flatten requires a JSON object or array of objects.");
  }

  const rows = sourceRows.map((row) => flattenObject(row));
  const headers = Array.from(
    rows.reduce((acc, row) => {
      Object.keys(row).forEach((key) => acc.add(key));
      return acc;
    }, new Set<string>()),
  );

  if (headers.length === 0) {
    throw new Error("JSON Flatten found no keys to output.");
  }

  const csvRows = [
    headers,
    ...rows.map((row) => headers.map((header) => toCell(row[header]))),
  ];

  return {
    headers,
    rows,
    csv: toCsv(csvRows),
  };
}
