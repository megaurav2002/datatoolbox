import { cleanCsv } from "@/lib/transformations/csv-cleaner";

describe("csv-cleaner utility", () => {
  it("applies normalization and deduplication options", () => {
    const result = cleanCsv(
      " Full Name , Email , Phone \n Ana Doe , ANA@Example.com , +61 (412) 555-009 \n Ana Doe , ANA@Example.com , +61 (412) 555-009 \n , , ",
      {
        trimWhitespace: true,
        removeEmptyRows: true,
        removeEmptyColumns: true,
        deduplicateRows: true,
        normalizeHeaders: true,
        lowercaseEmails: true,
        normalizePhoneNumbers: true,
        standardizeLineEndings: true,
      },
    );

    expect(result.cleanedCsv).toBe("full_name,email,phone\nAna Doe,ana@example.com,+61412555009");
    expect(result.originalRowCount).toBe(3);
    expect(result.cleanedRowCount).toBe(1);
    expect(result.removedRowCount).toBe(2);
  });

  it("removes empty columns when enabled", () => {
    const result = cleanCsv("name,,email\nAna,,ana@example.com", {
      removeEmptyColumns: true,
    });

    expect(result.cleanedCsv).toBe("name,email\nAna,ana@example.com");
  });

  it("preserves duplicate rows when deduplication is disabled", () => {
    const result = cleanCsv("name,email\nAna,ana@example.com\nAna,ana@example.com", {
      deduplicateRows: false,
    });

    expect(result.cleanedRowCount).toBe(2);
  });

  it("throws on empty input", () => {
    expect(() => cleanCsv("\n\n")).toThrow("Please provide input.");
  });
});
