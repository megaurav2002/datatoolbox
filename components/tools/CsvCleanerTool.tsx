"use client";

import { useMemo, useRef, useState } from "react";
import ToolOutput from "@/components/ToolOutput";
import { cleanCsv, type CsvCleanerOptions } from "@/lib/transformations/csv-cleaner";
import type { ToolDefinition } from "@/lib/types";

type CsvCleanerToolProps = {
  tool: ToolDefinition;
};

const defaultOptions: CsvCleanerOptions = {
  trimWhitespace: true,
  removeEmptyRows: true,
  removeEmptyColumns: true,
  deduplicateRows: true,
  normalizeHeaders: true,
  lowercaseEmails: true,
  normalizePhoneNumbers: false,
  standardizeLineEndings: true,
};

export default function CsvCleanerTool({ tool }: CsvCleanerToolProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [options, setOptions] = useState<CsvCleanerOptions>(defaultOptions);
  const [output, setOutput] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [stats, setStats] = useState({ original: 0, cleaned: 0, removed: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewRows = useMemo(() => rows.slice(0, 8), [rows]);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      setInput(text);
      setUploadError("");
    } catch {
      setUploadError("Could not read this CSV file.");
    }
  };

  const runCleaner = () => {
    setError("");

    try {
      const result = cleanCsv(input, options);
      setOutput(result.cleanedCsv);
      setHeaders(result.headers);
      setRows(result.rows);
      setStats({
        original: result.originalRowCount,
        cleaned: result.cleanedRowCount,
        removed: result.removedRowCount,
      });
    } catch (caughtError) {
      setOutput("");
      setHeaders([]);
      setRows([]);
      setStats({ original: 0, cleaned: 0, removed: 0 });
      setError(caughtError instanceof Error ? caughtError.message : "Failed to clean CSV input.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">CSV Input</h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Upload CSV
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
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
            placeholder="Paste CSV data to clean..."
          />
          <button
            type="button"
            onClick={runCleaner}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Clean CSV
          </button>
        </section>

        <ToolOutput
          value={output}
          error={error}
          downloadFileName="cleaned.csv"
          downloadMimeType="text/csv"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Cleaning Options</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            ["trimWhitespace", "Trim whitespace in all cells"],
            ["removeEmptyRows", "Remove empty rows"],
            ["removeEmptyColumns", "Remove empty columns where safe"],
            ["deduplicateRows", "Deduplicate rows"],
            ["normalizeHeaders", "Normalize header names"],
            ["lowercaseEmails", "Lowercase emails"],
            ["normalizePhoneNumbers", "Normalize phone numbers"],
            ["standardizeLineEndings", "Standardize line endings"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={options[key as keyof CsvCleanerOptions]}
                onChange={(event) => {
                  setOptions((previous) => ({
                    ...previous,
                    [key]: event.target.checked,
                  }));
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Cleaning Summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-600">Original rows</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.original}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-600">Cleaned rows</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.cleaned}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-600">Rows removed</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.removed}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Cleaned CSV Preview</h2>
        {headers.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Run the cleaner to preview normalized rows.</p>
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
                    {headers.map((header, headerIndex) => (
                      <td key={`${header}-${rowIndex}`} className="px-3 py-2 text-slate-700">
                        {row[headerIndex] ?? ""}
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
