"use client";

import { useMemo, useState } from "react";
import { compareJsonDocuments, formatPath, type JsonDiffResult } from "@/lib/json-diff";
import type { ToolDefinition } from "@/lib/types";

type JsonDiffCheckerToolProps = {
  tool: ToolDefinition;
};

const leftFallbackExample =
  '{\n  "name": "Alice",\n  "age": 30,\n  "tags": ["admin", "editor"],\n  "profile": {\n    "city": "Melbourne"\n  }\n}';
const rightFallbackExample =
  '{\n  "name": "Alice",\n  "age": 31,\n  "tags": ["admin", "owner"],\n  "profile": {\n    "city": "Sydney"\n  },\n  "active": true\n}';

function stringifyValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  return JSON.stringify(value);
}

function serializeDiff(result: JsonDiffResult, showOnlyChangedPaths: boolean): string {
  const section = (title: string, lines: string[]) => `${title}\n${lines.length > 0 ? lines.join("\n") : "(none)"}`;

  const changedLines = result.changed.map(
    (entry) => `- ${formatPath(entry.path)}: ${stringifyValue(entry.before)} -> ${stringifyValue(entry.after)}`,
  );
  if (showOnlyChangedPaths) {
    return section("Changed:", changedLines);
  }

  const addedLines = result.added.map((entry) => `- ${formatPath(entry.path)}: ${stringifyValue(entry.value)}`);
  const removedLines = result.removed.map((entry) => `- ${formatPath(entry.path)}: ${stringifyValue(entry.value)}`);
  return [section("Added:", addedLines), section("Removed:", removedLines), section("Changed:", changedLines)].join("\n\n");
}

