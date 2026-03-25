import { generateToolFAQs } from "@/lib/generateToolFAQs";
import { tools } from "@/lib/tools";

describe("tool FAQ quality", () => {
  it("returns between 5 and 8 FAQs for most tools, allowing 10 for JSON to CSV", () => {
    tools.forEach((tool) => {
      const faqs = generateToolFAQs(tool);
      expect(faqs.length).toBeGreaterThanOrEqual(5);
      const maxFaqs = tool.slug === "json-to-csv" ? 10 : 8;
      expect(faqs.length).toBeLessThanOrEqual(maxFaqs);
    });
  });

  it("avoids generic boilerplate phrasing", () => {
    const bannedPhrases = [
      "helps you quickly process and transform your data directly in the browser",
      "the tool accepts standard text input for the relevant format",
      "useful for cleaning raw input before importing into downstream tools",
    ];

    tools.forEach((tool) => {
      const serialized = JSON.stringify(generateToolFAQs(tool)).toLowerCase();
      bannedPhrases.forEach((phrase) => {
        expect(serialized).not.toContain(phrase);
      });
    });
  });
});
