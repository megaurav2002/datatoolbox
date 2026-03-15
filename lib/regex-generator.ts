export type RegexGeneratorIntent =
  | "email"
  | "url"
  | "phone-au"
  | "phone"
  | "integer"
  | "decimal"
  | "number"
  | "date-dd-mm-yyyy"
  | "time"
  | "postcode-au"
  | "zip-us"
  | "hex-color"
  | "hashtag"
  | "username"
  | "whitespace"
  | "duplicate-spaces"
  | "line-starts-with"
  | "line-ends-with"
  | "fixed-digits"
  | "alphanumeric-id";

export type RegexSuggestion = {
  intent: RegexGeneratorIntent;
  pattern: string;
  flags: string;
  explanation: string;
};

type DetectedIntent = {
  intent: RegexGeneratorIntent;
  literal?: string;
  digitCount?: number;
};

function extractLiteral(source: string, matcher: RegExp): string | undefined {
  const hit = source.match(matcher);
  if (!hit?.[1]) {
    return undefined;
  }
  return hit[1].trim().replace(/^["']|["']$/g, "");
}

function escapeRegexLiteral(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().replace(/\s+/g, " ").trim();
}

export function detectPromptIntent(prompt: string): DetectedIntent | null {
  const original = prompt.replace(/\s+/g, " ").trim();
  const normalized = normalizePrompt(prompt);
  if (!normalized) {
    return null;
  }

  const startsWith = extractLiteral(
    original,
    /(?:lines?\s+)?(?:starting|starts)\s+with\s+(.+)$/i,
  );
  if (startsWith) {
    return { intent: "line-starts-with", literal: startsWith };
  }

  const endsWith = extractLiteral(
    original,
    /(?:lines?\s+)?(?:ending|ends)\s+with\s+(.+)$/i,
  );
  if (endsWith) {
    return { intent: "line-ends-with", literal: endsWith };
  }

  const fixedDigitMatch = normalized.match(/\b(\d{1,2})\s*[- ]?digit(?:s)?\b/);
  if (fixedDigitMatch?.[1]) {
    const digitCount = Number(fixedDigitMatch[1]);
    if (Number.isInteger(digitCount) && digitCount > 0 && digitCount <= 20) {
      return { intent: "fixed-digits", digitCount };
    }
  }

  if (normalized.includes("duplicate spaces") || normalized.includes("repeated spaces")) {
    return { intent: "duplicate-spaces" };
  }
  if (normalized.includes("email")) {
    return { intent: "email" };
  }
  if (normalized.includes("hex color") || normalized.includes("hex colour")) {
    return { intent: "hex-color" };
  }
  if (normalized.includes("hashtag")) {
    return { intent: "hashtag" };
  }
  if (normalized.includes("username") || normalized.includes("user name")) {
    return { intent: "username" };
  }
  if (normalized.includes("australian phone") || normalized.includes("au phone")) {
    return { intent: "phone-au" };
  }
  if (normalized.includes("phone")) {
    return { intent: "phone" };
  }
  if (normalized.includes("postcode") && normalized.includes("australia")) {
    return { intent: "postcode-au" };
  }
  if (normalized.includes("zip")) {
    return { intent: "zip-us" };
  }
  if (normalized.includes("date") && normalized.includes("dd/mm/yyyy")) {
    return { intent: "date-dd-mm-yyyy" };
  }
  if (normalized.includes("time")) {
    return { intent: "time" };
  }
  if (normalized.includes("decimal")) {
    return { intent: "decimal" };
  }
  if (normalized.includes("integer") || normalized.includes("whole number")) {
    return { intent: "integer" };
  }
  if (normalized.includes("alphanumeric") && (normalized.includes("id") || normalized.includes("code"))) {
    return { intent: "alphanumeric-id" };
  }
  if (normalized.includes("url") || normalized.includes("link")) {
    return { intent: "url" };
  }
  if (normalized.includes("whitespace")) {
    return { intent: "whitespace" };
  }
  if (normalized.includes("number") || normalized.includes("numeric")) {
    return { intent: "number" };
  }

  return null;
}

export function explainRegex(suggestion: RegexSuggestion): string {
  return suggestion.explanation;
}

export function generateRegexSuggestion(prompt: string): RegexSuggestion | null {
  const detected = detectPromptIntent(prompt);
  if (!detected) {
    return null;
  }

  switch (detected.intent) {
    case "email":
      return {
        intent: detected.intent,
        pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b",
        flags: "g",
        explanation: "Matches common email address formats such as name@example.com.",
      };
    case "url":
      return {
        intent: detected.intent,
        pattern: "https?:\\/\\/[\\w.-]+(?:\\/[\\w\\-./?%&=+#]*)?",
        flags: "g",
        explanation: "Matches HTTP and HTTPS URLs including optional path and query segments.",
      };
    case "phone-au":
      return {
        intent: detected.intent,
        pattern: "(?:\\+?61\\s?|0)(?:4\\d{8}|[2378]\\d{8})",
        flags: "g",
        explanation: "Matches common Australian mobile and landline number formats.",
      };
    case "phone":
      return {
        intent: detected.intent,
        pattern: "\\+?[0-9][0-9()\\s.-]{7,}[0-9]",
        flags: "g",
        explanation: "Matches common international phone number formats with separators.",
      };
    case "integer":
      return {
        intent: detected.intent,
        pattern: "[+-]?\\d+",
        flags: "g",
        explanation: "Matches signed and unsigned whole numbers.",
      };
    case "decimal":
      return {
        intent: detected.intent,
        pattern: "[+-]?\\d+\\.\\d+",
        flags: "g",
        explanation: "Matches decimal numbers that include a decimal point.",
      };
    case "number":
      return {
        intent: detected.intent,
        pattern: "[+-]?(?:\\d+\\.\\d+|\\d+)",
        flags: "g",
        explanation: "Matches integers and decimals with optional plus or minus signs.",
      };
    case "date-dd-mm-yyyy":
      return {
        intent: detected.intent,
        pattern: "\\b(?:0[1-9]|[12]\\d|3[01])\\/(?:0[1-9]|1[0-2])\\/\\d{4}\\b",
        flags: "g",
        explanation: "Matches dates in DD/MM/YYYY format with basic day and month bounds.",
      };
    case "time":
      return {
        intent: detected.intent,
        pattern: "\\b(?:[01]\\d|2[0-3]):[0-5]\\d(?:[:][0-5]\\d)?\\b",
        flags: "g",
        explanation: "Matches 24-hour times like 09:30 or 21:45:10.",
      };
    case "postcode-au":
      return {
        intent: detected.intent,
        pattern: "\\b\\d{4}\\b",
        flags: "g",
        explanation: "Matches four-digit Australian postcodes.",
      };
    case "zip-us":
      return {
        intent: detected.intent,
        pattern: "\\b\\d{5}(?:-\\d{4})?\\b",
        flags: "g",
        explanation: "Matches US ZIP and ZIP+4 formats.",
      };
    case "hex-color":
      return {
        intent: detected.intent,
        pattern: "#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\\b",
        flags: "g",
        explanation: "Matches 3, 6, or 8 character hexadecimal color values.",
      };
    case "hashtag":
      return {
        intent: detected.intent,
        pattern: "#[A-Za-z0-9_]+",
        flags: "g",
        explanation: "Matches hashtags made of letters, digits, and underscores.",
      };
    case "username":
      return {
        intent: detected.intent,
        pattern: "^[A-Za-z0-9_]{3,30}$",
        flags: "",
        explanation: "Matches usernames 3 to 30 characters long containing letters, digits, and underscores.",
      };
    case "whitespace":
      return {
        intent: detected.intent,
        pattern: "\\s+",
        flags: "g",
        explanation: "Matches one or more whitespace characters including spaces, tabs, and line breaks.",
      };
    case "duplicate-spaces":
      return {
        intent: detected.intent,
        pattern: " {2,}",
        flags: "g",
        explanation: "Matches runs of two or more spaces so repeated spacing can be cleaned.",
      };
    case "line-starts-with": {
      const literal = escapeRegexLiteral(detected.literal ?? "");
      return {
        intent: detected.intent,
        pattern: `^${literal}.*$`,
        flags: "gm",
        explanation: "Matches each line that starts with the specified text.",
      };
    }
    case "line-ends-with": {
      const literal = escapeRegexLiteral(detected.literal ?? "");
      return {
        intent: detected.intent,
        pattern: `^.*${literal}$`,
        flags: "gm",
        explanation: "Matches each line that ends with the specified text.",
      };
    }
    case "fixed-digits":
      return {
        intent: detected.intent,
        pattern: `\\b\\d{${detected.digitCount ?? 6}}\\b`,
        flags: "g",
        explanation: `Matches standalone numbers with exactly ${detected.digitCount ?? 6} digits.`,
      };
    case "alphanumeric-id":
      return {
        intent: detected.intent,
        pattern: "\\b[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\\b",
        flags: "g",
        explanation: "Matches alphanumeric IDs, including IDs separated with hyphens.",
      };
    default:
      return null;
  }
}

export function applySuggestionToTester(suggestion: RegexSuggestion): { pattern: string; flags: string } {
  return { pattern: suggestion.pattern, flags: suggestion.flags };
}
