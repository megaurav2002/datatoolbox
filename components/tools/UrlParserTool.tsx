"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/lib/types";

type UrlParserToolProps = {
  tool: ToolDefinition;
};

type ParsedUrl = {
  href: string;
  protocol: string;
  host: string;
  subdomain: string;
  port: string;
  path: string;
  queryString: string;
  fragment: string;
  queryRows: Array<{ key: string; value: string }>;
};

function parseUrl(raw: string): ParsedUrl {
  const url = new URL(raw.trim());
  const hostnameParts = url.hostname.split(".").filter(Boolean);
  const subdomain =
    hostnameParts.length > 2 ? hostnameParts.slice(0, hostnameParts.length - 2).join(".") : "";

  const queryRows: Array<{ key: string; value: string }> = [];
  url.searchParams.forEach((value, key) => {
    queryRows.push({ key, value });
  });

  return {
    href: url.href,
    protocol: url.protocol,
    host: url.host,
    subdomain,
    port: url.port || "(default)",
    path: url.pathname,
    queryString: url.search || "(none)",
    fragment: url.hash || "(none)",
    queryRows,
  };
}

export default function UrlParserTool({ tool }: UrlParserToolProps) {
  const [input, setInput] = useState(
    "https://api.example.com:8443/v1/orders/42?expand=items&include=payments&env=staging#response",
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);

  const parsedJson = useMemo(() => {
    if (!parsed) {
      return "";
    }
    return JSON.stringify(
      {
        protocol: parsed.protocol,
        host: parsed.host,
        subdomain: parsed.subdomain,
        port: parsed.port,
        path: parsed.path,
        queryString: parsed.queryString,
        fragment: parsed.fragment,
        queryParams: parsed.queryRows,
      },
      null,
      2,
    );
  }, [parsed]);

  const runParser = () => {
    setError("");
    setMessage("");
    try {
      const next = parseUrl(input);
      setInput(next.href);
      setParsed(next);
    } catch {
      setParsed(null);
      setError("URL Parser requires a valid absolute URL including protocol (for example https://...).");
    }
  };

  const copyText = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(successMessage);
    } catch {
      setMessage("Could not copy. Please copy manually.");
    }
  };

  return (
    <section className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Parse URL Components</h2>
        <p className="mt-2 text-sm text-slate-700">
          Parse a URL into protocol, host, subdomain, port, path, query string, fragment, and query parameter rows.
        </p>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          className="mt-4 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
          placeholder={tool.exampleInput}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runParser}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Parse URL
          </button>
          <button
            type="button"
            onClick={() => {
              setInput(tool.exampleInput);
              setParsed(null);
              setError("");
              setMessage("");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Use Example
          </button>
          {parsed ? (
            <button
              type="button"
              onClick={() => void copyText(parsedJson, "Parsed JSON copied.")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Copy Parsed JSON
            </button>
          ) : null}
        </div>

        {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="mt-3 text-xs text-slate-600">{message}</p> : null}
      </section>

      {parsed ? (
        <section className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Parsed components</h2>
            <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <div><dt className="font-semibold text-slate-900">Protocol</dt><dd>{parsed.protocol}</dd></div>
              <div><dt className="font-semibold text-slate-900">Host</dt><dd>{parsed.host}</dd></div>
              <div><dt className="font-semibold text-slate-900">Subdomain</dt><dd>{parsed.subdomain || "(none)"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Port</dt><dd>{parsed.port}</dd></div>
              <div><dt className="font-semibold text-slate-900">Path</dt><dd>{parsed.path}</dd></div>
              <div><dt className="font-semibold text-slate-900">Fragment</dt><dd>{parsed.fragment}</dd></div>
              <div className="sm:col-span-2"><dt className="font-semibold text-slate-900">Query string</dt><dd>{parsed.queryString}</dd></div>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Query parameters</h2>
            {parsed.queryRows.length > 0 ? (
              <div className="mt-3 overflow-auto">
                <table className="min-w-full border-collapse text-sm text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-900">
                      <th className="py-2 pr-4">Key</th>
                      <th className="py-2 pr-4">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.queryRows.map((row, index) => (
                      <tr key={`${row.key}-${index}`} className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-mono">{row.key}</td>
                        <td className="py-2 pr-4 font-mono">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">(none)</p>
            )}
          </section>
        </section>
      ) : null}
    </section>
  );
}

