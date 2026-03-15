"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchVariant = "hero" | "navbar";

type ToolIndexItem = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
};

type ToolSearchProps = {
  variant?: SearchVariant;
  placeholder?: string;
};

const MAX_RESULTS = 8;
let toolIndexPromise: Promise<ToolIndexItem[]> | null = null;

async function loadToolIndex(): Promise<ToolIndexItem[]> {
  if (!toolIndexPromise) {
    toolIndexPromise = fetch("/tools-index.json", { cache: "force-cache" })
      .then(async (response) => {
        if (!response.ok) {
          toolIndexPromise = null;
          return [];
        }
        const payload = await response.json();
        if (!Array.isArray(payload)) {
          toolIndexPromise = null;
          return [];
        }
        return payload as ToolIndexItem[];
      })
      .catch(() => {
        toolIndexPromise = null;
        return [];
      });
  }
  return toolIndexPromise;
}

function rankResult(tool: ToolIndexItem, query: string): number {
  const q = query.toLowerCase();
  const title = tool.title.toLowerCase();
  const description = tool.description.toLowerCase();
  const tags = tool.tags.join(" ").toLowerCase();

  if (title.startsWith(q)) return 0;
  if (title.includes(q)) return 1;
  if (tags.includes(q)) return 2;
  if (description.includes(q)) return 3;
  return 10;
}

export default function ToolSearch({
  variant = "hero",
  placeholder = "Search tools by name, description, or tags...",
}: ToolSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [tools, setTools] = useState<ToolIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    void loadToolIndex().then((data) => {
      if (isMounted) {
        setTools(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return [];
    }

    return tools
      .filter((tool) => {
        return (
          tool.title.toLowerCase().includes(value) ||
          tool.description.toLowerCase().includes(value) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(value))
        );
      })
      .sort((a, b) => rankResult(a, value) - rankResult(b, value))
      .slice(0, MAX_RESULTS);
  }, [query, tools]);

  const selectSuggestion = (tool: ToolIndexItem) => {
    setOpen(false);
    setQuery(tool.title);
    router.push(tool.url);
  };

  const inputClassName =
    variant === "navbar"
      ? "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
      : "w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500";

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="search"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (!open || suggestions.length === 0) {
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
          }

          if (event.key === "Enter") {
            event.preventDefault();
            const selected = suggestions[activeIndex] ?? suggestions[0];
            if (selected) {
              selectSuggestion(selected);
            }
          }

          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        className={inputClassName}
        role="combobox"
        aria-label="Search tools"
        aria-expanded={open}
        aria-controls="tool-search-suggestions"
      />

      {open && query.trim() ? (
        <div
          id="tool-search-suggestions"
          className="absolute z-30 mt-2 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
        >
          {suggestions.length > 0 ? (
            <ul className="space-y-1">
              {suggestions.map((tool, index) => (
                <li key={tool.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectSuggestion(tool)}
                    className={`w-full rounded-md px-3 py-2 text-left ${
                      index === activeIndex ? "bg-slate-100" : "hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{tool.title}</p>
                    <p className="text-xs text-slate-600">{tool.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-slate-600">
              No matches found. View all tools in <Link href="/tools" className="underline">Tools Directory</Link>.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
