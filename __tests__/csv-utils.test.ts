import { parseCsv, parseSpreadsheetLikeInput, rowsToHtmlTable, toCsv } from "@/lib/transformations/csv";

describe("csv utilities", () => {
  it("parses escaped double quotes in CSV values", () => {
    const rows = parseCsv('name,note\nAna,"he said ""hello"""');
    expect(rows[1][1]).toBe('he said "hello"');
  });

  it("handles CRLF newlines", () => {
    const rows = parseCsv("name,email\r\nAna,ana@example.com\r\nBob,bob@example.com");
    expect(rows).toHaveLength(3);
    expect(rows[2][0]).toBe("Bob");
  });

  it("returns empty rows array for spreadsheet parser with only blank lines", () => {
    expect(parseSpreadsheetLikeInput(" \n\t \n")).toEqual([]);
  });

  it("returns empty table markup when no rows are provided", () => {
    expect(rowsToHtmlTable([])).toBe("<table></table>");
  });

  it("skips insignificant empty rows in newline parsing", () => {
    expect(parseCsv("\n")).toEqual([]);
  });

  it("skips insignificant empty row at EOF", () => {
    expect(parseCsv('""')).toEqual([]);
  });

  it("serializes CSV with and without quoted cells", () => {
    const csv = toCsv([
      ["name", "note"],
      ["Ana", "simple"],
      ["Bob", "hello, world"],
    ]);

    expect(csv).toContain("Ana,simple");
    expect(csv).toContain('Bob,"hello, world"');
  });
});
