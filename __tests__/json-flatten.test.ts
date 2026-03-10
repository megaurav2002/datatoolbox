import { flattenJson } from "@/lib/transformations/json-flatten";

describe("json-flatten utilities", () => {
  it("flattens nested object keys using dot notation", () => {
    const result = flattenJson('{"user":{"name":"Ana","address":{"city":"Melbourne"}}}');

    expect(result.headers).toEqual(["user.name", "user.address.city"]);
    expect(result.rows[0]).toEqual({
      "user.name": "Ana",
      "user.address.city": "Melbourne",
    });
  });

  it("converts arrays to json strings", () => {
    const result = flattenJson('{"roles":["admin","editor"]}');

    expect(result.rows[0]["roles"]).toBe('["admin","editor"]');
    expect(result.csv).toContain('"[""admin"",""editor""]"');
  });

  it("supports array of objects", () => {
    const result = flattenJson('[{"id":1},{"id":2,"name":"Bob"}]');

    expect(result.headers).toEqual(["id", "name"]);
    expect(result.csv).toContain("1,");
    expect(result.csv).toContain("2,Bob");
  });

  it("throws for non-object array items", () => {
    expect(() => flattenJson('[{"id":1},2]')).toThrow(
      "JSON Flatten expects object items. Item 2 is not an object.",
    );
  });

  it("throws for invalid root type", () => {
    expect(() => flattenJson('"text"')).toThrow(
      "JSON Flatten requires a JSON object or array of objects.",
    );
  });
});
