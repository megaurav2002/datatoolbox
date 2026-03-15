import bcrypt from "bcryptjs";
import { sha256 } from "js-sha256";
import type { TransformResult } from "@/lib/types";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { generateMd5Hash } from "@/lib/transformations/hash";
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
import {
  cronExpressionParser,
  csvMergeTool,
  csvSplitter,
  dateFormatConverter,
  jsonPathExtractor,
  ndjsonFormatter,
  sqlFormatter,
  sqlMinifier,
  sqlToCsv,
  urlParser,
} from "@/lib/transformations/additional-tools";

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

function removeExtraSpaces(input: string): TransformResult {
  const normalized = ensureInput(input)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n");
  return toTransformResult(normalized);
}

function removeEmptyLines(input: string): TransformResult {
  const cleaned = normalizeLines(input)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join("\n");
  return toTransformResult(cleaned);
}

function reverseText(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const configMatch = normalized.match(/^([^\n]+)\n\s*\n([\s\S]*)$/);
  const modeLine = configMatch?.[1].trim().toLowerCase() ?? "";
  const hasConfig = modeLine === "characters" || modeLine === "words";
  const mode = hasConfig ? modeLine : "characters";
  const text = hasConfig ? configMatch?.[2] ?? "" : normalized;

  if (!text.trim()) {
    throw new Error("Please provide input.");
  }

  if (mode === "words") {
    return toTransformResult(
      text
        .split(/\s+/)
        .filter(Boolean)
        .reverse()
        .join(" "),
    );
  }

  return toTransformResult(Array.from(text).reverse().join(""));
}

