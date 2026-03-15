"use client";

import { useMemo, useState } from "react";
import {
  applySuggestionToTester,
  explainRegex,
  generateRegexSuggestion,
  type RegexSuggestion,
} from "@/lib/regex-generator";

type RegexMatch = {
  value: string;
  index: number;
  groups: string[];
};

type RegexTestResult = {
  regex: string;
  matches: RegexMatch[];
};

const PROMPT_EXAMPLES = [
  "Match email addresses",
  "Extract 6 digit order numbers",
  "Match dates in DD/MM/YYYY format",
  "Find repeated spaces",
  "Match Australian phone numbers",
  "Match hex color codes",
];

function normalizeFlags(flags: string): string {
  const allowed = new Set(["d", "g", "i", "m", "s", "u", "v", "y"]);
  const ordered = ["d", "g", "i", "m", "s", "u", "v", "y"];
  const seen = new Set<string>();
  flags
    .replace(/\s+/g, "")
    .split("")
    .forEach((flag) => {
      if (allowed.has(flag)) {
        seen.add(flag);
      }
    });

  return ordered.filter((flag) => seen.has(flag)).join("");
}

function testRegex(pattern: string, rawFlags: string, sampleText: string): RegexTestResult {
  if (!pattern.trim()) {
    throw new Error("Enter a regex pattern to test.");
  }
  if (!sampleText.trim()) {
    throw new Error("Enter sample text to run the regex against.");
  }

  const flags = normalizeFlags(rawFlags);
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    throw new Error("Invalid regex pattern or flags. Check escaping and try again.");
  }

  const matches: RegexMatch[] = [];
  if (flags.includes("g")) {
    let result = regex.exec(sampleText);
    while (result) {
      matches.push({
        value: result[0],
        index: result.index,
        groups: result.slice(1).filter((group): group is string => typeof group === "string"),
      });
      if (result[0].length === 0) {
        regex.lastIndex += 1;
      }
      result = regex.exec(sampleText);
    }
  } else {
    const result = regex.exec(sampleText);
    if (result) {
      matches.push({
        value: result[0],
        index: result.index,
        groups: result.slice(1).filter((group): group is string => typeof group === "string"),
      });
    }
  }

  return {
    regex: `/${pattern}/${flags}`,
    matches,
  };
}

function highlightMatches(text: string, matches: RegexMatch[]) {
  if (matches.length === 0) {
    return [{ text, matched: false }];
  }

  const sorted = [...matches]
    .filter((match) => match.value.length > 0)
    .sort((a, b) => a.index - b.index);
  if (sorted.length === 0) {
    return [{ text, matched: false }];
  }

  const segments: Array<{ text: string; matched: boolean }> = [];
  let cursor = 0;
  sorted.forEach((match) => {
    const start = Math.max(match.index, cursor);
    const end = Math.min(match.index + match.value.length, text.length);
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), matched: false });
    }
    if (end > start) {
      segments.push({ text: text.slice(start, end), matched: true });
      cursor = end;
    }
  });

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), matched: false });
  }

  return segments;
}

