import { transformations } from "@/lib/transformations";

describe("transformations", () => {
  it("covers all expected phase 2 transformation slugs", () => {
    expect(Object.keys(transformations).sort()).toEqual([
      "base64-decoder",
      "base64-encoder",
      "csv-cleaner",
      "csv-to-excel",
      "csv-to-json",
      "csv-validator",
      "excel-to-csv",
      "extract-emails",
      "extract-numbers",
      "json-formatter",
      "json-minifier",
      "json-to-csv",
      "json-validator",
      "remove-duplicate-lines",
      "sort-lines-alphabetically",
      "url-decoder",
      "url-encoder",
      "uuid-generator",
    ]);
  });

  describe("csv-to-json", () => {
    it("converts CSV with headers to JSON", () => {
      const result = transformations["csv-to-json"]("name,email\nAna,ana@example.com");
      expect(result.output).toContain('"name": "Ana"');
      expect(result.downloadFileName).toBe("converted.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("supports quoted CSV values", () => {
      const result = transformations["csv-to-json"]('name,note\nAna,"hello, world"');
      expect(result.output).toContain('"note": "hello, world"');
    });

    it("throws for missing data rows", () => {
      expect(() => transformations["csv-to-json"]("name,email")).toThrow(
        "CSV to JSON requires a header row and at least one data row.",
      );
    });
  });

  describe("json-to-csv", () => {
    it("converts JSON array of objects to CSV", () => {
      const result = transformations["json-to-csv"](
        '[{"name":"Ana","email":"ana@example.com"}]',
      );
      expect(result.output).toBe("name,email\nAna,ana@example.com");
      expect(result.downloadFileName).toBe("converted.csv");
    });

    it("throws for non-array input", () => {
      expect(() => transformations["json-to-csv"]('{"name":"Ana"}')).toThrow(
        "JSON to CSV requires a non-empty array of objects.",
      );
    });

    it("throws for invalid JSON", () => {
      expect(() => transformations["json-to-csv"]("{bad json}")).toThrow(
        "JSON to CSV: invalid JSON syntax.",
      );
    });

    it("throws when array items are not objects", () => {
      expect(() => transformations["json-to-csv"]('[{"name":"Ana"}, 1]')).toThrow(
        "JSON to CSV requires every array item to be an object.",
      );
    });
  });

  describe("csv-cleaner", () => {
    it("trims cells and removes empty rows", () => {
      const result = transformations["csv-cleaner"]("name,email\n Ana , ana@example.com \n,\n");
      expect(result.output).toBe("name,email\nAna,ana@example.com");
    });

    it("throws when no usable rows remain", () => {
      expect(() => transformations["csv-cleaner"]("\n\n")).toThrow("Please provide input.");
    });
  });

  describe("csv-validator", () => {
    it("returns valid result for consistent rows", () => {
      const result = transformations["csv-validator"]("name,email\nAna,ana@example.com");
      expect(result.output).toContain("Valid CSV");
    });

    it("reports inconsistent rows", () => {
      const result = transformations["csv-validator"]("name,email\nAna,ana@example.com\nBob");
      expect(result.output).toContain("Row 3: expected 2 columns, found 1.");
    });
  });

  describe("csv-to-excel", () => {
    it("returns excel-compatible html output", () => {
      const result = transformations["csv-to-excel"]("name,sales\nAna,120");
      expect(result.output).toContain("<table>");
      expect(result.downloadFileName).toBe("converted.xls");
      expect(result.downloadMimeType).toBe("application/vnd.ms-excel");
    });

    it("escapes html in cells", () => {
      const result = transformations["csv-to-excel"]("name\n<script>alert(1)</script>");
      expect(result.output).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    });
  });

  describe("excel-to-csv", () => {
    it("converts tab-separated input to csv", () => {
      const result = transformations["excel-to-csv"]("name\temail\nAna\tana@example.com");
      expect(result.output).toBe("name,email\nAna,ana@example.com");
    });

    it("keeps csv input compatible", () => {
      const result = transformations["excel-to-csv"]("name,email\nAna,ana@example.com");
      expect(result.output).toBe("name,email\nAna,ana@example.com");
    });

    it("throws on empty content", () => {
      expect(() => transformations["excel-to-csv"]("\n \n")).toThrow("Please provide input.");
    });
  });

  describe("json tools", () => {
    it("formats json", () => {
      const result = transformations["json-formatter"]('{"name":"Ana"}');
      expect(result.output).toBe('{\n  "name": "Ana"\n}');
    });

    it("validates json", () => {
      const result = transformations["json-validator"]('{"name":"Ana"}');
      expect(result.output).toBe("Valid JSON.");
    });

    it("minifies json", () => {
      const result = transformations["json-minifier"]('{\n  "name": "Ana"\n}');
      expect(result.output).toBe('{"name":"Ana"}');
      expect(result.downloadFileName).toBe("minified.json");
    });

    it("throws on invalid JSON for formatter", () => {
      expect(() => transformations["json-formatter"]("{bad json}")).toThrow(
        "JSON Formatter: invalid JSON syntax.",
      );
    });

    it("throws on invalid JSON for validator", () => {
      expect(() => transformations["json-validator"]("{bad json}")).toThrow(
        "JSON Validator: invalid JSON syntax at line 1, column 2.",
      );
    });

    it("throws on invalid JSON for minifier", () => {
      expect(() => transformations["json-minifier"]("{bad json}")).toThrow(
        "JSON Minifier: invalid JSON syntax.",
      );
    });
  });

  describe("text tools", () => {
    it("removes duplicate lines while preserving first seen order", () => {
      const result = transformations["remove-duplicate-lines"]("apple\nbanana\napple\nbanana\npear");
      expect(result.output).toBe("apple\nbanana\npear");
    });

    it("sorts lines alphabetically case-insensitively", () => {
      const result = transformations["sort-lines-alphabetically"]("zebra\napple\nBanana");
      expect(result.output).toBe("apple\nBanana\nzebra");
    });

    it("extracts unique emails", () => {
      const result = transformations["extract-emails"](
        "a@b.com b@c.io a@b.com not-an-email",
      );
      expect(result.output).toBe("a@b.com\nb@c.io");
    });

    it("returns no email message", () => {
      const result = transformations["extract-emails"]("no email here");
      expect(result.output).toBe("No emails found.");
    });

    it("extracts numbers including signed and decimal", () => {
      const result = transformations["extract-numbers"]("temp -3.5 and +10 and 7");
      expect(result.output).toBe("-3.5\n+10\n7");
    });

    it("returns no number message", () => {
      const result = transformations["extract-numbers"]("no digits");
      expect(result.output).toBe("No numbers found.");
    });
  });

  describe("developer tools", () => {
    it("encodes text to base64", () => {
      const result = transformations["base64-encoder"]("hello world");
      expect(result.output).toBe("aGVsbG8gd29ybGQ=");
    });

    it("decodes valid base64 text", () => {
      const result = transformations["base64-decoder"]("aGVsbG8gd29ybGQ=");
      expect(result.output).toBe("hello world");
    });

    it("throws for invalid base64 text", () => {
      expect(() => transformations["base64-decoder"]("not_base64")).toThrow(
        "Base64 Decoder requires valid Base64 input.",
      );
    });

    it("encodes URL components", () => {
      const result = transformations["url-encoder"]("name=John Doe&city=NY");
      expect(result.output).toBe("name%3DJohn%20Doe%26city%3DNY");
    });

    it("decodes URL components", () => {
      const result = transformations["url-decoder"]("name%3DJohn%20Doe%26city%3DNY");
      expect(result.output).toBe("name=John Doe&city=NY");
    });

    it("throws for malformed url-encoded input", () => {
      expect(() => transformations["url-decoder"]("%E0%A4%A")).toThrow(
        "URL Decoder requires valid URL-encoded input.",
      );
    });

    it("generates one uuid by default", () => {
      const result = transformations["uuid-generator"]("");
      expect(result.output).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("generates multiple uuids when count is provided", () => {
      const result = transformations["uuid-generator"]("3");
      const lines = result.output.split("\n");
      expect(lines).toHaveLength(3);
      lines.forEach((line) => {
        expect(line).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
      });
    });

    it("throws for invalid uuid count", () => {
      expect(() => transformations["uuid-generator"]("0")).toThrow(
        "UUID Generator expects a whole number between 1 and 100.",
      );
      expect(() => transformations["uuid-generator"]("1.5")).toThrow(
        "UUID Generator expects a whole number between 1 and 100.",
      );
    });
  });

  describe("shared invalid input handling", () => {
    it("throws for empty input across all transformation functions", () => {
      Object.entries(transformations).forEach(([slug, transform]) => {
        if (slug === "uuid-generator") {
          return;
        }
        expect(() => transform("  \n  ")).toThrow("Please provide input.");
        expect(typeof slug).toBe("string");
      });
    });

    it("throws for malformed quoted CSV where applicable", () => {
      expect(() => transformations["csv-to-json"]('name,email\n"Ana,ana@example.com')).toThrow(
        "CSV appears malformed: unmatched quote detected.",
      );
      expect(() => transformations["csv-validator"]('name,email\n"Ana,ana@example.com')).toThrow(
        "CSV appears malformed: unmatched quote detected.",
      );
    });
  });
});