const urlRegex = /\bhttps?:\/\/[^\s<>"'`]+/gi;

function extractUrls(input: string): TransformResult {
  const matches = ensureInput(input).match(urlRegex) ?? [];
  const cleaned = matches.map((url) => url.replace(/[),.;!?]+$/g, ""));
  return toTransformResult(uniqueValues(cleaned).join("\n") || "No URLs found.");
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

function randomInt(maxExclusive: number): number {
  if (
    typeof crypto !== "undefined" &&
    "getRandomValues" in crypto &&
    typeof crypto.getRandomValues === "function"
  ) {
    // Rejection sampling avoids modulo bias for security-sensitive generators.
    const range = 0x100000000;
    const acceptable = range - (range % maxExclusive);
    const bytes = new Uint32Array(1);

    while (true) {
      crypto.getRandomValues(bytes);
      const value = bytes[0];
      if (value < acceptable) {
        return value % maxExclusive;
      }
    }
  }

  return Math.floor(Math.random() * maxExclusive);
}

function buildRandomString(length: number, charset: string): string {
  return Array.from({ length }, () => charset[randomInt(charset.length)]).join("");
}

function shuffleCharacters(value: string): string {
  const chars = Array.from(value);
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function parseLengthInput(
  input: string,
  toolName: string,
  minimum: number,
  maximum: number,
  defaultLength: number,
): number {
  const trimmed = input.trim();
  if (!trimmed) {
    return defaultLength;
  }

  const length = Number(trimmed);
  if (!Number.isInteger(length) || length < minimum || length > maximum) {
    throw new Error(`${toolName} expects a whole number between ${minimum} and ${maximum}.`);
  }

  return length;
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

function parseTwoInputBlocks(input: string, toolName: string): [string, string] {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [leftBlock, rightBlock] = normalized.split(/\n\s*\n/, 2);

  if (!leftBlock || !rightBlock) {
    throw new Error(`${toolName} requires two text blocks separated by a blank line.`);
  }

  return [leftBlock, rightBlock];
}

function lineFrequency(lines: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  lines.forEach((line) => {
    counts.set(line, (counts.get(line) ?? 0) + 1);
  });
  return counts;
}

function textDiffChecker(input: string): TransformResult {
  const [firstBlock, secondBlock] = parseTwoInputBlocks(input, "Text Diff Checker");
  const firstLines = firstBlock.split("\n");
  const secondLines = secondBlock.split("\n");
  const firstCounts = lineFrequency(firstLines);
  const secondCounts = lineFrequency(secondLines);

  const onlyInFirst: string[] = [];
  const onlyInSecond: string[] = [];
  const inBoth: string[] = [];

  const firstSeen = new Set<string>();
  firstLines.forEach((line) => {
    if (firstSeen.has(line)) {
      return;
    }
    firstSeen.add(line);

    const firstCount = firstCounts.get(line) ?? 0;
    const secondCount = secondCounts.get(line) ?? 0;

    if (firstCount > secondCount) {
      onlyInFirst.push(line);
    } else if (secondCount > firstCount) {
      onlyInSecond.push(line);
    } else {
      inBoth.push(line);
    }
  });

  secondLines.forEach((line) => {
    if (firstSeen.has(line)) {
      return;
    }

    const firstCount = firstCounts.get(line) ?? 0;
    const secondCount = secondCounts.get(line) ?? 0;
    if (secondCount > firstCount) {
      onlyInSecond.push(line);
    }
  });

  const serializeSection = (title: string, lines: string[]) =>
    `${title}\n${lines.length > 0 ? lines.map((line) => `- ${line}`).join("\n") : "(none)"}`;

  return toTransformResult(
    [
      `First input lines: ${firstLines.length}`,
      `Second input lines: ${secondLines.length}`,
      serializeSection("Only in first input:", onlyInFirst),
      serializeSection("Only in second input:", onlyInSecond),
      serializeSection("In both inputs:", inBoth),
    ].join("\n\n"),
  );
}

function passwordGenerator(input: string): TransformResult {
  const trimmed = input.trim();

  let length = 16;
  let includeUppercase = true;
  let includeLowercase = true;
  let includeNumbers = true;
  let includeSymbols = true;

  const parseToggle = (value: unknown, key: string): boolean => {
    if (value === undefined) {
      return true;
    }
    if (typeof value !== "boolean") {
      throw new Error(`Password Generator option \`${key}\` must be true or false.`);
    }
    return value;
  };

  if (trimmed) {
    if (trimmed.startsWith("{")) {
      const parsed = parseJsonInput(trimmed, "Password Generator options");
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Password Generator options must be a JSON object.");
      }

      const options = parsed as Record<string, unknown>;
      const rawLength = options.length;
      if (rawLength !== undefined) {
        const parsedLength = Number(rawLength);
        if (!Number.isInteger(parsedLength) || parsedLength < 8 || parsedLength > 128) {
          throw new Error("Password Generator expects a whole number between 8 and 128.");
        }
        length = parsedLength;
      }

      includeUppercase = parseToggle(options.includeUppercase, "includeUppercase");
      includeLowercase = parseToggle(options.includeLowercase, "includeLowercase");
      includeNumbers = parseToggle(options.includeNumbers, "includeNumbers");
      includeSymbols = parseToggle(options.includeSymbols, "includeSymbols");
    } else {
      length = parseLengthInput(input, "Password Generator", 8, 128, 16);
    }
  }

  const uppercaseCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseCharset = "abcdefghijklmnopqrstuvwxyz";
  const numbersCharset = "0123456789";
  const symbolsCharset = "!@#$%^&*()-_=+[]{};:,.?/|";

  const selectedCharsets: string[] = [];
  if (includeUppercase) {
    selectedCharsets.push(uppercaseCharset);
  }
  if (includeLowercase) {
    selectedCharsets.push(lowercaseCharset);
  }
  if (includeNumbers) {
    selectedCharsets.push(numbersCharset);
  }
  if (includeSymbols) {
    selectedCharsets.push(symbolsCharset);
  }

  if (selectedCharsets.length === 0) {
    throw new Error("Password Generator requires at least one character set.");
  }

  if (length < selectedCharsets.length) {
    throw new Error("Password length must be at least the number of selected character sets.");
  }

  const requiredCharacters = selectedCharsets.map((charset) => buildRandomString(1, charset));
  const combinedCharset = selectedCharsets.join("");
  const remainingCharacters = buildRandomString(length - requiredCharacters.length, combinedCharset);
  const output = shuffleCharacters(`${requiredCharacters.join("")}${remainingCharacters}`);

  return toTransformResult(output, "password.txt", "text/plain");
}

function yamlValidator(input: string): TransformResult {
  const source = ensureInput(input);
  try {
    parseYaml(source);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`YAML Validator: ${error.message}`);
    }
    throw new Error("YAML Validator: invalid YAML input.");
  }

  return toTransformResult("Valid YAML.");
}

