import { tools, toolsBySlug } from "@/lib/tools";
import { transformations } from "@/lib/transformations";

describe("tools registry integrity", () => {
  it("has unique slugs", () => {
    const slugs = tools.map((tool) => tool.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has transformations for every standard tool", () => {
    tools.forEach((tool) => {
      if (tool.kind === "standard") {
        expect(typeof transformations[tool.slug]).toBe("function");
      }
    });
  });

  it("has valid related links for every tool", () => {
    tools.forEach((tool) => {
      tool.related.forEach((relatedSlug) => {
        expect(toolsBySlug[relatedSlug]).toBeDefined();
      });
    });
  });
});
