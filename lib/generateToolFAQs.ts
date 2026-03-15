import type { ToolDefinition } from "@/lib/types";

type FAQItem = {
  question: string;
  answer: string;
};

const toolFAQTemplates: Partial<Record<string, FAQItem[]>> = {
  "remove-duplicate-lines": [
    {
      question: "Does Remove Duplicate Lines keep the first occurrence?",
      answer: "Yes. The first instance of each line is kept and later repeats are removed.",
    },
    {
      question: "Does Remove Duplicate Lines preserve original order?",
      answer: "Yes. Remaining lines stay in their original top-to-bottom order.",
    },
    {
      question: "Is duplicate matching case-sensitive?",
      answer: "Yes. `Apple` and `apple` are treated as different lines.",
    },
  ],
  "json-validator": [
    {
      question: "What makes JSON invalid in this validator?",
      answer: "Common issues are trailing commas, missing quotes, unescaped characters, and mismatched braces or brackets.",
    },
    {
      question: "Does JSON Validator check schema rules?",
      answer: "No. It checks JSON syntax only, not schema constraints or business logic.",
    },
  ],
  "timestamp-converter": [
    {
      question: "How does Timestamp Converter detect seconds vs milliseconds?",
      answer: "It inspects numeric length and converts both representations into normalized UTC and local-time values.",
    },
    {
      question: "Does Timestamp Converter show UTC and local time?",
      answer: "Yes. It returns UTC output and local-time output so timezone offsets are clear.",
    },
  ],
  "base64-decoder": [
    {
      question: "Why can Base64 Decoder fail on some strings?",
      answer: "Failures usually come from invalid characters, truncated input, or incorrect padding.",
    },
    {
      question: "Can Base64 Decoder handle URL-safe Base64?",
      answer: "This decoder expects standard Base64 input. Convert URL-safe variants first if needed.",
    },
  ],
  "regex-tester": [
    {
      question: "Can Regex Tester + Generator run patterns with flags?",
      answer: "Yes. Enter flags like `g`, `i`, or `m` in the flags field to control global, case-insensitive, and multiline matching.",
    },
    {
      question: "How accurate is the regex generator?",
      answer: "It uses deterministic heuristics for common intents. Treat suggestions as a starting point and validate against real sample text.",
    },
  ],
  "sql-formatter": [
    {
      question: "Does SQL Formatter change query logic?",
      answer: "No. It reformats text for readability but does not execute or rewrite query semantics.",
    },
    {
      question: "Is SQL Formatter fully dialect-aware?",
      answer: "It handles common SQL patterns and is best used as a lightweight readability formatter.",
    },
  ],
};

function inputExpectation(tool: ToolDefinition): string {
  if (tool.slug === "regex-tester") {
    return "Enter a regex pattern, optional flags, and sample text to test matches. You can also start with a plain-English prompt in the generator section.";
  }

  if (tool.categories.includes("csv-tools")) {
    return "Use CSV-like tabular input, typically with a header row first.";
  }

  if (tool.categories.includes("json-tools")) {
    return "Use valid JSON input unless the tool explicitly asks for path or pattern syntax first.";
  }

  if (tool.categories.includes("text-tools")) {
    return "Use plain text input, usually one item per line for list-oriented tools.";
  }

  if (tool.slug.includes("sql")) {
    return "Use SQL text input in the format described by the tool example.";
  }

  return "Use the format shown in the example input on this page.";
}

function outputExpectation(tool: ToolDefinition): string {
  if (tool.slug === "regex-tester") {
    return "It returns match count, matched values, match positions, and capture-group values when groups are present.";
  }

  if (tool.outputFileName) {
    return `It returns transformed output you can copy or download as \`${tool.outputFileName}\`.`;
  }

  return "It returns transformed output that you can copy directly from the result panel.";
}

function commonFailureHint(tool: ToolDefinition): string {
  if (tool.commonMistakes && tool.commonMistakes.length > 0) {
    return `A common issue is: ${tool.commonMistakes[0]}`;
  }

  return "Most failures come from malformed input that does not match the expected format.";
}

function dynamicToolFAQs(tool: ToolDefinition): FAQItem[] {
  return [
    {
      question: `What input format does ${tool.title} expect?`,
      answer: inputExpectation(tool),
    },
    {
      question: `What does ${tool.title} output?`,
      answer: outputExpectation(tool),
    },
    {
      question: `Why might ${tool.title} return an error?`,
      answer: commonFailureHint(tool),
    },
    {
      question: `Does ${tool.title} run in the browser?`,
      answer: "Yes. Transformations are designed for in-browser usage so you can test and iterate quickly.",
    },
    {
      question: `Can I copy or download results from ${tool.title}?`,
      answer: tool.outputFileName
        ? "Yes. You can copy the result or use the download action when file output is available."
        : "Yes. You can copy transformed output directly from the tool.",
    },
  ];
}

export function generateToolFAQs(tool: ToolDefinition): FAQItem[] {
  const merged = [...(toolFAQTemplates[tool.slug] ?? []), ...tool.faq, ...dynamicToolFAQs(tool)];
  const unique: FAQItem[] = [];
  const seen = new Set<string>();

  for (const item of merged) {
    const key = item.question.trim().toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(item);
  }

  return unique.slice(0, 8);
}
