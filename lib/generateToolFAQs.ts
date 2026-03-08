import type { ToolDefinition } from "@/lib/types";

type FAQItem = {
  question: string;
  answer: string;
};

const categoryFAQTemplates: Record<string, (toolName: string) => FAQItem[]> = {
  "json-tools": (toolName) => [
    {
      question: "What is JSON formatting?",
      answer:
        "JSON formatting makes JSON easier to read by adding indentation and consistent spacing. This is useful when reviewing API payloads and configuration files.",
    },
    {
      question: "Why should I validate JSON?",
      answer:
        "Validating JSON helps catch syntax issues before you use the data in an app, API, or import flow. It reduces parsing errors and saves debugging time.",
    },
    {
      question: `What causes invalid JSON in the ${toolName}?`,
      answer:
        "Invalid JSON is usually caused by trailing commas, missing quotes around keys or strings, mismatched brackets, or other syntax mistakes.",
    },
  ],
  "csv-tools": (toolName) => [
    {
      question: "What is a CSV file?",
      answer:
        "A CSV file is a plain text format where values are separated by commas. It is commonly used for spreadsheet exports, data imports, and simple tabular data exchange.",
    },
    {
      question: `How do I use the ${toolName} with spreadsheet data?`,
      answer:
        "Copy your CSV content from a spreadsheet export or text file, paste it into the tool input, run the transformation, and review the output before copying or downloading it.",
    },
    {
      question: "Why is my CSV not parsing correctly?",
      answer:
        "CSV parsing issues usually come from inconsistent column counts, unescaped quotes, commas inside values, or line breaks inside cells.",
    },
  ],
  "text-tools": (toolName) => [
    {
      question: `How do I use the ${toolName} with large text blocks?`,
      answer:
        "Paste your text into the tool, run it in the browser, and review the cleaned output. For very large text files, response speed will depend on browser memory and device performance.",
    },
    {
      question: "How do I remove duplicate lines from text?",
      answer:
        "Paste your text with one item per line into the tool and run it. The tool keeps the first occurrence of each line and removes repeats.",
    },
    {
      question: "Can this tool process large text files?",
      answer:
        "Yes, for typical browser-sized inputs. Since processing is usually client-side, very large files may still be limited by the browser and device resources.",
    },
  ],
  "developer-tools": (toolName) => [
    {
      question: `Who is the ${toolName} for?`,
      answer:
        "This tool is useful for developers, analysts, and technical users who need a quick browser-based utility without installing extra software.",
    },
    {
      question: "Why use an online developer utility instead of installing a package?",
      answer:
        "An online utility is faster for quick checks, one-off tasks, and debugging. It avoids setup time and works immediately in the browser.",
    },
  ],
  "spreadsheet-tools": (toolName) => [
    {
      question: `Can I use the ${toolName} with Excel or Google Sheets data?`,
      answer:
        "Yes. Most spreadsheet-oriented tools work well with copied spreadsheet content or data exported from Excel and Google Sheets.",
    },
    {
      question: "Why use a spreadsheet tool in the browser?",
      answer:
        "Browser-based spreadsheet tools are useful for quick conversions, cleanups, and formula-related tasks without opening a full spreadsheet workflow.",
    },
  ],
};

export function generateToolFAQs(tool: ToolDefinition): FAQItem[] {
  const name = tool.title;

  const baseFAQs: FAQItem[] = [
    {
      question: `What does the ${name} tool do?`,
      answer: `${name} helps you quickly process and transform your data directly in the browser.`,
    },
    {
      question: `How do I use the ${name}?`,
      answer:
        "Paste your input data into the tool, run the transformation, and then copy or download the generated output.",
    },
    {
      question: `Is the ${name} free to use?`,
      answer: "Yes. DataToolbox tools are free to use without registration.",
    },
    {
      question: `Does the ${name} process data securely?`,
      answer:
        "Yes. Most DataToolbox tools process data directly in your browser and do not require uploading your data to a server.",
    },
    {
      question: `What types of input does the ${name} support?`,
      answer:
        "The tool accepts standard text input for the relevant format, such as CSV, JSON, or plain text, depending on the tool.",
    },
  ];

  const categoryFAQs = tool.categories.flatMap((category) =>
    categoryFAQTemplates[category] ? categoryFAQTemplates[category](name) : [],
  );

  const mergedFAQs = [...baseFAQs, ...categoryFAQs, ...tool.faq];
  const seenQuestions = new Set<string>();

  return mergedFAQs.filter((item) => {
    const normalized = item.question.trim().toLowerCase();
    if (seenQuestions.has(normalized)) {
      return false;
    }

    seenQuestions.add(normalized);
    return true;
  });
}
