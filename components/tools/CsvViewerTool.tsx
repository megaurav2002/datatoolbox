"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/lib/types";
import { parseCsv } from "@/lib/transformations/csv";

type CsvViewerToolProps = {
  tool: ToolDefinition;
};

const delimiterMap: Record<string, string> = {
  comma: ",",
  semicolon: ";",
  tab: "\t",
  pipe: "|",
};

export default function CsvViewerTool({ tool }: CsvViewerToolProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [delimiter, setDelimiter] = useState<keyof typeof delimiterMap>("comma");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<string[][]>([]);

  const previewRows = useMemo(() => rows.slice(0, 100), [rows]);
  const headers = previewRows[0] ?? [];
  const body = previewRows.slice(1);

  const onPreview = () => {
    try {
      const parsed = parseCsv(input, delimiterMap[delimiter]);
      if (parsed.length === 0) {
        throw new Error("CSV Viewer requires at least one row.");
      }
      setRows(parsed);
      setError("");
    } catch (caughtError) {
      setRows([]);
      setError(caughtError instanceof Error ? caughtError.message : "Could not preview CSV.");
    }
  };

  return (
    <section className="space-y-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">CSV Input</h2>
            <label className="text-sm text-slate-700">
              Delimiter{" "}
              <select
                value={delimiter}
                onChange={(event) => setDelimiter(event.target.value as keyof typeof delimiterMap)}
                className="ml-2 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
              >
                <option value="comma">Comma</option>
                <option value="semicolon">Semicolon</option>
                <option value="tab">Tab</option>
                <option value="pipe">Pipe</option>
              </select>
            </label>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-48 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
          />
          <button
            type="button"
            onClick={onPreview}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Preview CSV
          </button>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Preview</h2>
            {rows.length > 0 ? (
              <p className="text-sm text-slate-600">
                {rows.length - 1} rows{rows.length > 101 ? " (showing first 100)" : ""}
              </p>
            ) : null}
          </div>
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          ) : null}
          {!error && rows.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              Paste CSV and click Preview CSV.
            </p>
          ) : null}
          {rows.length > 0 ? (
            <div className="overflow-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    {headers.map((header, index) => (
                      <th key={`${header}-${index}`} className="border-b border-slate-200 px-3 py-2 text-left text-slate-900">
                        {header || `column_${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`} className="odd:bg-white even:bg-slate-50">
                      {headers.map((_, cellIndex) => (
                        <td key={`cell-${rowIndex}-${cellIndex}`} className="border-b border-slate-100 px-3 py-2 text-slate-700">
                          {row[cellIndex] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
