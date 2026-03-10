import { parseCsv, toCsv } from "@/lib/transformations/csv";
import { ensureInput } from "@/lib/transformations/helpers";

export type CsvCleanerOptions = {
  trimWhitespace: boolean;
  removeEmptyRows: boolean;
  removeEmptyColumns: boolean;
  deduplicateRows: boolean;
  normalizeHeaders: boolean;
  lowercaseEmails: boolean;
  normalizePhoneNumbers: boolean;
  standardizeLineEndings: boolean;
};

export type CsvCleanerResult = {
  cleanedCsv: string;
  headers: string[];
  rows: string[][];
  originalRowCount: number;
  cleanedRowCount: number;
  removedRowCount: number;
};

const defaultOptions: CsvCleanerOptions = {
  trimWhitespace: true,
  removeEmptyRows: true,
  removeEmptyColumns: true,
  deduplicateRows: false,
  normalizeHeaders: false,
  lowercaseEmails: false,
  normalizePhoneNumbers: false,
  standardizeLineEndings: true,
};

function normalizeHeaderName(value: string, index: number): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || `column_${index + 1}`;
}

function uniqueHeaderNames(headers: string[]): string[] {
  const seen = new Map<string, number>();

  return headers.map((header) => {
    const count = seen.get(header) ?? 0;
    seen.set(header, count + 1);

    if (count === 0) {
      return header;
    }

    return `${header}_${count + 1}`;
  });
}

function isEmailLike(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  const phoneLike = /^[+()\-./\s\d]{7,}$/.test(trimmed) && digits.length >= 7;

  if (!phoneLike) {
    return value;
  }

  const hasPlus = trimmed.startsWith("+");
  return `${hasPlus ? "+" : ""}${digits}`;
}

function removeColumns(rows: string[][]): string[][] {
  if (rows.length === 0) {
    return rows;
  }

  const width = Math.max(...rows.map((row) => row.length));
  const keepIndexes: number[] = [];

  for (let index = 0; index < width; index += 1) {
    const hasValue = rows.some((row) => (row[index] ?? "").trim().length > 0);
    if (hasValue) {
      keepIndexes.push(index);
    }
  }

  if (keepIndexes.length === 0) {
    return rows;
  }

  return rows.map((row) => keepIndexes.map((index) => row[index] ?? ""));
}

export function cleanCsv(input: string, incomingOptions?: Partial<CsvCleanerOptions>): CsvCleanerResult {
  const options = { ...defaultOptions, ...incomingOptions };
  const parsedRows = parseCsv(ensureInput(input));

  if (parsedRows.length === 0) {
    throw new Error("CSV Cleaner found no rows to clean.");
  }

  let rows = parsedRows.map((row) => [...row]);

  if (options.trimWhitespace) {
    rows = rows.map((row) => row.map((cell) => cell.trim()));
  }

  if (options.removeEmptyRows) {
    rows = rows.filter((row, index) => {
      if (index === 0) {
        return true;
      }

      return row.some((cell) => cell.trim().length > 0);
    });
  }

  if (rows.length === 0) {
    throw new Error("CSV Cleaner found no usable rows after cleaning.");
  }

  if (options.removeEmptyColumns) {
    rows = removeColumns(rows);
  }

  const [headerRow, ...dataRows] = rows;

  if (!headerRow || headerRow.length === 0) {
    throw new Error("CSV Cleaner could not detect CSV headers.");
  }

  let headers = [...headerRow];

  if (options.normalizeHeaders) {
    headers = uniqueHeaderNames(headers.map((header, index) => normalizeHeaderName(header, index)));
  }

  const normalizedRows = dataRows.map((row) =>
    headers.map((_, index) => {
      const rawCell = row[index] ?? "";
      let value = rawCell;

      if (options.lowercaseEmails && isEmailLike(value)) {
        value = value.toLowerCase();
      }

      if (options.normalizePhoneNumbers) {
        value = normalizePhone(value);
      }

      return value;
    }),
  );

  const deduplicatedRows = options.deduplicateRows
    ? Array.from(new Map(normalizedRows.map((row) => [JSON.stringify(row), row])).values())
    : normalizedRows;

  if (deduplicatedRows.length === 0) {
    throw new Error("CSV Cleaner found no usable rows after cleaning.");
  }

  const finalRows = [headers, ...deduplicatedRows];

  const originalRowCount = Math.max(parsedRows.length - 1, 0);
  const cleanedRowCount = Math.max(finalRows.length - 1, 0);
  const removedRowCount = Math.max(originalRowCount - cleanedRowCount, 0);

  return {
    cleanedCsv: options.standardizeLineEndings ? toCsv(finalRows) : finalRows.map((row) => row.join(",")).join("\n"),
    headers,
    rows: deduplicatedRows,
    originalRowCount,
    cleanedRowCount,
    removedRowCount,
  };
}
