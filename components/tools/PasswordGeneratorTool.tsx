"use client";

import { useState } from "react";
import ToolOutput from "@/components/ToolOutput";
import { transformations } from "@/lib/transformations";

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const onLengthChange = (next: number) => {
    if (!Number.isFinite(next)) {
      return;
    }
    const clamped = Math.min(128, Math.max(8, Math.round(next)));
    setLength(clamped);
  };

  const onGenerate = () => {
    try {
      const transform = transformations["password-generator"];
      const result = transform(
        JSON.stringify({
          length,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        }),
      );
      setOutput(result.output);
      setError("");
    } catch (caughtError) {
      setOutput("");
      setError(
        caughtError instanceof Error ? caughtError.message : "Could not generate password.",
      );
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Password options</h2>
        <p className="text-sm text-slate-700">
          Configure length and character sets, then generate a strong password.
        </p>

        <label className="block space-y-2 text-sm text-slate-700">
          Length: <span className="font-semibold text-slate-900">{length}</span>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(event) => onLengthChange(Number(event.target.value))}
            className="w-full"
          />
          <input
            type="number"
            min={8}
            max={128}
            value={length}
            onChange={(event) => onLengthChange(Number(event.target.value))}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5"
          />
        </label>

        <div className="space-y-2 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(event) => setIncludeUppercase(event.target.checked)}
            />
            Include uppercase (A-Z)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(event) => setIncludeLowercase(event.target.checked)}
            />
            Include lowercase (a-z)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(event) => setIncludeNumbers(event.target.checked)}
            />
            Include numbers (0-9)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(event) => setIncludeSymbols(event.target.checked)}
            />
            Include symbols (!@#$...)
          </label>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Generate Password
        </button>
      </section>

      <ToolOutput
        value={output}
        error={error}
        downloadFileName="password.txt"
        downloadMimeType="text/plain"
      />
    </section>
  );
}
