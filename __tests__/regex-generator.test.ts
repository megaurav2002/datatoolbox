import {
  applySuggestionToTester,
  detectPromptIntent,
  generateRegexSuggestion,
  normalizePrompt,
} from "@/lib/regex-generator";

describe("regex generator heuristics", () => {
  it("normalizes prompt text", () => {
    expect(normalizePrompt("  Match   Email Addresses ")).toBe("match email addresses");
  });

  it("detects email intent and returns usable regex", () => {
    const suggestion = generateRegexSuggestion("Match email addresses");
    expect(suggestion?.intent).toBe("email");
    expect(suggestion?.flags).toBe("g");
    expect(suggestion?.pattern).toContain("@");
  });

  it("detects fixed digit count requests", () => {
    const detected = detectPromptIntent("Extract 6 digit order numbers");
    expect(detected).toEqual({ intent: "fixed-digits", digitCount: 6 });
    expect(generateRegexSuggestion("Extract 6 digit order numbers")?.pattern).toBe("\\b\\d{6}\\b");
  });

  it("detects line starts with and escapes literal text", () => {
    const suggestion = generateRegexSuggestion("Lines starting with api/v1.");
    expect(suggestion?.intent).toBe("line-starts-with");
    expect(suggestion?.flags).toBe("gm");
    expect(suggestion?.pattern).toBe("^api/v1\\..*$");
  });

  it("preserves literal case for line boundary prompts", () => {
    const suggestion = generateRegexSuggestion("Lines starting with ErrorCode");
    expect(suggestion?.pattern).toBe("^ErrorCode.*$");
  });

  it("detects duplicate spaces and australian phone intents", () => {
    expect(generateRegexSuggestion("Find repeated spaces")?.intent).toBe("duplicate-spaces");
    expect(generateRegexSuggestion("Match Australian phone numbers")?.intent).toBe("phone-au");
  });

  it("returns null for unknown prompts", () => {
    expect(generateRegexSuggestion("Find semantic versioning where prerelease is beta and build is date")).toBeNull();
  });

  it("maps suggestion back into tester inputs", () => {
    const suggestion = generateRegexSuggestion("Match hex color codes");
    if (!suggestion) {
      throw new Error("Expected regex suggestion for hex color prompt.");
    }
    const applied = applySuggestionToTester(suggestion);
    expect(applied).toEqual({ pattern: suggestion.pattern, flags: suggestion.flags });
  });
});
