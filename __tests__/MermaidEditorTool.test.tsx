import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MermaidEditorTool from "@/components/tools/MermaidEditorTool";
import type { ToolDefinition } from "@/lib/types";

const mermaidInitializeMock = jest.fn();
const mermaidRenderMock = jest.fn();
const clipboardWriteTextMock = jest.fn();

jest.mock("mermaid", () => ({
  __esModule: true,
  default: {
    initialize: mermaidInitializeMock,
    render: mermaidRenderMock,
  },
}));

const mermaidTool: ToolDefinition = {
  slug: "mermaid-editor",
  title: "Mermaid Editor",
  shortDescription: "Write Mermaid syntax and render diagrams.",
  tags: ["mermaid"],
  intro: "Create diagrams from Mermaid text.",
  howToUse: ["Paste", "Render", "Download"],
  exampleInput: "flowchart TD\nA-->B",
  exampleOutput: "<svg></svg>",
  whyUseful: "Useful for docs.",
  faq: [{ question: "Is data uploaded?", answer: "No." }],
  related: ["json-formatter"],
  kind: "standard",
  categories: ["developer-tools"],
  createdAt: "2026-03-25",
};

describe("MermaidEditorTool", () => {
  beforeEach(() => {
    mermaidInitializeMock.mockReset();
    mermaidRenderMock.mockReset();
    clipboardWriteTextMock.mockReset();
    clipboardWriteTextMock.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: clipboardWriteTextMock },
      configurable: true,
    });
  });

  it("shows validation error for empty mermaid input", async () => {
    const user = userEvent.setup();
    render(<MermaidEditorTool tool={mermaidTool} />);

    await user.clear(screen.getByPlaceholderText("Paste Mermaid syntax, e.g. graph TD; A-->B;"));
    await user.click(screen.getByRole("button", { name: "Render Diagram" }));

    expect(screen.getByText("Please provide Mermaid syntax.")).toBeInTheDocument();
    expect(mermaidRenderMock).not.toHaveBeenCalled();
  });

  it("renders mermaid output and previews svg", async () => {
    const user = userEvent.setup();
    mermaidRenderMock.mockResolvedValue({ svg: "<svg><text>diagram</text></svg>" });

    render(<MermaidEditorTool tool={mermaidTool} />);

    await user.click(screen.getByRole("button", { name: "Render Diagram" }));

    await waitFor(() => {
      expect(mermaidInitializeMock).toHaveBeenCalled();
      expect(mermaidRenderMock).toHaveBeenCalledWith(expect.stringContaining("mermaid-"), mermaidTool.exampleInput);
    });

    expect(screen.getByText("diagram")).toBeInTheDocument();
    expect(screen.getByDisplayValue("<svg><text>diagram</text></svg>")).toBeInTheDocument();
  });

  it("copies rendered svg via quick action", async () => {
    const user = userEvent.setup();
    mermaidRenderMock.mockResolvedValue({ svg: "<svg><text>copy-me</text></svg>" });

    render(<MermaidEditorTool tool={mermaidTool} />);

    await user.click(screen.getByRole("button", { name: "Render Diagram" }));

    await waitFor(() => {
      expect(screen.getByText("copy-me")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Copy SVG" }));

    expect(await screen.findByText("SVG copied.")).toBeInTheDocument();
  });
});
