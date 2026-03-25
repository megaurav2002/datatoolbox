"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
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

const CsvToSqlTool = dynamic(() => import("@/components/tools/CsvToSqlTool"));
const JsonFlattenToCsvTool = dynamic(() => import("@/components/tools/JsonFlattenToCsvTool"));
const JsonDiffCheckerTool = dynamic(() => import("@/components/tools/JsonDiffCheckerTool"));
const CsvCleanerTool = dynamic(() => import("@/components/tools/CsvCleanerTool"));
const MermaidEditorTool = dynamic(() => import("@/components/tools/MermaidEditorTool"));
const HashGeneratorTool = dynamic(() => import("@/components/tools/HashGeneratorTool"));
const CsvViewerTool = dynamic(() => import("@/components/tools/CsvViewerTool"));
const CronExpressionBuilderTool = dynamic(() => import("@/components/tools/CronExpressionBuilderTool"));
const PasswordGeneratorTool = dynamic(() => import("@/components/tools/PasswordGeneratorTool"));
const RegexTesterTool = dynamic(() => import("@/components/tools/RegexTesterTool"));
const UrlParserTool = dynamic(() => import("@/components/tools/UrlParserTool"));
const WebsiteTechStackDetectorTool = dynamic(() => import("@/components/tools/WebsiteTechStackDetectorTool"));
const YamlValidatorTool = dynamic(() => import("@/components/tools/YamlValidatorTool"));
const XmlValidatorTool = dynamic(() => import("@/components/tools/XmlValidatorTool"));

let transformationsPromise: Promise<typeof import("@/lib/transformations")> | null = null;

async function loadTransformations() {
  if (!transformationsPromise) {
    transformationsPromise = import("@/lib/transformations");
  }
  try {
    return await transformationsPromise;
  } catch (error) {
    transformationsPromise = null;
    throw error;
  }
}

function DefaultToolClient({ tool }: ToolClientProps) {
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
        const { transformations } = await loadTransformations();
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
    <section className="space-y-4">
      {tool.slug === "json-to-csv" ? (
        <p className="text-sm text-slate-700">
          Nested objects are flattened automatically. For deeper nested arrays or custom flattening, use{" "}
          <Link href="/tools/json-flatten-to-csv" className="underline">
            JSON Flatten / JSON to CSV
          </Link>{" "}
          first.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
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
      </div>
    </section>
  );
}

export default function ToolClient({ tool }: ToolClientProps) {
  if (tool.slug === "csv-to-sql") {
    return <CsvToSqlTool tool={tool} />;
  }

  if (tool.slug === "json-flatten-to-csv") {
    return <JsonFlattenToCsvTool tool={tool} />;
  }

  if (tool.slug === "json-diff-checker") {
    return <JsonDiffCheckerTool tool={tool} />;
  }

  if (tool.slug === "csv-cleaner") {
    return <CsvCleanerTool tool={tool} />;
  }

  if (tool.slug === "mermaid-editor") {
    return <MermaidEditorTool tool={tool} />;
  }

  if (tool.slug === "hash-generator") {
    return <HashGeneratorTool tool={tool} />;
  }

  if (tool.slug === "csv-viewer") {
    return <CsvViewerTool tool={tool} />;
  }

  if (tool.slug === "cron-expression-builder") {
    return <CronExpressionBuilderTool />;
  }

  if (tool.slug === "password-generator") {
    return <PasswordGeneratorTool />;
  }

  if (tool.slug === "url-parser") {
    return <UrlParserTool tool={tool} />;
  }

  if (tool.slug === "regex-tester") {
    return <RegexTesterTool />;
  }

  if (tool.slug === "yaml-validator") {
    return <YamlValidatorTool tool={tool} />;
  }

  if (tool.slug === "xml-validator") {
    return <XmlValidatorTool tool={tool} />;
  }

  if (tool.slug === "website-tech-stack-detector") {
    return <WebsiteTechStackDetectorTool />;
  }

  return <DefaultToolClient tool={tool} />;
}
