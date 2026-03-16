import { compareJsonDocuments } from "@/lib/json-diff";

describe("compareJsonDocuments", () => {
  it("reports added, removed, and changed nested paths", () => {
    const before = {
      name: "Alice",
      age: 30,
      tags: ["admin", "editor"],
      profile: { city: "Melbourne" },
    };
    const after = {
      name: "Alice",
      age: 31,
      tags: ["admin", "owner"],
      profile: { city: "Sydney" },
      active: true,
    };

    const result = compareJsonDocuments(before, after, { ignoreKeyOrder: true });
    expect(result.added.map((entry) => entry.path)).toContain("active");
    expect(result.changed.map((entry) => entry.path)).toEqual(
      expect.arrayContaining(["age", "tags[1]", "profile.city"]),
    );
    expect(result.removed).toHaveLength(0);
  });

  it("can flag object key-order-only differences when not ignored", () => {
    const before = { a: 1, b: 2 };
    const after = { b: 2, a: 1 };

    const strict = compareJsonDocuments(before, after, { ignoreKeyOrder: false });
    expect(strict.changed.map((entry) => entry.path)).toContain("");

    const ignored = compareJsonDocuments(before, after, { ignoreKeyOrder: true });
    expect(ignored.changed.map((entry) => entry.path)).not.toContain("");
  });
});

