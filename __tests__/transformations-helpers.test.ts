import {
  parseJsonInput,
  toJsonSyntaxErrorMessage,
  toTransformResult,
  withTransformErrorBoundary,
} from "@/lib/transformations/helpers";

describe("transformation helpers", () => {
  it("returns fallback JSON error message when position is missing", () => {
    const message = toJsonSyntaxErrorMessage(
      "{bad}",
      "JSON Validator",
      new SyntaxError("Unexpected token b"),
    );

    expect(message).toBe("JSON Validator: invalid JSON syntax.");
  });

  it("returns fallback JSON error message when position is out of bounds", () => {
    const message = toJsonSyntaxErrorMessage(
      "{}",
      "JSON Validator",
      new SyntaxError("Unexpected token at position 100"),
    );

    expect(message).toBe("JSON Validator: invalid JSON syntax.");
  });

  it("rethrows non-SyntaxError from parseJsonInput", () => {
    const originalParse = JSON.parse;
    JSON.parse = () => {
      throw new TypeError("parser unavailable");
    };

    try {
      expect(() => parseJsonInput("{}", "JSON Formatter")).toThrow("parser unavailable");
    } finally {
      JSON.parse = originalParse;
    }
  });

  it("wraps non-Error thrown values in error boundary", () => {
    const wrapped = withTransformErrorBoundary(() => {
      throw "bad";
    });

    expect(() => wrapped("input")).toThrow("Transformation failed unexpectedly.");
  });

  it("passes through results for successful wrapped transforms", () => {
    const wrapped = withTransformErrorBoundary((value) => toTransformResult(`ok:${value}`));

    expect(wrapped("x").output).toBe("ok:x");
  });
});
