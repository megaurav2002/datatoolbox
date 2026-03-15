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

type RegexPreset = {
  id: string;
  label: string;
  pattern: string;
  flags: string;
  sampleText: string;
  description: string;
};

const PROMPT_EXAMPLES = [
  "Match email addresses",
  "Extract 6 digit order numbers",
  "Match dates in DD/MM/YYYY format",
  "Find repeated spaces",
  "Match Australian phone numbers",
  "Match hex color codes",
];

const QUICK_PRESETS: RegexPreset[] = [
  {
    id: "email",
    label: "Email",
    pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b",
    flags: "g",
    sampleText: "Contact ana@example.com and support@company.io for help.",
    description: "Find common email addresses.",
  },
  {
    id: "url",
    label: "URL",
    pattern: "https?:\\/\\/[\\w.-]+(?:\\/[\\w\\-./?%&=+#]*)?",
    flags: "g",
    sampleText: "Visit https://datatoolbox.tools and http://example.org/docs.",
    description: "Match HTTP/HTTPS links.",
  },
  {
    id: "phone",
    label: "Phone",
    pattern: "\\+?[0-9][0-9()\\s.-]{7,}[0-9]",
    flags: "g",
    sampleText: "Call +61 412 345 678 or (03) 9012 3456.",
    description: "Capture common phone formats.",
  },
  {
    id: "date",
    label: "Date",
    pattern: "\\b(?:0[1-9]|[12]\\d|3[01])\\/(?:0[1-9]|1[0-2])\\/\\d{4}\\b",
    flags: "g",
    sampleText: "Invoices were issued on 01/03/2026 and 15/03/2026.",
    description: "Match DD/MM/YYYY dates.",
  },
  {
    id: "hex",
    label: "Hex color",
    pattern: "#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\\b",
    flags: "g",
    sampleText: "Theme uses #0ea5e9 and #334155 for components.",
    description: "Find CSS hex color values.",
  },
  {
    id: "pin",
    label: "4-digit PIN",
    pattern: "\\b\\d{4}\\b",
    flags: "g",
    sampleText: "Use PIN 4821 for kiosk access.",
    description: "Match four-digit codes.",
  },
  {
    id: "uuid",
    label: "UUID",
    pattern: "\\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\b",
    flags: "gi",
    sampleText: "Request id 550e8400-e29b-41d4-a716-446655440000 was processed.",
    description: "Match RFC4122 UUID strings.",
  },
  {
    id: "ipv4",
    label: "IPv4",
    pattern: "\\b(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)){3}\\b",
    flags: "g",
    sampleText: "Allowed hosts: 192.168.0.10 and 10.0.0.1.",
    description: "Match IPv4 addresses with octet bounds.",
  },
];