export default function RegexTesterTool() {
  const [activePanel, setActivePanel] = useState<"generate" | "test">("generate");
  const [prompt, setPrompt] = useState(PROMPT_EXAMPLES[0]);
  const [suggestion, setSuggestion] = useState<RegexSuggestion | null>(null);
  const [generatorError, setGeneratorError] = useState("");
  const [pattern, setPattern] = useState("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
  const [flags, setFlags] = useState("g");
  const [sampleText, setSampleText] = useState(
    "Contact ana@example.com or team@company.io for support.",
  );
  const [testResult, setTestResult] = useState<RegexTestResult | null>(null);
  const [testError, setTestError] = useState("");

  const highlightedText = useMemo(() => {
    if (!testResult) {
      return [{ text: sampleText, matched: false }];
    }
    return highlightMatches(sampleText, testResult.matches);
  }, [sampleText, testResult]);

  const onGenerate = () => {
    setGeneratorError("");
    const nextSuggestion = generateRegexSuggestion(prompt);
    if (!nextSuggestion) {
      setSuggestion(null);
      setGeneratorError(
        "Could not infer a reliable pattern from that description. Try a more specific prompt like 'Match 6 digit order numbers'.",
      );
      return;
    }
    setSuggestion(nextSuggestion);
  };

  const onUseInTester = () => {
    if (!suggestion) {
      return;
    }
    const nextValues = applySuggestionToTester(suggestion);
    setPattern(nextValues.pattern);
    setFlags(nextValues.flags);
    setActivePanel("test");
    setTestError("");
  };

  const onRunTest = () => {
    setTestError("");
    try {
      const result = testRegex(pattern, flags, sampleText);
      setTestResult(result);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Could not run regex test.";
      setTestResult(null);
      setTestError(message);
    }
  };

  const onCopyRegex = async () => {
    const descriptor = `/${pattern}/${normalizeFlags(flags)}`;
    await navigator.clipboard.writeText(descriptor);
  };

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActivePanel("generate")}
            className={`rounded-md px-3 py-1.5 text-sm ${
              activePanel === "generate" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            Generator
          </button>
          <button
            type="button"
            onClick={() => setActivePanel("test")}
            className={`rounded-md px-3 py-1.5 text-sm ${
              activePanel === "test" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            Tester
          </button>
        </div>
      </div>

      {activePanel === "generate" ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Generate Regex from Plain English</h3>
          <p className="mt-2 text-sm text-slate-700">
            Describe what you want to match, then use the generated regex in the tester below.
          </p>
          <label htmlFor="regex-generator-prompt" className="mt-4 block text-sm font-medium text-slate-800">
            Description
          </label>
          <textarea
            id="regex-generator-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
            placeholder="Example: Match dates in DD/MM/YYYY format"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PROMPT_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPrompt(example)}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                {example}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onGenerate}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Generate Regex
          </button>

          {generatorError ? (
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {generatorError}
            </p>
          ) : null}

          {suggestion ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Suggested pattern</p>
              <code className="mt-2 block break-all rounded bg-slate-900 p-3 text-sm text-slate-100">
                /{suggestion.pattern}/{suggestion.flags}
              </code>
              <p className="mt-3 text-sm text-slate-700">{explainRegex(suggestion)}</p>
              <button
                type="button"
                onClick={onUseInTester}
                className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-white"
              >
                Use in Tester
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Regex Tester</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="regex-pattern" className="block text-sm font-medium text-slate-800">
              Pattern
            </label>
            <input
              id="regex-pattern"
              type="text"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
              placeholder="[A-Za-z]+"
            />
          </div>
          <div>
            <label htmlFor="regex-flags" className="block text-sm font-medium text-slate-800">
              Flags (g, i, m, s, u, y)
            </label>
            <input
              id="regex-flags"
              type="text"
              value={flags}
              onChange={(event) => setFlags(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
              placeholder="g"
            />
          </div>
        </div>
        <label htmlFor="regex-sample-text" className="mt-4 block text-sm font-medium text-slate-800">
          Sample text
        </label>
        <textarea
          id="regex-sample-text"
          value={sampleText}
          onChange={(event) => setSampleText(event.target.value)}
          rows={8}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
          placeholder="Paste text to test..."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRunTest}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Test Regex
          </button>
          <button
            type="button"
            onClick={() => void onCopyRegex()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Copy Regex
          </button>
        </div>

        {testError ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{testError}</p>
        ) : null}

        {testResult ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              <p>
                <span className="font-semibold text-slate-900">Pattern:</span> {testResult.regex}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-900">Match count:</span> {testResult.matches.length}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">Highlighted sample text</p>
              <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words text-sm text-slate-800">
                {highlightedText.map((segment, index) =>
                  segment.matched ? (
                    <mark key={`${segment.text}-${index}`} className="rounded bg-amber-200 px-0.5 text-slate-900">
                      {segment.text}
                    </mark>
                  ) : (
                    <span key={`${segment.text}-${index}`}>{segment.text}</span>
                  ),
                )}
              </pre>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">Matches</p>
              {testResult.matches.length > 0 ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {testResult.matches.map((match, index) => (
                    <li key={`${match.value}-${match.index}-${index}`} className="rounded border border-slate-200 p-2">
                      <p>
                        <span className="font-medium text-slate-900">#{index + 1}</span> {match.value}
                        <span className="text-slate-500"> (index {match.index})</span>
                      </p>
                      {match.groups.length > 0 ? (
                        <p className="mt-1 text-xs text-slate-600">Capture groups: {match.groups.join(", ")}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-700">No matches found for this pattern and flag combination.</p>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </section>
  );
}
