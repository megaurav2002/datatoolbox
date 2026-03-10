"use client";

import { useMemo, useRef, useState } from "react";
import ToolOutput from "@/components/ToolOutput";
import {
  analyzeCsvForSql,
  generateSqlFromCsvRows,
  type CsvToSqlOptions,
  type SqlColumnDefinition,
  type SqlColumnType,
  type SqlDialect,
  type SqlOutputMode,
} from "@/lib/transformations/csv-to-sql";
import type { ToolDefinition } from "@/lib/types";

const sqlTypes: SqlColumnType[] = ["INTEGER", "DECIMAL", "BOOLEAN", "DATE", "DATETIME", "TEXT"];

type CsvToSqlToolProps = {
  tool: ToolDefinition;
};

export default function CsvToSqlTool({ tool }: CsvToSqlToolProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [tableName, setTableName] = useState("imported_data");
  const [dialect, setDialect] = useState<SqlDialect>("generic");
  const [mode, setMode] = useState<SqlOutputMode>("create-and-insert");
  const [columns, setColumns] = useState<SqlColumnDefinition[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewRows = useMemo(() => rows.slice(0, 5), [rows]);

  const resetAnalysis = () => {
    setColumns([]);
    setRows([]);
    setOutput("");
    setError("");
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      setInput(text);
      resetAnalysis();
      setUploadError("");
    } catch {
      setUploadError("Could not read this CSV file.");
    }
  };

  const detectColumns = () => {
    setError("");
    try {
      const analysis = analyzeCsvForSql(input);
      setColumns(analysis.columns);
      setRows(analysis.rows);
      setTableName(analysis.suggestedTableName);
    } catch (caughtError) {
      setColumns([]);
      setRows([]);
      setOutput("");
      setError(caughtError instanceof Error ? caughtError.message : "Failed to parse CSV input.");
    }
  };

  const generateSql = () => {
    setError("");

    try {
      let activeColumns = columns;
      let activeRows = rows;

      if (activeColumns.length === 0) {
        const analysis = analyzeCsvForSql(input);
        activeColumns = analysis.columns;
        activeRows = analysis.rows;
        setColumns(activeColumns);
        setRows(activeRows);
      }

      const options: CsvToSqlOptions = {
        tableName,
        dialect,
        mode,
        columns: activeColumns,
      };

      const sql = generateSqlFromCsvRows(activeRows, options);
      setOutput(sql);
    } catch (caughtError) {
      setOutput("");
      setError(caughtError instanceof Error ? caughtError.message : "Failed to generate SQL output.");
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
            onChange={(event) => {
              setInput(event.target.value);
              resetAnalysis();
            }}
            className="min-h-56 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
            placeholder="Paste CSV with headers on the first row..."
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={detectColumns}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Detect Columns
            </button>
            <button
              type="button"
              onClick={generateSql}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Generate SQL
            </button>
          </div>
          <p className="text-xs text-slate-600">
            Column types are inferred heuristically from sample values. Review and edit before using in production.
          </p>
        </section>

        <ToolOutput
          value={output}
          error={error}
          downloadFileName="generated.sql"
          downloadMimeType="text/sql"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">SQL Options</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Table name</span>
            <input
              value={tableName}
              onChange={(event) => setTableName(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">SQL dialect</span>
            <select
              value={dialect}
              onChange={(event) => setDialect(event.target.value as SqlDialect)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="generic">Generic SQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Output mode</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as SqlOutputMode)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="create-and-insert">CREATE TABLE + INSERT</option>
              <option value="insert-only">INSERT only</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Columns</h2>
        {columns.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Run Detect Columns to infer names and data types.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-2 py-2 font-medium">Column</th>
                  <th className="px-2 py-2 font-medium">SQL Type</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((column, index) => (
                  <tr key={column.key} className="border-b border-slate-100">
                    <td className="px-2 py-2">
                      <input
                        value={column.name}
                        onChange={(event) => {
                          const next = [...columns];
                          next[index] = { ...column, name: event.target.value };
                          setColumns(next);
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={column.type}
                        onChange={(event) => {
                          const next = [...columns];
                          next[index] = { ...column, type: event.target.value as SqlColumnType };
                          setColumns(next);
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      >
                        {sqlTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">CSV Preview</h2>
        {previewRows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No preview rows yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
                  {columns.map((column) => (
                    <th key={column.key} className="px-3 py-2 font-medium">
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="border-b border-slate-100">
                    {columns.map((column, columnIndex) => (
                      <td key={`${column.key}-${rowIndex}`} className="px-3 py-2 text-slate-700">
                        {row[columnIndex] ?? ""}
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