function encodeBase64UrlUtf8(value: string): string {
  const base64 = encodeBase64Utf8(value);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function jwtEncoder(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [headerBlock, payloadBlock] = normalized.split(/\n\s*\n/, 2);

  let header: unknown = { alg: "none", typ: "JWT" };
  let payload: unknown;

  if (payloadBlock) {
    header = parseJsonInput(headerBlock, "JWT Encoder header");
    payload = parseJsonInput(payloadBlock, "JWT Encoder payload");
  } else {
    payload = parseJsonInput(normalized, "JWT Encoder payload");
  }

  if (typeof header !== "object" || header === null || Array.isArray(header)) {
    throw new Error("JWT Encoder header must be a JSON object.");
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new Error("JWT Encoder payload must be a JSON object.");
  }

  const encodedHeader = encodeBase64UrlUtf8(JSON.stringify(header));
  const encodedPayload = encodeBase64UrlUtf8(JSON.stringify(payload));
  const token = `${encodedHeader}.${encodedPayload}.`;

  return toTransformResult(token, "encoded-jwt.txt", "text/plain");
}

function characterCounter(input: string): TransformResult {
  const source = ensureInput(input);
  const normalized = source.replace(/\r\n?/g, "\n");
  const trimmed = normalized.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const lines = normalized.split("\n").length;
  const characters = normalized.length;
  const charactersExcludingSpaces = normalized.replace(/\s/g, "").length;

  return toTransformResult(
    JSON.stringify(
      { characters, charactersExcludingSpaces, words, lines },
      null,
      2,
    ),
    "character-count.json",
    "application/json",
  );
}

function slugGenerator(input: string): TransformResult {
  const normalized = ensureInput(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  if (!normalized) {
    throw new Error("Slug Generator could not build a slug from the provided input.");
  }

  return toTransformResult(normalized);
}

function randomStringGenerator(input: string): TransformResult {
  const length = parseLengthInput(input, "Random String Generator", 1, 512, 16);
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return toTransformResult(buildRandomString(length, charset));
}

function wordCounter(input: string): TransformResult {
  const source = ensureInput(input);
  const normalized = source.replace(/\r\n?/g, "\n");
  const trimmed = normalized.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const lines = normalized.split("\n").length;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
  const characters = normalized.length;
  const charactersExcludingSpaces = normalized.replace(/\s/g, "").length;

  return toTransformResult(
    JSON.stringify(
      { words, characters, charactersExcludingSpaces, lines, paragraphs },
      null,
      2,
    ),
    "word-count.json",
    "application/json",
  );
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function toSentenceCase(value: string): string {
  const lowered = value.toLowerCase();
  return lowered.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (segment) => segment.toUpperCase());
}

function splitWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function toKebabCase(value: string): string {
  return splitWords(value).map((part) => part.toLowerCase()).join("-");
}

function toSnakeCase(value: string): string {
  return splitWords(value).map((part) => part.toLowerCase()).join("_");
}

function toCamelCase(value: string): string {
  const parts = splitWords(value).map((part) => part.toLowerCase());
  if (parts.length === 0) {
    return "";
  }
  return parts[0] + parts.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
}

function caseConverter(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [modeLine, textBlock] = normalized.split(/\n\s*\n/, 2);

  if (!textBlock) {
    throw new Error("Case Converter requires mode on first line, blank line, then text input.");
  }

  const mode = modeLine.trim().toLowerCase();
  const value = textBlock;

  const transformed = (() => {
    switch (mode) {
      case "uppercase":
      case "upper":
        return value.toUpperCase();
      case "lowercase":
      case "lower":
        return value.toLowerCase();
      case "title":
      case "title-case":
        return toTitleCase(value);
      case "sentence":
      case "sentence-case":
        return toSentenceCase(value);
      case "kebab":
      case "kebab-case":
        return toKebabCase(value);
      case "snake":
      case "snake-case":
        return toSnakeCase(value);
      case "camel":
      case "camel-case":
        return toCamelCase(value);
      default:
        throw new Error(
          "Case Converter mode must be one of: uppercase, lowercase, title, sentence, kebab, snake, camel.",
        );
    }
  })();

  return toTransformResult(transformed);
}

function removeLineBreaks(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const configMatch = normalized.match(/^([^\n]+)\n\s*\n([\s\S]*)$/);
  const explicitModeToken = configMatch?.[1].trim().toLowerCase();
  const validModes = new Set(["single-line", "normalize"]);
  const hasModeBlock = Boolean(explicitModeToken && validModes.has(explicitModeToken));
  const hasModePrefix = Boolean(explicitModeToken?.startsWith("mode="));
  const mode = hasModeBlock ? explicitModeToken! : "single-line";
  const text = hasModeBlock ? configMatch?.[2] ?? "" : normalized;

  if (!text.trim()) {
    throw new Error("Please provide input.");
  }

  if (hasModePrefix && !hasModeBlock) {
    throw new Error("Remove Line Breaks mode must be `single-line` or `normalize`.");
  }

  if (mode === "normalize") {
    return toTransformResult(text.replace(/\n{3,}/g, "\n\n"));
  }

  return toTransformResult(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" "),
  );
}

function csvViewer(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const configMatch = normalized.match(/^([^\n]+)\n\s*\n([\s\S]*)$/);
  const delimiterLine = configMatch?.[1].trim().toLowerCase() ?? "";
  const hasConfig = delimiterLine.startsWith("delimiter=");
  const csvSource = hasConfig ? configMatch?.[2] ?? "" : normalized;
  const delimiterConfig = hasConfig ? delimiterLine : "delimiter=comma";
  const delimiter = (() => {
    const value = delimiterConfig.split("=")[1];
    switch (value) {
      case "comma":
        return ",";
      case "semicolon":
        return ";";
      case "tab":
        return "\t";
      case "pipe":
        return "|";
      default:
        throw new Error("CSV Viewer delimiter must be comma, semicolon, tab, or pipe.");
    }
  })();

  const rows = parseCsv(csvSource, delimiter);
  if (rows.length === 0) {
    throw new Error("CSV Viewer requires at least one row.");
  }

  const header = rows[0];
  const body = rows.slice(1, 51);
  const toRow = (cells: string[]) => `| ${cells.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`;
  const separator = `| ${header.map(() => "---").join(" | ")} |`;
  const markdownTable = [toRow(header), separator, ...body.map((row) => toRow(row))].join("\n");

  return toTransformResult(markdownTable);
}

function htmlEncoder(input: string): TransformResult {
  const encoded = ensureInput(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  return toTransformResult(encoded);
}

function htmlDecoder(input: string): TransformResult {
  const decoded = ensureInput(input)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
  return toTransformResult(decoded);
}

function yamlToJsonConverter(input: string): TransformResult {
  const parsed = parseYaml(ensureInput(input));
  return toTransformResult(JSON.stringify(parsed, null, 2), "converted.json", "application/json");
}

function yamlFormatter(input: string): TransformResult {
  const parsed = parseYaml(ensureInput(input));
  const formatted = stringifyYaml(parsed).trimEnd();
  return toTransformResult(formatted, "formatted.yaml", "application/x-yaml");
}

function jsonToYamlConverter(input: string): TransformResult {
  const parsed = parseJsonInput(input, "JSON to YAML Converter");
  const yaml = stringifyYaml(parsed).trimEnd();
  return toTransformResult(yaml, "converted.yaml", "application/x-yaml");
}

function cronExpressionBuilder(input: string): TransformResult {
  const parsed = parseJsonInput(input, "Cron Expression Builder");
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Cron Expression Builder requires a JSON object input.");
  }

  const config = parsed as Record<string, unknown>;
  const minute = String(config.minute ?? "0").trim();
  const hour = String(config.hour ?? "*").trim();
  const dayOfMonth = String(config.dayOfMonth ?? "*").trim();
  const month = String(config.month ?? "*").trim();
  const dayOfWeek = String(config.dayOfWeek ?? "*").trim();
  const cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  // Reuse parser validation so builder output is always a valid 5-field cron expression.
  cronExpressionParser(cron);
  return toTransformResult(cron, "cron-expression.txt", "text/plain");
}

function loremWord(): string {
  const words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua",
  ];
  return words[randomInt(words.length)];
}

