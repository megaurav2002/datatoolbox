"use client";

import Link from "next/link";
import { useState } from "react";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import type { ToolDefinition } from "@/lib/types";

type YamlValidatorToolProps = {
  tool: ToolDefinition;
};

function parseLineColumn(message: string): { line?: number; column?: number } {
  const lineCol = message.match(/line\s+(\d+),\s*column\s+(\d+)/i);
  if (!lineCol) {
    return {};
  }
  return {
    line: Number(lineCol[1]),
    column: Number(lineCol[2]),
  };
}

export default function YamlValidatorTool({ tool }: YamlValidatorToolProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [formatBeforeValidate, setFormatBeforeValidate] = useState(false);
  const [error, setError] = useState("");
  const [lineColumnHint, setLineColumnHint] = useState("");
  const [result, setResult] = useState("");

  const validateYaml = () => {
    setError("");
    setResult("");
    setLineColumnHint("");

    const source = input.trim();
    if (!source) {
      setError("Please provide YAML input.");
      return;
    }

    try {
      const parsed = parseYaml(source);
      if (formatBeforeValidate) {
        setInput(stringifyYaml(parsed).trimEnd());
      }
      setResult("Valid YAML. No syntax or indentation issues found.");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Invalid YAML input.";
      setError(`YAML validation failed: ${message}`);
      const lineColumn = parseLineColumn(message);
      if (lineColumn.line && lineColumn.column) {
        setLineColumnHint(`Check line ${lineColumn.line}, column ${lineColumn.column}.`);
      }
    }
  };

  return (
    <section className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Validate YAML Input</h2>
        <p className="mt-2 text-sm text-slate-700">
          Validate YAML syntax, catch indentation issues early, and optionally format valid YAML before final checks.
        </p>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={14}
          className="mt-4 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
          placeholder="Paste YAML..."
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
          <label className="inline-flex items-center gap-2">
            <span>Upload .yaml/.yml file:</span>
            <input
              type="file"
              accept=".yaml,.yml,text/yaml,text/x-yaml"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                const text = await file.text();
                setInput(text);
              }}
              className="text-xs"
            />
          </label>
        </div>

        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          YAML is indentation-sensitive. Use spaces consistently and avoid tabs in nested blocks.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={validateYaml}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Validate YAML
          </button>
          <Link
            href="/tools/yaml-formatter"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Open YAML Formatter
          </Link>
        </div>

        {result ? <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{result}</p> : null}
        {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {lineColumnHint ? <p className="mt-2 text-xs text-slate-600">{lineColumnHint}</p> : null}
      </section>
    </section>
  );
}

