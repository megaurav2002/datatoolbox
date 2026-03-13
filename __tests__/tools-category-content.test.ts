import { toolsCategoryCanonical, toolsCategoryContent } from "@/lib/tool-category-content";
import { toolsBySlug } from "@/lib/tools";

describe("tools category SEO content", () => {
  const categoryEntries = Object.entries(toolsCategoryContent);

  it("defines the four primary /tools category pages", () => {
    expect(categoryEntries.map(([slug]) => slug).sort()).toEqual([
      "csv-tools",
      "data-cleaning-tools",
      "developer-data-tools",
      "json-tools",
    ]);
  });

  it("keeps canonical paths under /tools", () => {
    categoryEntries.forEach(([slug]) => {
      expect(toolsCategoryCanonical(slug as keyof typeof toolsCategoryContent)).toBe(`/tools/${slug}`);
    });
  });

  it("has unique metadata and substantial intro content", () => {
    const metaTitles = new Set<string>();
    const metaDescriptions = new Set<string>();

    categoryEntries.forEach(([, content]) => {
      metaTitles.add(content.metaTitle);
      metaDescriptions.add(content.metaDescription);

      const introWordCount = content.intro.trim().split(/\s+/).length;
      expect(introWordCount).toBeGreaterThanOrEqual(150);
      expect(introWordCount).toBeLessThanOrEqual(250);
      expect(content.faq.length).toBeGreaterThanOrEqual(3);
      expect(content.faq.length).toBeLessThanOrEqual(5);
    });

    expect(metaTitles.size).toBe(categoryEntries.length);
    expect(metaDescriptions.size).toBe(categoryEntries.length);
  });

  it("references valid tool slugs for every category", () => {
    categoryEntries.forEach(([, content]) => {
      content.toolSlugs.forEach((slug) => {
        expect(toolsBySlug[slug]).toBeDefined();
      });
    });
  });
});