function loremIpsumGenerator(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [modeLine, countLine] = normalized.split(/\n/, 2);
  const mode = modeLine.trim().toLowerCase();
  const count = parseLengthInput(countLine ?? "", "Lorem Ipsum Generator", 1, 500, 3);

  if (!["words", "sentences", "paragraphs"].includes(mode)) {
    throw new Error("Lorem Ipsum Generator mode must be `words`, `sentences`, or `paragraphs`.");
  }

  if (mode === "words") {
    return toTransformResult(Array.from({ length: count }, () => loremWord()).join(" "));
  }

  const makeSentence = () => {
    const length = 8 + randomInt(10);
    const words = Array.from({ length }, () => loremWord());
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    return `${words.join(" ")}.`;
  };

  if (mode === "sentences") {
    return toTransformResult(Array.from({ length: count }, () => makeSentence()).join(" "));
  }

  const makeParagraph = () => Array.from({ length: 3 + randomInt(4) }, () => makeSentence()).join(" ");
  return toTransformResult(Array.from({ length: count }, () => makeParagraph()).join("\n\n"));
}

function splitShellArgs(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (const char of input) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\" && !inSingle) {
      escaped = true;
      continue;
    }

    if (char === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }

    if (char === "\"" && !inSingle) {
      inDouble = !inDouble;
      continue;
    }

    if (!inSingle && !inDouble && /\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

function toJsStringLiteral(value: string): string {
  return JSON.stringify(value);
}

function curlToFetch(input: string): TransformResult {
  const raw = ensureInput(input).trim();
  if (!raw.toLowerCase().startsWith("curl ")) {
    throw new Error("Curl to Fetch Converter requires input starting with `curl`.");
  }

  const tokens = splitShellArgs(raw);
  if (tokens.length < 2) {
    throw new Error("Curl to Fetch Converter could not parse the command.");
  }

  let method = "GET";
  const headers: Record<string, string> = {};
  let body = "";
  let url = "";
  let fallbackTarget = "";

  for (let i = 1; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (token === "-X" || token === "--request") {
      method = (tokens[i + 1] ?? "").toUpperCase() || method;
      i += 1;
      continue;
    }

    if (token === "--url") {
      url = tokens[i + 1] ?? url;
      i += 1;
      continue;
    }

    if (token === "-H" || token === "--header") {
      const headerValue = tokens[i + 1] ?? "";
      const separatorIndex = headerValue.indexOf(":");
      if (separatorIndex > 0) {
        const key = headerValue.slice(0, separatorIndex).trim();
        const value = headerValue.slice(separatorIndex + 1).trim();
        if (key) {
          headers[key] = value;
        }
      }
      i += 1;
      continue;
    }

    if (
      token === "-d" ||
      token === "--data" ||
      token === "--data-raw" ||
      token === "--data-binary" ||
      token === "--data-urlencode"
    ) {
      body = tokens[i + 1] ?? "";
      if (method === "GET") {
        method = "POST";
      }
      i += 1;
      continue;
    }

    if (token === "-o" || token === "--output" || token === "-u" || token === "--user") {
      i += 1;
      continue;
    }

    if (!token.startsWith("-")) {
      if (!url && /^https?:\/\//i.test(token)) {
        url = token;
        continue;
      }
      if (!fallbackTarget) {
        fallbackTarget = token;
      }
    }
  }

  if (!url && /^https?:\/\//i.test(fallbackTarget)) {
    url = fallbackTarget;
  }

  if (!url) {
    throw new Error("Curl to Fetch Converter requires a URL in the curl command.");
  }

  const options: string[] = [];
  if (method !== "GET") {
    options.push(`method: ${toJsStringLiteral(method)}`);
  }
  if (Object.keys(headers).length > 0) {
    const headerLines = Object.entries(headers).map(
      ([key, value]) => `    ${toJsStringLiteral(key)}: ${toJsStringLiteral(value)}`,
    );
    options.push(`headers: {\n${headerLines.join(",\n")}\n  }`);
  }
  if (body) {
    options.push(`body: ${toJsStringLiteral(body)}`);
  }

  if (options.length === 0) {
    return toTransformResult(`fetch(${toJsStringLiteral(url)});`);
  }

  return toTransformResult(
    `fetch(${toJsStringLiteral(url)}, {\n  ${options.join(",\n  ")}\n});`,
  );
}

function markdownInlineToHtml(line: string): string {
  return line
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(input: string): TransformResult {
  const lines = ensureInput(input).replace(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];
  let inList = false;

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }
      const level = headingMatch[1].length;
      output.push(`<h${level}>${markdownInlineToHtml(headingMatch[2])}</h${level}>`);
      return;
    }

    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        output.push("<ul>");
        inList = true;
      }
      output.push(`<li>${markdownInlineToHtml(listMatch[1])}</li>`);
      return;
    }

    if (inList) {
      output.push("</ul>");
      inList = false;
    }

    output.push(`<p>${markdownInlineToHtml(line)}</p>`);
  });

  if (inList) {
    output.push("</ul>");
  }

  return toTransformResult(output.join("\n"), "converted.html", "text/html");
}

