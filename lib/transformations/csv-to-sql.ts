import { parseCsv } from "@/lib/transformations/csv";
import { ensureInput } from "@/lib/transformations/helpers";

export type SqlDialect = "generic" | "postgresql" | "mysql" | "sqlite";
export type SqlOutputMode = "create-and-insert" | "insert-only";
export type SqlColumnType = "INTEGER" | "DECIMAL" | "BOOLEAN" | "DATE" | "DATETIME" | "TEXT";

export type SqlColumnDefinition = {
  key: string;
  name: string;
  type: SqlColumnType;
};

export type CsvSqlAnalysis = {
  columns: SqlColumnDefinition[];
  rows: string[][];
  suggestedTableName: string;
};

export type CsvToSqlOptions = {
  tableName: string;
  dialect: SqlDialect;
  mode: SqlOutputMode;
  columns: SqlColumnDefinition[];
};

const nullLikeValues = new Set(["", "null", "nil", "none", "n/a"]);

function normalizeIdentifier(value: string, fallback: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

function makeUniqueIdentifiers(names: string[]): string[] {
  const counts = new Map<string, number>();

  return names.map((name) => {
    const current = counts.get(name) ?? 0;
    counts.set(name, current + 1);
    return current === 0 ? name : `${name}_${current + 1}`;
  });
}

function isInteger(value: string): boolean {
  return /^[-+]?\d+$/.test(value);
}

function isDecimal(value: string): boolean {
  return /^[-+]?\d*\.\d+$/.test(value);
}

function isBooleanLike(value: string): boolean {
  return /^(true|false|yes|no)$/i.test(value);
}

function isDateLike(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isDateTimeLike(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}[tT\s]\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value.includes("T") ? value : value.replace(" ", "T")));
}

function inferColumnType(values: string[]): SqlColumnType {
  const cleaned = values
    .map((value) => value.trim())
    .filter((value) => !nullLikeValues.has(value.toLowerCase()));

  if (cleaned.length === 0) {
    return "TEXT";
  }

  const allIntegers = cleaned.every((value) => isInteger(value));
  if (allIntegers) {
    return "INTEGER";
  }

  const allNumeric = cleaned.every((value) => isInteger(value) || isDecimal(value));
  if (allNumeric) {
    return "DECIMAL";
  }

  if (cleaned.every((value) => isBooleanLike(value))) {
    return "BOOLEAN";
  }

  const allDateOrDateTime = cleaned.every((value) => isDateLike(value) || isDateTimeLike(value));
  if (allDateOrDateTime) {
    return cleaned.some((value) => isDateTimeLike(value)) ? "DATETIME" : "DATE";
  }

  return "TEXT";
}

function quoteIdentifier(name: string, dialect: SqlDialect): string {
  if (dialect === "mysql") {
    return `\`${name.replace(/`/g, "``")}\``;
  }

  return `"${name.replace(/"/g, '""')}"`;
}

function mapType(type: SqlColumnType, dialect: SqlDialect): string {
  if (dialect === "postgresql") {
    if (type === "DECIMAL") return "NUMERIC";
    if (type === "DATETIME") return "TIMESTAMP";
    return type;
  }

  if (dialect === "mysql") {
    if (type === "INTEGER") return "INT";
    if (type === "DECIMAL") return "DECIMAL(18,6)";
    return type;
  }

  if (dialect === "sqlite") {
    if (type === "DECIMAL") return "REAL";
    if (type === "BOOLEAN") return "INTEGER";
    if (type === "DATE" || type === "DATETIME") return "TEXT";
    return type;
  }

  return type;
}

function toBooleanLiteral(value: string, dialect: SqlDialect): string {
  const positive = /^(true|yes|1)$/i.test(value);
  if (dialect === "sqlite") {
    return positive ? "1" : "0";
  }
  return positive ? "TRUE" : "FALSE";
}

function escapeStringValue(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function toSqlValue(rawValue: string, type: SqlColumnType, dialect: SqlDialect): string {
  const trimmed = rawValue.trim();
  if (nullLikeValues.has(trimmed.toLowerCase())) {
    return "NULL";
  }

  if ((type === "INTEGER" || type === "DECIMAL") && /^[-+]?\d+(\.\d+)?$/.test(trimmed)) {
    return trimmed;
  }

  if (type === "BOOLEAN") {
    if (/^(true|false|yes|no|1|0)$/i.test(trimmed)) {
      return toBooleanLiteral(trimmed, dialect);
    }
    return escapeStringValue(trimmed);
  }

  return escapeStringValue(trimmed);
}

export function analyzeCsvForSql(input: string): CsvSqlAnalysis {
  const rows = parseCsv(ensureInput(input));
  if (rows.length < 2) {
    throw new Error("CSV to SQL requires a header row and at least one data row.");
  }

  const headers = rows[0].map((header, index) => normalizeIdentifier(header, `column_${index + 1}`));
  const uniqueHeaders = makeUniqueIdentifiers(headers);
  const dataRows = rows.slice(1);

  const columns = uniqueHeaders.map((header, index) => {
    const values = dataRows.map((row) => row[index] ?? "");
    return {
      key: `col_${index}`,
      name: header,
      type: inferColumnType(values),
    } as SqlColumnDefinition;
  });

  return {
    columns,
    rows: dataRows,
    suggestedTableName: "imported_data",
  };
}

function validateSqlOptions(options: CsvToSqlOptions): void {
  if (!options.tableName.trim()) {
    throw new Error("Please provide a table name.");
  }

  if (options.columns.length === 0) {
    throw new Error("No columns detected from CSV input.");
  }

  options.columns.forEach((column, index) => {
    if (!column.name.trim()) {
      throw new Error(`Column ${index + 1} name cannot be empty.`);
    }
  });
}

export function generateSqlFromCsvRows(rows: string[][], options: CsvToSqlOptions): string {
  validateSqlOptions(options);

  if (options.mode === "insert-only" && rows.length === 0) {
    throw new Error("INSERT-only mode requires at least one CSV data row.");
  }

  const tableName = quoteIdentifier(normalizeIdentifier(options.tableName, "imported_data"), options.dialect);
  const quotedColumns = options.columns.map((column) =>
    quoteIdentifier(normalizeIdentifier(column.name, column.key), options.dialect),
  );

  const statements: string[] = [];

  if (options.mode === "create-and-insert") {
    const createLines = options.columns.map((column, index) => {
      const columnName = quotedColumns[index];
      const mappedType = mapType(column.type, options.dialect);
      return `  ${columnName} ${mappedType}`;
    });

    statements.push(`CREATE TABLE ${tableName} (\n${createLines.join(",\n")}\n);`);
  }

  if (rows.length > 0) {
    const values = rows
      .map((row) => {
        const sqlValues = options.columns.map((column, index) => {
          const value = row[index] ?? "";
          return toSqlValue(value, column.type, options.dialect);
        });

        return `(${sqlValues.join(", ")})`;
      })
      .join(",\n");

    statements.push(
      `INSERT INTO ${tableName} (${quotedColumns.join(", ")})\nVALUES\n${values};`,
    );
  }

  return statements.join("\n\n");
}
