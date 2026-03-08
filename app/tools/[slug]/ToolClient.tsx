"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import { transformations } from "@/lib/transformations";
import type { ToolDefinition } from "@/lib/types";

type ToolClientProps = {
  tool: ToolDefinition;
};

type ApiResponse = {
  output?: string;
  error?: string;
};

async function parseApiResponse(response: Response): Promise<ApiResponse> {
  try {
    return (await response.json()) as ApiResponse;
  } catch {
    return {};
  }
}

export default function ToolClient({ tool }: ToolClientProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState(tool.outputFileName ?? "result.txt");
  const [downloadMimeType, setDownloadMimeType] = useState(tool.outputMimeType ?? "text/plain");

  const placeholder = useMemo(() => {
    if (tool.kind === "ai") {
      return "Describe what you need...";
    }
    return "Paste your input here...";
  }, [tool.kind]);

  const onTransform = async () => {
    setLoading(true);
    setError("");

    try {
      if (tool.kind === "ai") {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool: tool.slug, input }),
        });

        const data = await parseApiResponse(response);

        if (!response.ok) {
          throw new Error(data.error ?? "AI request failed.");
        }

        setOutput(data.output ?? "No output returned.");
        setDownloadFileName(`${tool.slug}.txt`);
        setDownloadMimeType("text/plain");
      } else {
        const transform = transformations[tool.slug];
        if (!transform) {
          throw new Error("Transformation not implemented.");
        }

        const result = transform(input);
        setOutput(result.output);
        setDownloadFileName(result.downloadFileName ?? tool.outputFileName ?? "result.txt");
        setDownloadMimeType(result.downloadMimeType ?? tool.outputMimeType ?? "text/plain");
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unexpected error while transforming input.";
      setError(message);
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <ToolInput
        value={input}
        onChange={setInput}
        placeholder={placeholder}
        onTransform={() => void onTransform()}
        loading={loading}
      />
      <ToolOutput
        value={output}
        error={error}
        downloadFileName={downloadFileName}
        downloadMimeType={downloadMimeType}
      />
    </section>
  );
}