function htmlToMarkdown(input: string): TransformResult {
  const source = ensureInput(input);
  const markdown = source
    .replace(/\r\n?/g, "\n")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n\n")
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "##### $1\n\n")
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "###### $1\n\n")
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<\/?(ul|ol)[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return toTransformResult(markdown || "(no markdown output)");
}

function parseXmlDocument(source: string, context: string): Document {
  if (typeof DOMParser === "undefined") {
    throw new Error(`${context}: XML parser is unavailable in this environment.`);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(source, "application/xml");
  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) {
    throw new Error(`${context}: invalid XML input.`);
  }
  return doc;
}

function xmlNodeToJson(node: Element): unknown {
  const attributes = Array.from(node.attributes);
  const children = Array.from(node.children);
  const text = node.textContent?.trim() ?? "";

  if (attributes.length === 0 && children.length === 0) {
    return text;
  }

  const result: Record<string, unknown> = {};
  if (attributes.length > 0) {
    result["@attributes"] = Object.fromEntries(attributes.map((attr) => [attr.name, attr.value]));
  }

  children.forEach((child) => {
    const value = xmlNodeToJson(child);
    if (child.tagName in result) {
      const existing = result[child.tagName];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        result[child.tagName] = [existing, value];
      }
    } else {
      result[child.tagName] = value;
    }
  });

  if (text && children.length === 0) {
    result["#text"] = text;
  }

  return result;
}

