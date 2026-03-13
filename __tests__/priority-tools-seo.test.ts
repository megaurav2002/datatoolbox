import { toolsBySlug } from "@/lib/tools";

const prioritySlugs = [
  "json-validator",
  "json-formatter",
  "json-minifier",
  "csv-to-json",
  "json-to-csv",
  "base64-encoder",
  "base64-decoder",
  "uuid-generator",
  "url-encoder",
  "url-decoder",
  "regex-tester",
  "timestamp-converter",
  "jwt-decoder",
  "hash-generator",
  "sql-formatter",
] as const;

describe("priority tool SEO content coverage", () => {
  it("ensures enriched sections exist for each priority tool", () => {
    prioritySlugs.forEach((slug) => {
      const tool = toolsBySlug[slug];
      expect(tool).toBeDefined();
      expect(tool.intro.trim().split(/\s+/).length).toBeGreaterThanOrEqual(12);
      expect(tool.howToUse.length).toBeGreaterThanOrEqual(3);
      expect(tool.faq.length).toBeGreaterThanOrEqual(3);
      expect(tool.related.length).toBeGreaterThanOrEqual(3);
      expect(tool.related.length).toBeLessThanOrEqual(5);
      expect(tool.commonMistakes?.length ?? 0).toBeGreaterThanOrEqual(3);
    });
  });
});
