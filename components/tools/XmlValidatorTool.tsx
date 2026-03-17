"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { ToolDefinition } from "@/lib/types";

type XmlValidatorToolProps = {
  tool: ToolDefinition;
};

type XmlValidationError = {
  message: string;
  line?: number;
  column?: number;
};

function parseLineColumn(message: string): { line?: number; column?: number } {
  const patterns = [
    /line\s+(\d+)\s*,\s*column\s+(\d+)/i,
    /line\s+(\d+)\s*at\s*column\s+(\d+)/i,
    /line\s*number\s*(\d+)\s*,\s*column\s*(\d+)/i,
    /:(\d+):(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return {
        line: Number(match[1]),
        column: Number(match[2]),
      };
    }
  }

  return {};
}

function readParserError(doc: Document): XmlValidationError | null {
  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (!parserError) {
    return null;
  }

  const message = parserError.textContent?.replace(/\s+/g, " ").trim() ?? "Invalid XML input.";
  const lineColumn = parseLineColumn(message);
  return {
    message,
    line: lineColumn.line,
    column: lineColumn.column,
  };
}

function formatXml(source: string): string {
  const normalized = source.replace(/>\s*</g, "><");
  const withBreaks = normalized.replace(/(>)(<)(\/*)/g, "$1\n$2$3");
  const lines = withBreaks.split("\n");
  const indentUnit = "  ";
  let depth = 0;

  return lines
    .map((rawLine) => rawLine.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      if (/^<\//.test(line)) {
        depth = Math.max(depth - 1, 0);
      }

      const formattedLine = `${indentUnit.repeat(depth)}${line}`;

      if (/^<[^!?/][^>]*[^/]?>$/.test(line)) {
        depth += 1;
      }

      return formattedLine;
    })
    .join("\n");
}

function validateXmlInput(source: string): { error: XmlValidationError | null; formatted: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(source, "application/xml");
  const error = readParserError(doc);

  if (error) {
    return { error, formatted: "" };
  }

  return { error: null, formatted: formatXml(source) };
}

export default function XmlValidatorTool({ tool }: XmlValidatorToolProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState(() => {
    const validExampleMatch = tool.exampleInput.match(
      /Valid XML example:\n([\s\S]*?)\n\nInvalid XML example:/,
    );

    return validExampleMatch?.[1] ?? tool.exampleInput;
  });
  const [formatBeforeValidate, setFormatBeforeValidate] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<XmlValidationError | null>(null);

  const onValidate = () => {
    setError(null);
    setResult("");

    const source = input.trim();
    if (!source) {
      setError({ message: "Please provide XML input to validate." });
      return;
    }

    const validation = validateXmlInput(source);
    if (validation.error) {
      setError(validation.error);
      return;
    }

    if (formatBeforeValidate) {
      setInput(validation.formatted);
    }

    setResult("Valid XML. No syntax errors found.");
  };

  return (
    <section className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Validate XML input</h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Upload .xml file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml,text/xml,application/xml"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              const text = await file.text();
              setInput(text);
              event.currentTarget.value = "";
            }}
            className="hidden"
          />
        </div>
        <p className="mt-2 text-sm text-slate-700">
          Check XML syntax, identify parse errors quickly, and optionally format valid XML before downstream use.
        </p>
        <p className="mt-2 text-sm text-slate-700">
          If your XML is valid, continue with the{" "}
          <Link href="/tools/xml-to-json" className="underline">
            XML to JSON Converter
          </Link>{" "}
          for downstream mapping or exports.
        </p>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={14}
          className="mt-4 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
          placeholder="Paste XML..."
        />

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={formatBeforeValidate}
              onChange={(event) => setFormatBeforeValidate(event.target.checked)}
            />
            Format before validate
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onValidate}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Validate XML
          </button>
          <Link
            href="/tools/xml-to-json"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Open XML to JSON Converter
          </Link>
        </div>

        {result ? (
          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {result}
          </p>
        ) : null}

        {error ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <p className="font-medium">XML validation failed</p>
            <p className="mt-1">{error.message}</p>
            {error.line ? (
              <p className="mt-2 text-xs text-red-800">
                Error line: {error.line}
                {error.column ? `, column: ${error.column}` : ""}
              </p>
            ) : (
              <p className="mt-2 text-xs text-red-800">
                Line details are not available for this parser error. Check recent tag and attribute edits.
              </p>
            )}
          </div>
        ) : null}
      </section>

    </section>
  );
}
