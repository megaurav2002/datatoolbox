"use client";

import { useState } from "react";
import md5 from "blueimp-md5";
import ToolOutput from "@/components/ToolOutput";
import type { ToolDefinition } from "@/lib/types";

type HashGeneratorToolProps = {
  tool: ToolDefinition;
};

type HashAlgorithm = "md5" | "sha-1" | "sha-256" | "sha-384" | "sha-512";

const algorithmLabels: Record<HashAlgorithm, string> = {
  md5: "MD5",
  "sha-1": "SHA-1",
  "sha-256": "SHA-256",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512",
};

const subtleAlgorithmMap: Record<Exclude<HashAlgorithm, "md5">, AlgorithmIdentifier> = {
  "sha-1": "SHA-1",
  "sha-256": "SHA-256",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512",
};

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorTool({ tool }: HashGeneratorToolProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("md5");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateHash = async () => {
    if (!input.trim()) {
      setError("Please provide input.");
      setOutput("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (algorithm === "md5") {
        setOutput(md5(input));
        return;
      }

      if (!globalThis.crypto?.subtle) {
        throw new Error("This browser does not support SHA hashing APIs.");
      }

      const bytes = new TextEncoder().encode(input);
      const digest = await globalThis.crypto.subtle.digest(subtleAlgorithmMap[algorithm], bytes);
      setOutput(bytesToHex(digest));
    } catch (caughtError) {
      setOutput("");
      setError(caughtError instanceof Error ? caughtError.message : "Failed to generate hash.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Input</h2>
            <label className="text-sm text-slate-700">
              <span className="sr-only">Hash algorithm</span>
              <select
                value={algorithm}
                onChange={(event) => {
                  setAlgorithm(event.target.value as HashAlgorithm);
                  setError("");
                  setOutput("");
                }}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-slate-500"
              >
                {Object.entries(algorithmLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
              setOutput("");
            }}
            placeholder="Paste text to hash..."
            className="min-h-48 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
          />
          <button
            type="button"
            onClick={() => void generateHash()}
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Generating..." : `Generate ${algorithmLabels[algorithm]} Hash`}
          </button>
          <p className="text-xs text-slate-600">
            Hashing runs in your browser. MD5 is provided for compatibility and is not recommended for security use.
          </p>
        </section>

        <ToolOutput value={output} error={error} downloadFileName="hash.txt" downloadMimeType="text/plain" />
      </div>
    </section>
  );
}
