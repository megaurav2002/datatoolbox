"use client";

import { useRef, useState } from "react";
import ToolOutput from "@/components/ToolOutput";
import type { ToolDefinition } from "@/lib/types";

type MermaidEditorToolProps = {
  tool: ToolDefinition;
};

let mermaidModulePromise: Promise<typeof import("mermaid")> | null = null;

async function loadMermaid() {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import("mermaid");
  }

  const mermaidImport = await mermaidModulePromise;
  return mermaidImport.default;
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function svgToPng(svgMarkup: string): Promise<Blob> {
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load SVG for PNG export."));
      img.src = objectUrl;
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
    const svgRoot = doc.documentElement;

    const widthAttr = Number(svgRoot.getAttribute("width")?.replace(/px$/, ""));
    const heightAttr = Number(svgRoot.getAttribute("height")?.replace(/px$/, ""));
    const viewBox = svgRoot.getAttribute("viewBox")?.split(/\s+/).map(Number);

    const width = Number.isFinite(widthAttr)
      ? widthAttr
      : viewBox && Number.isFinite(viewBox[2])
        ? viewBox[2]
        : image.naturalWidth || 1200;
    const height = Number.isFinite(heightAttr)
      ? heightAttr
      : viewBox && Number.isFinite(viewBox[3])
        ? viewBox[3]
        : image.naturalHeight || 630;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas rendering is not available in this browser.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });

    if (!pngBlob) {
      throw new Error("Failed to create PNG file.");
    }

    return pngBlob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function MermaidEditorTool({ tool }: MermaidEditorToolProps) {
  const [input, setInput] = useState(tool.exampleInput);
  const [svgOutput, setSvgOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const mermaidInitialized = useRef(false);

  const updateInput = (nextValue: string) => {
    setInput(nextValue);
    setError("");
    setActionMessage("");
  };

  const renderDiagram = async () => {
    const source = input.trim();
    if (!source) {
      setError("Please provide Mermaid syntax.");
      setSvgOutput("");
      return;
    }

    setLoading(true);
    setError("");
    setActionMessage("");

    try {
      const mermaid = await loadMermaid();
      if (!mermaidInitialized.current) {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "default",
        });
        mermaidInitialized.current = true;
      }

      const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const { svg } = await mermaid.render(diagramId, source);
      setSvgOutput(svg);
    } catch (caughtError) {
      setSvgOutput("");
      setError(caughtError instanceof Error ? caughtError.message : "Failed to render Mermaid diagram.");
    } finally {
      setLoading(false);
    }
  };

  const copySvg = async () => {
    if (!svgOutput) {
      setActionMessage("Render a diagram before copying SVG.");
      return;
    }

    try {
      await navigator.clipboard.writeText(svgOutput);
      setActionMessage("SVG copied.");
    } catch {
      setActionMessage("Copy failed. Please copy manually from the output box.");
    }
  };

  const downloadSvg = () => {
    if (!svgOutput) {
      setActionMessage("Render a diagram before downloading SVG.");
      return;
    }

    downloadFile(svgOutput, "diagram.svg", "image/svg+xml");
    setActionMessage("SVG download started.");
  };

  const downloadPng = async () => {
    if (!svgOutput) {
      setActionMessage("Render a diagram before downloading PNG.");
      return;
    }

    try {
      const pngBlob = await svgToPng(svgOutput);
      const url = URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setActionMessage("PNG download started.");
    } catch (caughtError) {
      setActionMessage(
        caughtError instanceof Error ? caughtError.message : "PNG export failed. Try SVG download.",
      );
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Mermaid Input</h2>
            <button
              type="button"
              onClick={() => updateInput(tool.exampleInput)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Use Example
            </button>
          </div>
          <textarea
            value={input}
            onChange={(event) => updateInput(event.target.value)}
            className="min-h-56 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-500"
            placeholder="Paste Mermaid syntax, e.g. graph TD; A-->B;"
          />
          <button
            type="button"
            onClick={() => void renderDiagram()}
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Rendering..." : "Render Diagram"}
          </button>
          <p className="text-xs text-slate-600">
            Diagram rendering happens in your browser. Your Mermaid source is not uploaded.
          </p>
        </section>

        <ToolOutput
          value={svgOutput}
          error={error}
          downloadFileName="diagram.svg"
          downloadMimeType="image/svg+xml"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Preview</h2>
        {!error && actionMessage ? (
          <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{actionMessage}</p>
        ) : null}
        {svgOutput ? (
          <div className="mt-3 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div dangerouslySetInnerHTML={{ __html: svgOutput }} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Render a diagram to see the preview.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copySvg()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Copy SVG
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Download SVG
          </button>
          <button
            type="button"
            onClick={() => void downloadPng()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Download PNG
          </button>
        </div>
      </section>
    </section>
  );
}
