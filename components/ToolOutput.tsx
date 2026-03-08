"use client";

import { useState } from "react";

type ToolOutputProps = {
  value: string;
  error?: string;
  downloadFileName?: string;
  downloadMimeType?: string;
};

export default function ToolOutput({
  value,
  error,
  downloadFileName = "result.txt",
  downloadMimeType = "text/plain",
}: ToolOutputProps) {
  const [actionMessage, setActionMessage] = useState("");

  const copyOutput = async () => {
    if (!value) {
      setActionMessage("Nothing to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setActionMessage("Output copied.");
    } catch {
      setActionMessage("Copy failed. Please copy manually from the output box.");
    }
  };

  const downloadOutput = () => {
    if (!value) {
      setActionMessage("Nothing to download yet.");
      return;
    }

    try {
      const blob = new Blob([value], { type: downloadMimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setActionMessage("Download started.");
    } catch {
      setActionMessage("Download failed. Please try again.");
    }
  };

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Output</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void copyOutput()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={downloadOutput}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Download
          </button>
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : null}
      {!error && actionMessage ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {actionMessage}
        </p>
      ) : null}
      <textarea
        readOnly
        value={value}
        className="min-h-48 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800"
      />
    </section>
  );
}
