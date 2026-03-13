import type { TransformResult } from "@/lib/types";
import { parseCsv, toCsv } from "@/lib/transformations/csv";
import { ensureInput, parseJsonInput, toTransformResult } from "@/lib/transformations/helpers";

function parseJsonPath(path: string): Array<string | number> {
  const trimmed = path.trim();
  if (!trimmed) {
    throw new Error("JSON Path Extractor requires a path on the first line.");
  }

  const tokens: Array<string | number> = [];
  const regex = /([^.[\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;

  while (true) {
    match = regex.exec(trimmed);
    if (!match) {
      break;
    }

    if (match[1]) {
      tokens.push(match[1]);
    } else if (match[2]) {
      tokens.push(Number(match[2]));
    }
  }

  if (tokens.length === 0) {
    throw new Error("JSON Path Extractor requires a valid dot/bracket path like user.name or items[0].id.");
  }

  return tokens;
}

function resolveJsonPath(source: unknown, tokens: Array<string | number>): unknown {
  let current: unknown = source;

  for (const token of tokens) {
    if (typeof token === "number") {
      if (!Array.isArray(current) || token < 0 || token >= current.length) {
        throw new Error("JSON Path Extractor: path not found in input JSON.");
      }
      current = current[token];
      continue;
    }

    if (typeof current !== "object" || current === null || !(token in current)) {
      throw new Error("JSON Path Extractor: path not found in input JSON.");
    }

    current = (current as Record<string, unknown>)[token];
  }

  return current;
}

export function jsonPathExtractor(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [pathLine, ...jsonLines] = normalized.split("\n");
  const jsonSource = jsonLines.join("\n").trim();

  if (!jsonSource) {
    throw new Error("JSON Path Extractor requires JSON input after the path line.");
  }

  const tokens = parseJsonPath(pathLine);
  const parsed = parseJsonInput(jsonSource, "JSON Path Extractor");
  const value = resolveJsonPath(parsed, tokens);

  if (typeof value === "string") {
    return toTransformResult(value);
  }

  return toTransformResult(JSON.stringify(value, null, 2));
}

type CronField = {
  name: string;
  min: number;
  max: number;
  labels?: Record<number, string>;
};

const dayOfWeekLabels: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const monthLabels: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

function formatCronValue(value: number, labels?: Record<number, string>): string {
  if (labels && labels[value]) {
    return `${labels[value]} (${value})`;
  }
  return String(value);
}

function parseCronNumber(raw: string, field: CronField): number {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < field.min || value > field.max) {
    throw new Error(`Cron Expression Parser: ${field.name} value must be between ${field.min} and ${field.max}.`);
  }
  return value;
}

function describeCronField(expression: string, field: CronField): string {
  if (expression === "*") {
    return `Every ${field.name}`;
  }

  if (expression.startsWith("*/")) {
    const stepRaw = Number(expression.slice(2));
    if (!Number.isInteger(stepRaw) || stepRaw < 1 || stepRaw > field.max) {
      throw new Error(`Cron Expression Parser: ${field.name} step value must be between 1 and ${field.max}.`);
    }
    const step = stepRaw;
    return `Every ${step} ${field.name}${step > 1 ? "s" : ""}`;
  }

  if (expression.includes(",")) {
    const values = expression
      .split(",")
      .map((part) => parseCronNumber(part, field))
      .map((value) => formatCronValue(value, field.labels));
    return `${field.name} at ${values.join(", ")}`;
  }

  if (expression.includes("-")) {
    const [startRaw, endRaw] = expression.split("-");
    const start = parseCronNumber(startRaw, field);
    const end = parseCronNumber(endRaw, field);
    if (start > end) {
      throw new Error(`Cron Expression Parser: ${field.name} range start must be <= end.`);
    }
    return `${field.name} from ${formatCronValue(start, field.labels)} to ${formatCronValue(end, field.labels)}`;
  }

  const value = parseCronNumber(expression, field);
  return `${field.name} at ${formatCronValue(value, field.labels)}`;
}

export function cronExpressionParser(input: string): TransformResult {
  const raw = ensureInput(input).trim();
  const parts = raw.split(/\s+/);
  if (parts.length !== 5) {
    throw new Error("Cron Expression Parser requires 5 fields: minute hour day-of-month month day-of-week.");
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const lines = [
    `Expression: ${raw}`,
    describeCronField(minute, { name: "minute", min: 0, max: 59 }),
    describeCronField(hour, { name: "hour", min: 0, max: 23 }),
    describeCronField(dayOfMonth, { name: "day-of-month", min: 1, max: 31 }),
    describeCronField(month, { name: "month", min: 1, max: 12, labels: monthLabels }),
    describeCronField(dayOfWeek, { name: "day-of-week", min: 0, max: 7, labels: dayOfWeekLabels }),
  ];

  return toTransformResult(lines.join("\n"));
}

const sqlKeywordPattern = /(select|from|where|group by|order by|having|limit|offset|insert into|values|update|set|delete from|create table|left join|right join|inner join|outer join|join|and|or|on)/gi;

export function sqlFormatter(input: string): TransformResult {
  const compact = ensureInput(input).replace(/\s+/g, " ").trim();
  const keywordUpper = compact.replace(sqlKeywordPattern, (match) => match.toUpperCase());
  const withBreaks = keywordUpper
    .replace(/\s+(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|VALUES|SET|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|AND|OR)\b/g, "\n$1")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();

  return toTransformResult(withBreaks, "formatted.sql", "text/sql");
}

export function sqlMinifier(input: string): TransformResult {
  const withoutLineComments = ensureInput(input).replace(/--.*$/gm, "");
  const withoutBlockComments = withoutLineComments.replace(/\/\*[\s\S]*?\*\//g, "");
  const minified = withoutBlockComments
    .replace(/\s+/g, " ")
    .replace(/\s*([(),;=])\s*/g, "$1")
    .trim();

  return toTransformResult(minified, "minified.sql", "text/sql");
}

function parseSqlValues(valuesSql: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let depth = 0;
  let inSingleQuote = false;

  for (let i = 0; i < valuesSql.length; i += 1) {
    const char = valuesSql[i];
    const next = valuesSql[i + 1];

    if (char === "'" && inSingleQuote && next === "'") {
      currentValue += "'";
      i += 1;
      continue;
    }

    if (char === "'") {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (!inSingleQuote && char === "(") {
      depth += 1;
      if (depth === 1) {
        currentRow = [];
        currentValue = "";
        continue;
      }
    }

    if (!inSingleQuote && char === ")") {
      if (depth === 1) {
        currentRow.push(currentValue.trim());
        rows.push(currentRow);
        currentRow = [];
        currentValue = "";
      }
      depth -= 1;
      continue;
    }

    if (!inSingleQuote && depth === 1 && char === ",") {
      currentRow.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    if (depth >= 1) {
      currentValue += char;
    }
  }

  return rows;
}

function normalizeSqlValue(value: string): string {
  if (/^null$/i.test(value)) {
    return "";
  }
  return value;
}

export function sqlToCsv(input: string): TransformResult {
  const source = ensureInput(input);
  const insertMatch = source.match(/insert\s+into\s+[^\s(]+\s*(\(([^)]*)\))?\s*values\s*/i);

  if (!insertMatch || insertMatch.index === undefined) {
    throw new Error("SQL to CSV Converter currently supports INSERT INTO ... VALUES statements.");
  }

  const columnsRaw = insertMatch[2];
  const valuesSection = source.slice(insertMatch.index + insertMatch[0].length).replace(/;\s*$/, "");
  const rows = parseSqlValues(valuesSection).map((row) => row.map((value) => normalizeSqlValue(value)));

  if (rows.length === 0) {
    throw new Error("SQL to CSV Converter could not find VALUES tuples to parse.");
  }

  const headers = columnsRaw
    ? columnsRaw
        .split(",")
        .map((column) => column.trim().replace(/^['"`\[]|['"`\]]$/g, ""))
    : Array.from({ length: rows[0].length }, (_, index) => `column_${index + 1}`);

  return toTransformResult(toCsv([headers, ...rows]), "converted.csv", "text/csv");
}

export function csvMergeTool(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [firstCsv, secondCsv] = normalized.split(/\n\s*\n/, 2);

  if (!firstCsv || !secondCsv) {
    throw new Error("CSV Merge Tool requires two CSV blocks separated by a blank line.");
  }

  const firstRows = parseCsv(firstCsv);
  const secondRows = parseCsv(secondCsv);

  if (firstRows.length === 0 || secondRows.length === 0) {
    throw new Error("CSV Merge Tool requires both CSV blocks to contain a header row.");
  }

  const headers = [...firstRows[0]];
  secondRows[0].forEach((header) => {
    if (!headers.includes(header)) {
      headers.push(header);
    }
  });

  const mapRowToHeaders = (row: string[], sourceHeaders: string[]) =>
    headers.map((header) => {
      const index = sourceHeaders.indexOf(header);
      return index >= 0 ? row[index] ?? "" : "";
    });

  const mergedRows = [
    headers,
    ...firstRows.slice(1).map((row) => mapRowToHeaders(row, firstRows[0])),
    ...secondRows.slice(1).map((row) => mapRowToHeaders(row, secondRows[0])),
  ];

  return toTransformResult(toCsv(mergedRows), "merged.csv", "text/csv");
}

export function csvSplitter(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [sizeRaw, csvRaw] = normalized.split(/\n\s*\n/, 2);

  if (!sizeRaw || !csvRaw) {
    throw new Error("CSV Splitter requires row count on the first section and CSV data in the second section.");
  }

  const chunkSize = Number(sizeRaw.trim());
  if (!Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new Error("CSV Splitter requires a positive whole number of rows per file.");
  }

  const rows = parseCsv(csvRaw);
  if (rows.length < 2) {
    throw new Error("CSV Splitter requires a header row and at least one data row.");
  }

  const header = rows[0];
  const dataRows = rows.slice(1);
  const parts: string[] = [];

  for (let i = 0; i < dataRows.length; i += chunkSize) {
    const chunk = dataRows.slice(i, i + chunkSize);
    const chunkCsv = toCsv([header, ...chunk]);
    parts.push(`--- chunk_${Math.floor(i / chunkSize) + 1}.csv ---\n${chunkCsv}`);
  }

  return toTransformResult(parts.join("\n\n"), "split-preview.txt", "text/plain");
}

export function ndjsonFormatter(input: string): TransformResult {
  const lines = ensureInput(input)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("NDJSON Formatter requires at least one JSON line.");
  }

  const formatted = lines.map((line, index) => {
    try {
      return JSON.stringify(JSON.parse(line), null, 2);
    } catch {
      throw new Error(`NDJSON Formatter found invalid JSON at line ${index + 1}.`);
    }
  });

  return toTransformResult(formatted.join("\n\n"), "formatted.ndjson.txt", "text/plain");
}

export function urlParser(input: string): TransformResult {
  const raw = ensureInput(input).trim();
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(raw);
  } catch {
    throw new Error("URL Parser requires a valid absolute URL including protocol (e.g. https://...).");
  }

  const queryParams: Record<string, string | string[]> = {};
  parsedUrl.searchParams.forEach((value, key) => {
    const existing = queryParams[key];
    if (typeof existing === "undefined") {
      queryParams[key] = value;
      return;
    }

    if (Array.isArray(existing)) {
      existing.push(value);
      return;
    }

    queryParams[key] = [existing, value];
  });

  return toTransformResult(
    JSON.stringify(
      {
        href: parsedUrl.href,
        protocol: parsedUrl.protocol,
        origin: parsedUrl.origin,
        host: parsedUrl.host,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        hash: parsedUrl.hash,
        username: parsedUrl.username,
        password: parsedUrl.password ? "***" : "",
        queryParams,
      },
      null,
      2,
    ),
    "parsed-url.json",
    "application/json",
  );
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function dateFormatConverter(input: string): TransformResult {
  const raw = ensureInput(input).trim();
  let date: Date;
  let milliseconds: number;

  if (/^-?\d+$/.test(raw)) {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) {
      throw new Error("Date Format Converter requires a valid date string or unix timestamp.");
    }

    milliseconds = Math.abs(numeric) < 1e12 ? numeric * 1000 : numeric;
    date = new Date(milliseconds);
  } else {
    date = new Date(raw);
    milliseconds = date.getTime();
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Date Format Converter requires a valid date string or unix timestamp.");
  }

  const yyyy = date.getUTCFullYear();
  const mm = pad(date.getUTCMonth() + 1);
  const dd = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const min = pad(date.getUTCMinutes());
  const sec = pad(date.getUTCSeconds());

  return toTransformResult(
    JSON.stringify(
      {
        input: raw,
        iso8601: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toString(),
        unixSeconds: Math.floor(milliseconds / 1000),
        unixMilliseconds: milliseconds,
        dateOnlyUtc: `${yyyy}-${mm}-${dd}`,
        timeOnlyUtc: `${hh}:${min}:${sec}`,
      },
      null,
      2,
    ),
  );
}