function xmlValidator(input: string): TransformResult {
  parseXmlDocument(ensureInput(input), "XML Validator");
  return toTransformResult("Valid XML.");
}

function xmlToJson(input: string): TransformResult {
  const doc = parseXmlDocument(ensureInput(input), "XML to JSON");
  const root = doc.documentElement;
  const json = { [root.tagName]: xmlNodeToJson(root) };
  return toTransformResult(JSON.stringify(json, null, 2), "converted.json", "application/json");
}

function escapeXmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function jsonValueToXml(tag: string, value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => jsonValueToXml(tag, item)).join("");
  }

  if (value === null || value === undefined) {
    return `<${tag}></${tag}>`;
  }

  if (typeof value !== "object") {
    return `<${tag}>${escapeXmlText(String(value))}</${tag}>`;
  }

  const objectValue = value as Record<string, unknown>;
  const attributes = typeof objectValue["@attributes"] === "object" && objectValue["@attributes"] !== null
    ? Object.entries(objectValue["@attributes"] as Record<string, unknown>)
        .map(([name, attrValue]) => ` ${name}="${escapeXmlText(String(attrValue))}"`)
        .join("")
    : "";

  const childEntries = Object.entries(objectValue).filter(([key]) => key !== "@attributes" && key !== "#text");
  const textValue = objectValue["#text"] !== undefined ? escapeXmlText(String(objectValue["#text"])) : "";
  const children = childEntries.map(([key, child]) => jsonValueToXml(key, child)).join("");
  return `<${tag}${attributes}>${textValue}${children}</${tag}>`;
}

function jsonToXml(input: string): TransformResult {
  const parsed = parseJsonInput(input, "JSON to XML");
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("JSON to XML requires a JSON object input.");
  }

  const rootEntries = Object.entries(parsed as Record<string, unknown>);
  if (rootEntries.length === 1) {
    const [rootTag, rootValue] = rootEntries[0];
    return toTransformResult(jsonValueToXml(rootTag, rootValue), "converted.xml", "application/xml");
  }

  const wrapped = jsonValueToXml("root", parsed);
  return toTransformResult(wrapped, "converted.xml", "application/xml");
}

function jsonDiffChecker(input: string): TransformResult {
  const [leftBlock, rightBlock] = parseTwoInputBlocks(input, "JSON Diff Checker");
  const left = parseJsonInput(leftBlock, "JSON Diff Checker (left)");
  const right = parseJsonInput(rightBlock, "JSON Diff Checker (right)");

  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];

  function compare(path: string, before: unknown, after: unknown) {
    if (before === after) {
      return;
    }

    if (before === undefined) {
      added.push(path);
      return;
    }

    if (after === undefined) {
      removed.push(path);
      return;
    }

    if (
      typeof before !== "object" ||
      before === null ||
      typeof after !== "object" ||
      after === null
    ) {
      changed.push(path);
      return;
    }

    const beforeIsArray = Array.isArray(before);
    const afterIsArray = Array.isArray(after);
    if (beforeIsArray !== afterIsArray) {
      changed.push(path);
      return;
    }

    if (beforeIsArray && afterIsArray) {
      const max = Math.max((before as unknown[]).length, (after as unknown[]).length);
      for (let i = 0; i < max; i += 1) {
        compare(`${path}[${i}]`, (before as unknown[])[i], (after as unknown[])[i]);
      }
      return;
    }

    const keys = new Set([
      ...Object.keys(before as Record<string, unknown>),
      ...Object.keys(after as Record<string, unknown>),
    ]);
    keys.forEach((key) => {
      const nextPath = path ? `${path}.${key}` : key;
      compare(nextPath, (before as Record<string, unknown>)[key], (after as Record<string, unknown>)[key]);
    });
  }

  compare("", left, right);
  const serialize = (title: string, items: string[]) =>
    `${title}\n${items.length > 0 ? items.map((item) => `- ${item || "(root)"}`).join("\n") : "(none)"}`;

  return toTransformResult(
    [
      serialize("Added paths:", added),
      serialize("Removed paths:", removed),
      serialize("Changed paths:", changed),
    ].join("\n\n"),
  );
}

