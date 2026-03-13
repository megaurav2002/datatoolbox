import { generateToolFAQs } from "@/lib/generateToolFAQs";
import { tools } from "@/lib/tools";

describe("tool FAQ quality", () => {
  it("returns between 5 and 8 FAQs for every tool", () => {
    tools.forEach((tool) => {
      const faqs = generateToolFAQs(tool);
      expect(faqs.length).toBeGreaterThanOrEqual(5);
      expect(faqs.length).toBeLessThanOrEqual(8);
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