const COMMON_PATTERNS = [
  {
    id: "pattern-email",
    label: "Email address",
    pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b",
    explanation: "Matches standard email address formats in text blocks.",
  },
  {
    id: "pattern-url",
    label: "URL",
    pattern: "https?:\\/\\/[\\w.-]+(?:\\/[\\w\\-./?%&=+#]*)?",
    explanation: "Matches HTTP and HTTPS URLs including path and query fragments.",
  },
  {
    id: "pattern-ipv4",
    label: "IPv4 address",
    pattern: "\\b(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)){3}\\b",
    explanation: "Matches IPv4 addresses while constraining each octet to 0-255.",
  },
  {
    id: "pattern-hex-color",
    label: "Hex color",
    pattern: "#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\\b",
    explanation: "Captures 3, 6, and 8-character hexadecimal color values.",
  },
  {
    id: "pattern-ddmmyyyy",
    label: "DD/MM/YYYY date",
    pattern: "\\b(?:0[1-9]|[12]\\d|3[01])\\/(?:0[1-9]|1[0-2])\\/\\d{4}\\b",
    explanation: "Matches dates in day/month/year format with basic date-range checks.",
  },
  {
    id: "pattern-6-digit",
    label: "6-digit code",
    pattern: "\\b\\d{6}\\b",
    explanation: "Extracts standalone six-digit codes like OTPs or order references.",
  },
  {
    id: "pattern-whitespace",
    label: "Whitespace cleanup",
    pattern: " {2,}",
    explanation: "Finds repeated spaces so text can be normalized.",
  },
  {
    id: "pattern-username",
    label: "Username pattern",
    pattern: "^[A-Za-z0-9_]{3,30}$",
    explanation: "Validates usernames 3-30 chars using letters, numbers, and underscores.",
  },
] as const;

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
    throw new Error("Invalid regex pattern or flags. Check escapes (for example \\d or \\.) and valid flags (g, i, m, s, u, y).");
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
  const [copiedPatternId, setCopiedPatternId] = useState<string | null>(null);
  const [copyStatusMessage, setCopyStatusMessage] = useState("");

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

  const copyToClipboard = async (value: string): Promise<boolean> => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // Fall back to a text-area copy method below.
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.setAttribute("readonly", "true");
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);
      return copied;
    } catch {
      return false;
    }
  };

  const onCopyRegex = async () => {
    const descriptor = `/${pattern}/${normalizeFlags(flags)}`;
    const copied = await copyToClipboard(descriptor);
    setCopyStatusMessage(copied ? "Regex copied." : "Could not copy regex. Copy manually from the pattern field.");
    setTimeout(() => setCopyStatusMessage(""), 1800);
  };

  const onApplyPreset = (preset: RegexPreset) => {
    setPattern(preset.pattern);
    setFlags(preset.flags);
    setSampleText(preset.sampleText);
    setSuggestion(null);
    setGeneratorError("");
    setTestError("");
    setTestResult(null);
    setActivePanel("test");
  };

  const onCopyPattern = async (id: string, patternValue: string) => {
    const copied = await copyToClipboard(patternValue);
    if (copied) {
      setCopiedPatternId(id);
      setCopyStatusMessage("Pattern copied.");
      setTimeout(() => {
        setCopiedPatternId((current) => (current === id ? null : current));
      }, 1200);
      setTimeout(() => setCopyStatusMessage(""), 1800);
      return;
    }

    setCopiedPatternId(null);
    setCopyStatusMessage("Could not copy pattern. Copy manually from the pattern card.");
    setTimeout(() => setCopyStatusMessage(""), 1800);
  };

  return (
    <section className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Regex Tester + Generator</h3>
        <p className="mt-2 text-sm text-slate-700">
          Test regex online and generate starter regex from plain-English descriptions.
        </p>
      </section>

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
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label={`Use prompt example: ${example}`}
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
        <p className="mt-2 text-sm text-slate-700">
          Choose a preset, test your pattern against realistic sample text, and verify match groups before using it in code.
        </p>
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-900">Quick presets</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label={`Apply ${preset.label} preset`}
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
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
        {copyStatusMessage ? (
          <p className="mt-2 text-xs text-slate-600" aria-live="polite">
            {copyStatusMessage}
          </p>
        ) : null}

        {testError ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{testError}</p>
        ) : null}

        {testResult ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              <p>
                <span className="font-semibold text-slate-900">Pattern:</span> {testResult.regex}
              </p>
              <p className="mt-2 inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                Match count: {testResult.matches.length}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {testResult.matches.length === 0
                  ? "No matches were found. Try changing flags, anchors, or sample text."
                  : "Review indexes and capture groups below to confirm expected matches."}
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
                        <ul className="mt-1 flex flex-wrap gap-1 text-xs text-slate-600">
                          {match.groups.map((group, groupIndex) => (
                            <li key={`${match.index}-${groupIndex}`} className="rounded bg-slate-100 px-1.5 py-0.5">
                              g{groupIndex + 1}: {group === "" ? "(empty)" : group}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  No matches found for this pattern and flag combination.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">When to use flags</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="rounded border border-slate-200 p-2 text-sm text-slate-700">
            <strong>g</strong>: find all matches, not only the first.
          </p>
          <p className="rounded border border-slate-200 p-2 text-sm text-slate-700">
            <strong>i</strong>: case-insensitive matching.
          </p>
          <p className="rounded border border-slate-200 p-2 text-sm text-slate-700">
            <strong>m</strong>: <code>^</code> and <code>$</code> match each line boundary.
          </p>
          <p className="rounded border border-slate-200 p-2 text-sm text-slate-700">
            <strong>s</strong>: dot <code>.</code> also matches line breaks.
          </p>
          <p className="rounded border border-slate-200 p-2 text-sm text-slate-700">
            <strong>u</strong>: use Unicode-aware matching.
          </p>
          <p className="rounded border border-slate-200 p-2 text-sm text-slate-700">
            <strong>y</strong>: sticky matching from the current position only.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Common Regex Patterns</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {COMMON_PATTERNS.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <code className="mt-2 block break-all rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">
                {item.pattern}
              </code>
              <p className="mt-2 text-xs text-slate-600">{item.explanation}</p>
              <button
                type="button"
                onClick={() => void onCopyPattern(item.id, item.pattern)}
                className="mt-2 rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                {copiedPatternId === item.id ? "Copied" : "Copy pattern"}
              </button>
            </article>
          ))}
        </div>
      </section>

    </section>
  );
}