function queryStringBuilder(input: string): TransformResult {
  const parsed = parseJsonInput(input, "Query String Builder");
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Query String Builder requires a JSON object input.");
  }

  const params = new URLSearchParams();
  Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
      return;
    }
    if (typeof value === "object") {
      throw new Error("Query String Builder does not support nested objects. Flatten values first.");
    }
    params.append(key, String(value));
  });

  return toTransformResult(params.toString());
}

function queryStringParser(input: string): TransformResult {
  const raw = ensureInput(input).trim();
  const query = (() => {
    if (raw.includes("?")) {
      return raw.split("?")[1].split("#")[0];
    }

    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) {
      try {
        const url = new URL(raw);
        return url.search.replace(/^\?/, "");
      } catch {
        return raw.replace(/^\?/, "");
      }
    }

    return raw.replace(/^\?/, "");
  })();
  const params = new URLSearchParams(query);
  const result: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    if (key in result) {
      const existing = result[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        result[key] = [existing, value];
      }
      return;
    }
    result[key] = value;
  });

  return toTransformResult(JSON.stringify(result, null, 2), "parsed-query.json", "application/json");
}

function hmacGenerator(input: string): TransformResult {
  const [secret, message] = parseTwoInputBlocks(input, "HMAC Generator");
  const digest = sha256.hmac(secret, message);
  return toTransformResult(digest, "hmac.txt", "text/plain");
}

