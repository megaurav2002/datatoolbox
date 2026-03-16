import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JsonDiffCheckerTool from "@/components/tools/JsonDiffCheckerTool";
import type { ToolDefinition } from "@/lib/types";

const tool: ToolDefinition = {
  slug: "json-diff-checker",
  title: "JSON Diff Checker",
  shortDescription: "Compare JSON.",
  tags: ["json"],
  intro: "Compare two JSON documents.",
  howToUse: ["Paste left", "Paste right", "Compare"],
  exampleInput: '{"a":1}\n\n{"a":2}',
  exampleOutput: "Changed:\n- a: 1 -> 2",
  whyUseful: "Find payload differences quickly.",
  faq: [{ question: "Is this free?", answer: "Yes." }],
  related: ["json-validator"],
  kind: "standard",
  categories: ["json-tools"],
  createdAt: "2026-03-16",
};

describe("JsonDiffCheckerTool", () => {
  it("compares side-by-side JSON and shows grouped results", async () => {
    const user = userEvent.setup();
    render(<JsonDiffCheckerTool tool={tool} />);

    await user.click(screen.getByRole("button", { name: "Compare JSON" }));
    expect(screen.getByText("Diff Results")).toBeInTheDocument();
    expect(screen.getByText("Added")).toBeInTheDocument();
    expect(screen.getByText("Removed")).toBeInTheDocument();
    expect(screen.getByText("Changed")).toBeInTheDocument();
    expect(screen.getByText(/profile\.city/)).toBeInTheDocument();
  });

  it("shows a clear invalid-json error state", async () => {
    const user = userEvent.setup();
    render(<JsonDiffCheckerTool tool={tool} />);

    await user.clear(screen.getByLabelText("Right JSON"));
    await user.paste("{invalid");
    await user.click(screen.getByRole("button", { name: "Compare JSON" }));

    expect(screen.getByText("Right JSON is invalid. Fix syntax and try again.")).toBeInTheDocument();
  });
});
