import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UrlParserTool from "@/components/tools/UrlParserTool";
import type { ToolDefinition } from "@/lib/types";

const urlTool: ToolDefinition = {
  slug: "url-parser",
  title: "URL Parser",
  shortDescription: "Parse URLs.",
  tags: ["url"],
  intro: "Parse URL components.",
  howToUse: ["Paste URL", "Parse"],
  exampleInput: "https://example.com/path?x=1#top",
  exampleOutput: '{"protocol":"https:"}',
  whyUseful: "Debug URL structures quickly.",
  faq: [{ question: "Does it parse query params?", answer: "Yes." }],
  related: ["url-encoder"],
  kind: "standard",
  categories: ["developer-tools"],
  createdAt: "2026-03-17",
};

describe("UrlParserTool", () => {
  it("parses URL components and query rows", async () => {
    const user = userEvent.setup();
    render(<UrlParserTool tool={urlTool} />);

    await user.click(screen.getByRole("button", { name: "Parse URL" }));
    expect(screen.getByText("Parsed components")).toBeInTheDocument();
    expect(screen.getByText("Query parameters")).toBeInTheDocument();
    expect(screen.getByText("expand")).toBeInTheDocument();
    expect(screen.getByText("items")).toBeInTheDocument();
  });

  it("shows clear error for invalid URLs", async () => {
    const user = userEvent.setup();
    render(<UrlParserTool tool={urlTool} />);

    await user.clear(screen.getByPlaceholderText("https://example.com/path?x=1#top"));
    await user.type(screen.getByPlaceholderText("https://example.com/path?x=1#top"), "/relative/path");
    await user.click(screen.getByRole("button", { name: "Parse URL" }));

    expect(
      screen.getByText("URL Parser requires a valid absolute URL including protocol (for example https://...)."),
    ).toBeInTheDocument();
  });
});

