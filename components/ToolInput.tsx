"use client";

import { useRef, useState } from "react";

type ToolInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onTransform: () => void;
  loading?: boolean;
};

export default function ToolInput({
  value,
  onChange,
  placeholder,
  onTransform,
  loading = false,
}: ToolInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      setUploadError("");
      onChange(text);
    } catch {
      setUploadError("Could not read this file. Please try another file.");
    }
  };

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Input</h2>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Upload File
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-48 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
      />
      <button
        type="button"
        onClick={onTransform}
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Transform"}
      </button>
    </section>
  );
}
