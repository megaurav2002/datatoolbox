"use client";

import { useMemo, useRef, useState } from "react";
import ToolOutput from "@/components/ToolOutput";
import { flattenJson } from "@/lib/transformations/json-flatten";
import type { ToolDefinition } from "@/lib/types";

type JsonFlattenToCsvToolProps = {
  tool: ToolDefinition;
};

type OutputMode = "flattened-json" | "csv";

function toPreviewCell(value: unknown): string {
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

export default function JsonFlattenToCsvTool({ tool }: JsonFlattenToCsvToolProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [mode, setMode] = useState<OutputMode>("csv");
  const [flattenedJson, setFlattenedJson] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const output = mode === "flattened-json" ? flattenedJson : csvOutput;

  const previewRows = useMemo(() => rows.slice(0, 6), [rows]);

  const copyText = async (value: string) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // No-op: ToolOutput still provides explicit copy feedback for current mode.
    }
  };

  const downloadText = (value: string, fileName: string, mimeType: string) => {
    if (!value) {
      return;
    }

    const blob = new Blob([value], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      setInput(text);
      setUploadError("");
    } catch {
      setUploadError("Could not read this JSON file.");
    }
  };

  const transform = () => {
    setError("");

    try {
      const result = flattenJson(input);
      setHeaders(result.headers);
      setRows(result.rows);
      setCsvOutput(result.csv);
      setFlattenedJson(JSON.stringify(result.rows, null, 2));
    } catch (caughtError) {
      setHeaders([]);
      setRows([]);
      setCsvOutput("");
      setFlattenedJson("");
      setError(caughtError instanceof Error ? caughtError.message : "Failed to flatten JSON input.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">JSON Input</h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Upload JSON
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json,text/plain"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFile(file);
              }
              event.currentTarget.value = "";
            }}
          />
          {uploadError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{uploadError}</p>
          ) : null}
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-56 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
            placeholder="Paste nested JSON object or array of objects..."
          />
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Output format</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as OutputMode)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="flattened-json">Flattened JSON</option>
              <option value="csv">CSV</option>
            </select>
          </label>
          <button
            type="button"
            onClick={transform}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Flatten and Convert
          </button>
          <p className="text-xs text-slate-600">
            Array values are preserved as JSON strings by default so nested arrays are not dropped during conversion.
          </p>
        </section>

        <ToolOutput
          value={output}
          error={error}
          downloadFileName={mode === "flattened-json" ? "flattened.json" : "flattened.csv"}
          downloadMimeType={mode === "flattened-json" ? "application/json" : "text/csv"}
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyText(flattenedJson)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Copy Flattened JSON
          </button>
          <button
            type="button"
            onClick={() => void copyText(csvOutput)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Copy CSV
          </button>
          <button
            type="button"
            onClick={() => downloadText(flattenedJson, "flattened.json", "application/json")}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={() => downloadText(csvOutput, "flattened.csv", "text/csv")}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Download CSV
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Flattened Preview</h2>
        {headers.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Run the tool to preview flattened rows.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
                  {headers.map((header) => (
                    <th key={header} className="px-3 py-2 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="border-b border-slate-100">
                    {headers.map((header) => (
                      <td key={`${header}-${rowIndex}`} className="px-3 py-2 text-slate-700">
                        {toPreviewCell(row[header])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
