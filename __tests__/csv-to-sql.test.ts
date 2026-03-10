import {
  analyzeCsvForSql,
  generateSqlFromCsvRows,
  type CsvToSqlOptions,
} from "@/lib/transformations/csv-to-sql";

describe("csv-to-sql utilities", () => {
  it("infers column types from csv values", () => {
    const result = analyzeCsvForSql(
      "id,amount,active,created_at,note\n1,10.5,true,2026-03-01,hello",
    );

    expect(result.columns.map((column) => column.type)).toEqual([
      "INTEGER",
      "DECIMAL",
      "BOOLEAN",
      "DATE",
      "TEXT",
    ]);
  });

  it("normalizes duplicate/empty headers", () => {
    const result = analyzeCsvForSql(",Name,Name\n1,Ana,A",
    );

    expect(result.columns.map((column) => column.name)).toEqual([
      "column_1",
      "name",
      "name_2",
    ]);
  });

  it("generates mysql insert-only statements", () => {
    const analysis = analyzeCsvForSql("id,name\n1,O'Hara");
    const options: CsvToSqlOptions = {
      tableName: "Users",
      dialect: "mysql",
      mode: "insert-only",
      columns: analysis.columns,
    };

    const sql = generateSqlFromCsvRows(analysis.rows, options);
    expect(sql).not.toContain("CREATE TABLE");
    expect(sql).toContain("INSERT INTO `users`");
    expect(sql).toContain("'O''Hara'");
  });

  it("throws for insert-only mode without rows", () => {
    const analysis = analyzeCsvForSql("id,name\n1,Ana");

    expect(() =>
      generateSqlFromCsvRows([], {
        tableName: "users",
        dialect: "generic",
        mode: "insert-only",
        columns: analysis.columns,
      }),
    ).toThrow("INSERT-only mode requires at least one CSV data row.");
  });

  it("throws for empty table name", () => {
    const analysis = analyzeCsvForSql("id,name\n1,Ana");

    expect(() =>
      generateSqlFromCsvRows(analysis.rows, {
        tableName: " ",
        dialect: "generic",
        mode: "create-and-insert",
        columns: analysis.columns,
      }),
    ).toThrow("Please provide a table name.");
  });

  it("does not coerce unknown boolean text to false", () => {
    const analysis = analyzeCsvForSql("flag\nmaybe");
    const sql = generateSqlFromCsvRows(analysis.rows, {
      tableName: "flags",
      dialect: "generic",
      mode: "insert-only",
      columns: [{ ...analysis.columns[0], type: "BOOLEAN" }],
    });

    expect(sql).toContain("('maybe')");
  });
});
