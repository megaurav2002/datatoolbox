import type { TransformResult } from "@/lib/types";

export function ensureInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Please provide input.");
  }
  return input;
}

export function parseJsonInput(input: string, context: string): unknown {
  try {
    return JSON.parse(ensureInput(input));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`${context}: invalid JSON syntax.`);
    }
    throw error;
  }
}

export function toJsonSyntaxErrorMessage(
  input: string,
  context: string,
  error: SyntaxError,
): string {
  const fallback = `${context}: invalid JSON syntax.`;
  const positionMatch = error.message.match(/position\s+(\d+)/i);
  if (!positionMatch) {
    return fallback;
  }

  const rawPosition = Number(positionMatch[1]);
  if (!Number.isFinite(rawPosition) || rawPosition < 0 || rawPosition > input.length) {
    return fallback;
  }

  const prefix = input.slice(0, rawPosition);
  const line = prefix.split("\n").length;
  const column = rawPosition - prefix.lastIndexOf("\n");
  const sourceLine = input.split("\n")[line - 1] ?? "";
  const caretLine = `${" ".repeat(Math.max(column - 1, 0))}^`;

  return `${context}: invalid JSON syntax at line ${line}, column ${column}.\n${sourceLine}\n${caretLine}`;
}

export function normalizeLines(input: string): string[] {
  return ensureInput(input).replace(/\r\n?/g, "\n").split("\n");
}

export function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function toTransformResult(
  output: string,
  downloadFileName?: string,
  downloadMimeType?: string,
): TransformResult {
  return { output, downloadFileName, downloadMimeType };
}

export function withTransformErrorBoundary(
  handler: (input: string) => TransformResult,
): (input: string) => TransformResult {
  return (input: string) => {
    try {
      return handler(input);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Transformation failed unexpectedly.");
    }
  };
}