function bcryptHashGenerator(input: string): TransformResult {
  const normalized = ensureInput(input).replace(/\r\n?/g, "\n");
  const [passwordBlock, roundsBlock] = normalized.split(/\n\s*\n/, 2);
  const password = passwordBlock.trim();
  if (!password) {
    throw new Error("Please provide input.");
  }

  const rounds = roundsBlock
    ? parseLengthInput(roundsBlock, "Bcrypt Hash Generator", 4, 15, 10)
    : 10;
  const hash = bcrypt.hashSync(password, rounds);
  return toTransformResult(hash, "bcrypt-hash.txt", "text/plain");
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

function decodeBase64UrlSegment(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const base64 = normalized + padding;

  if (typeof atob === "function" && typeof TextDecoder !== "undefined") {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  return Buffer.from(base64, "base64").toString("utf8");
}

function jwtDecoder(input: string): TransformResult {
  const raw = ensureInput(input).trim().replace(/^Bearer\s+/i, "");
  const parts = raw.split(".");

  if (parts.length !== 3) {
    throw new Error("JWT Decoder requires a token with header.payload.signature format.");
  }

  try {
    const header = JSON.parse(decodeBase64UrlSegment(parts[0]));
    const payload = JSON.parse(decodeBase64UrlSegment(parts[1]));
    const result = {
      header,
      payload,
      signature: parts[2],
      signaturePresent: parts[2].length > 0,
    };
    return toTransformResult(JSON.stringify(result, null, 2), "decoded-jwt.json", "application/json");
  } catch {
    throw new Error("JWT Decoder could not decode token. Ensure it is a valid JWT.");
  }
}

function hashGenerator(input: string): TransformResult {
  return toTransformResult(generateMd5Hash(ensureInput(input)), "hash.txt", "text/plain");
}

function mermaidEditor(input: string): TransformResult {
  return toTransformResult(ensureInput(input), "diagram.mmd", "text/plain");
}

function jsonFlattenToCsv(input: string): TransformResult {
  const result = flattenJson(input);
  return toTransformResult(result.csv, "flattened.csv", "text/csv");
}

export const transformations: Record<string, (input: string) => TransformResult> = {
  "remove-extra-spaces": withTransformErrorBoundary(removeExtraSpaces),
  "remove-empty-lines": withTransformErrorBoundary(removeEmptyLines),
  "reverse-text": withTransformErrorBoundary(reverseText),
  "extract-urls": withTransformErrorBoundary(extractUrls),
  "word-counter": withTransformErrorBoundary(wordCounter),
  "case-converter": withTransformErrorBoundary(caseConverter),
  "remove-line-breaks": withTransformErrorBoundary(removeLineBreaks),
  "csv-viewer": withTransformErrorBoundary(csvViewer),
  "html-encoder": withTransformErrorBoundary(htmlEncoder),
  "html-decoder": withTransformErrorBoundary(htmlDecoder),
  "yaml-to-json": withTransformErrorBoundary(yamlToJsonConverter),
  "yaml-formatter": withTransformErrorBoundary(yamlFormatter),
  "json-to-yaml": withTransformErrorBoundary(jsonToYamlConverter),
  "curl-to-fetch": withTransformErrorBoundary(curlToFetch),
  "cron-expression-builder": withTransformErrorBoundary(cronExpressionBuilder),
  "lorem-ipsum-generator": withTransformErrorBoundary(loremIpsumGenerator),
  "character-counter": withTransformErrorBoundary(characterCounter),
  "csv-column-mapper": withTransformErrorBoundary(csvColumnMapper),
  "csv-merge-tool": withTransformErrorBoundary(csvMergeTool),
  "csv-splitter": withTransformErrorBoundary(csvSplitter),
  "csv-to-json": withTransformErrorBoundary(csvToJson),
  "csv-to-sql": withTransformErrorBoundary(csvToSql),
  "cron-expression-parser": withTransformErrorBoundary(cronExpressionParser),
  "date-format-converter": withTransformErrorBoundary(dateFormatConverter),
  "json-path-extractor": withTransformErrorBoundary(jsonPathExtractor),
  "json-diff-checker": withTransformErrorBoundary(jsonDiffChecker),
  "json-schema-generator": withTransformErrorBoundary(jsonSchemaGenerator),
  "json-to-csv": withTransformErrorBoundary(jsonToCsv),
  "json-to-xml": withTransformErrorBoundary(jsonToXml),
  "jwt-encoder": withTransformErrorBoundary(jwtEncoder),
  "jwt-decoder": withTransformErrorBoundary(jwtDecoder),
  "hash-generator": withTransformErrorBoundary(hashGenerator),
  "mermaid-editor": withTransformErrorBoundary(mermaidEditor),
  "ndjson-formatter": withTransformErrorBoundary(ndjsonFormatter),
  "ndjson-to-csv": withTransformErrorBoundary(ndjsonToCsv),
  "json-flatten-to-csv": withTransformErrorBoundary(jsonFlattenToCsv),
  "sql-formatter": withTransformErrorBoundary(sqlFormatter),
  "sql-minifier": withTransformErrorBoundary(sqlMinifier),
  "sql-to-csv": withTransformErrorBoundary(sqlToCsv),
  "csv-cleaner": withTransformErrorBoundary(csvCleaner),
  "csv-validator": withTransformErrorBoundary(csvValidator),
  "csv-to-excel": withTransformErrorBoundary(csvToExcel),
  "excel-to-csv": withTransformErrorBoundary(excelToCsv),
  "json-formatter": withTransformErrorBoundary(jsonFormatter),
  "json-validator": withTransformErrorBoundary(jsonValidator),
  "json-minifier": withTransformErrorBoundary(jsonMinifier),
  "remove-duplicate-lines": withTransformErrorBoundary(removeDuplicateLines),
  "sort-lines-alphabetically": withTransformErrorBoundary(sortLinesAlphabetically),
  "markdown-to-html": withTransformErrorBoundary(markdownToHtml),
  "html-to-markdown": withTransformErrorBoundary(htmlToMarkdown),
  "password-generator": withTransformErrorBoundary(passwordGenerator),
  "random-string-generator": withTransformErrorBoundary(randomStringGenerator),
  "extract-emails": withTransformErrorBoundary(extractEmails),
  "extract-numbers": withTransformErrorBoundary(extractNumbers),
  "base64-encoder": withTransformErrorBoundary(base64Encoder),
  "base64-decoder": withTransformErrorBoundary(base64Decoder),
  "slug-generator": withTransformErrorBoundary(slugGenerator),
  "text-diff-checker": withTransformErrorBoundary(textDiffChecker),
  "uuid-generator": withTransformErrorBoundary(uuidGenerator),
  "url-encoder": withTransformErrorBoundary(urlEncoder),
  "url-decoder": withTransformErrorBoundary(urlDecoder),
  "url-parser": withTransformErrorBoundary(urlParser),
  "query-string-builder": withTransformErrorBoundary(queryStringBuilder),
  "query-string-parser": withTransformErrorBoundary(queryStringParser),
  "hmac-generator": withTransformErrorBoundary(hmacGenerator),
  "bcrypt-hash-generator": withTransformErrorBoundary(bcryptHashGenerator),
  "xml-validator": withTransformErrorBoundary(xmlValidator),
  "xml-to-json": withTransformErrorBoundary(xmlToJson),
  "yaml-validator": withTransformErrorBoundary(yamlValidator),
  "regex-tester": withTransformErrorBoundary(regexTester),
  "timestamp-converter": withTransformErrorBoundary(timestampConverter),
};