export default function JsonDiffCheckerTool({ tool }: JsonDiffCheckerToolProps) {
  const exampleBlocks = useMemo(() => {
    const normalized = tool.exampleInput.replace(/\r\n?/g, "\n");
    const separatorMatch = normalized.match(/\n\s*\n/);
    if (!separatorMatch || separatorMatch.index === undefined) {
      return { left: leftFallbackExample, right: rightFallbackExample };
    }
    const splitIndex = separatorMatch.index;
    const separatorLength = separatorMatch[0].length;
    return {
      left: normalized.slice(0, splitIndex).trim(),
      right: normalized.slice(splitIndex + separatorLength).trim(),
    };
  }, [tool.exampleInput]);

  const [leftJson, setLeftJson] = useState(
    leftFallbackExample,
  );
  const [rightJson, setRightJson] = useState(
    rightFallbackExample,
  );
  const [ignoreKeyOrder, setIgnoreKeyOrder] = useState(true);
  const [showOnlyChangedPaths, setShowOnlyChangedPaths] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<JsonDiffResult | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  const summary = useMemo(() => {
    if (!result) {
      return null;
    }
    return {
      added: result.added.length,
      removed: result.removed.length,
      changed: result.changed.length,
    };
  }, [result]);

  const compare = () => {
    setError("");
    setActionMessage("");

    let parsedLeft: unknown;
    let parsedRight: unknown;
    try {
      parsedLeft = JSON.parse(leftJson);
    } catch {
      setResult(null);
      setError("Left JSON is invalid. Fix syntax and try again.");
      return;
    }

    try {
      parsedRight = JSON.parse(rightJson);
    } catch {
      setResult(null);
      setError("Right JSON is invalid. Fix syntax and try again.");
      return;
    }

    setLeftJson(JSON.stringify(parsedLeft, null, 2));
    setRightJson(JSON.stringify(parsedRight, null, 2));
    setResult(compareJsonDocuments(parsedLeft, parsedRight, { ignoreKeyOrder }));
  };

  const copyResults = async () => {
    if (!result) {
      setActionMessage("Run comparison first.");
      return;
    }
    const payload = serializeDiff(result, showOnlyChangedPaths);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setActionMessage("Diff results copied.");
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = payload;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textArea);
        setActionMessage(copied ? "Diff results copied." : "Could not copy results. Copy manually from the results panel.");
      } catch {
        setActionMessage("Could not copy results. Copy manually from the results panel.");
      }
    }
  };

  return (
    <section className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Compare Two JSON Documents</h2>
        <p className="mt-2 text-sm text-slate-700">
          Compare two JSON documents side by side and inspect added, removed, and changed paths with nested value
          details.
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={ignoreKeyOrder}
              onChange={(event) => setIgnoreKeyOrder(event.target.checked)}
            />
            Ignore key order
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyChangedPaths}
              onChange={(event) => setShowOnlyChangedPaths(event.target.checked)}
            />
            Show only changed paths
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="json-diff-left" className="text-sm font-medium text-slate-800">
              Left JSON
            </label>
            <textarea
              id="json-diff-left"
              value={leftJson}
              onChange={(event) => setLeftJson(event.target.value)}
              rows={14}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
              placeholder='{"name":"Alice"}'
            />
          </div>
          <div>
            <label htmlFor="json-diff-right" className="text-sm font-medium text-slate-800">
              Right JSON
            </label>
            <textarea
              id="json-diff-right"
              value={rightJson}
              onChange={(event) => setRightJson(event.target.value)}
              rows={14}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
              placeholder='{"name":"Alice","active":true}'
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={compare}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Compare JSON
          </button>
          <button
            type="button"
            onClick={() => void copyResults()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Copy Results
          </button>
          <button
            type="button"
            onClick={() => {
              setLeftJson(exampleBlocks.left);
              setRightJson(exampleBlocks.right);
              setError("");
              setResult(null);
              setActionMessage("");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Use Example
          </button>
        </div>

        {error ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        {actionMessage ? <p className="mt-3 text-xs text-slate-600">{actionMessage}</p> : null}
      </section>

      {result ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Diff Results</h2>
          {summary ? (
            <p className="mt-2 text-sm text-slate-700">
              Added: <strong>{summary.added}</strong> | Removed: <strong>{summary.removed}</strong> | Changed:{" "}
              <strong>{summary.changed}</strong>
            </p>
          ) : null}

          {showOnlyChangedPaths ? (
            <div className="mt-4 rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Changed</h3>
              {result.changed.length > 0 ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {result.changed.map((entry) => (
                    <li key={`changed-${entry.path || "root"}`}>
                      <code className="font-mono text-xs text-slate-900">{formatPath(entry.path)}</code>:{" "}
                      {stringifyValue(entry.before)} -&gt; {stringifyValue(entry.after)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-600">(none)</p>
              )}
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="text-sm font-semibold text-emerald-900">Added</h3>
                {result.added.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm text-emerald-900">
                    {result.added.map((entry) => (
                      <li key={`added-${entry.path || "root"}`}>
                        <code className="font-mono text-xs">{formatPath(entry.path)}</code>: {stringifyValue(entry.value)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-emerald-800">(none)</p>
                )}
              </div>

              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                <h3 className="text-sm font-semibold text-rose-900">Removed</h3>
                {result.removed.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm text-rose-900">
                    {result.removed.map((entry) => (
                      <li key={`removed-${entry.path || "root"}`}>
                        <code className="font-mono text-xs">{formatPath(entry.path)}</code>: {stringifyValue(entry.value)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-rose-800">(none)</p>
                )}
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-semibold text-amber-900">Changed</h3>
                {result.changed.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm text-amber-900">
                    {result.changed.map((entry) => (
                      <li key={`changed-${entry.path || "root"}`}>
                        <code className="font-mono text-xs">{formatPath(entry.path)}</code>: {stringifyValue(entry.before)}{" "}
                        -&gt; {stringifyValue(entry.after)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-amber-800">(none)</p>
                )}
              </div>
            </div>
          )}
        </section>
      ) : null}
    </section>
  );
}
