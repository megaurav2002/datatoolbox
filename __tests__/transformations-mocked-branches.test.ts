describe("transformations defensive branches", () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it("handles csv-validator empty parse result", async () => {
    jest.doMock("@/lib/transformations/csv", () => {
      const actual = jest.requireActual("@/lib/transformations/csv");
      return {
        ...actual,
        parseCsv: jest.fn(() => []),
      };
    });

    const { transformations } = await import("@/lib/transformations");
    expect(() => transformations["csv-validator"]("value")).toThrow(
      "CSV Validator found no rows to validate.",
    );
  });

  it("handles csv-to-excel empty parse result", async () => {
    jest.doMock("@/lib/transformations/csv", () => {
      const actual = jest.requireActual("@/lib/transformations/csv");
      return {
        ...actual,
        parseCsv: jest.fn(() => []),
      };
    });

    const { transformations } = await import("@/lib/transformations");
    expect(() => transformations["csv-to-excel"]("value")).toThrow(
      "CSV to Excel requires at least one row.",
    );
  });

  it("handles excel-to-csv empty spreadsheet parse result", async () => {
    jest.doMock("@/lib/transformations/csv", () => {
      const actual = jest.requireActual("@/lib/transformations/csv");
      return {
        ...actual,
        parseSpreadsheetLikeInput: jest.fn(() => []),
      };
    });

    const { transformations } = await import("@/lib/transformations");
    expect(() => transformations["excel-to-csv"]("value")).toThrow(
      "Excel to CSV found no spreadsheet data.",
    );
  });
});
