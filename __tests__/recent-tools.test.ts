import { recentTools } from "@/lib/tools";

describe("recentTools", () => {
  it("returns tools sorted by createdAt descending", () => {
    const items = recentTools(8);
    for (let i = 1; i < items.length; i += 1) {
      const prev = new Date(items[i - 1].createdAt).getTime();
      const next = new Date(items[i].createdAt).getTime();
      expect(prev).toBeGreaterThanOrEqual(next);
    }
  });

  it("respects the requested limit", () => {
    const items = recentTools(8);
    expect(items.length).toBeLessThanOrEqual(8);
  });
});
