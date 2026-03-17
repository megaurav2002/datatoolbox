import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import XmlValidatorTool from "@/components/tools/XmlValidatorTool";
import type { ToolDefinition } from "@/lib/types";

const xmlTool: ToolDefinition = {
  slug: "xml-validator",
  title: "XML Validator",
  shortDescription: "Validate XML.",
  tags: ["xml"],
  intro: "Validate XML syntax.",
  howToUse: ["Paste XML", "Validate XML"],
  exampleInput: "<root><item>1</item></root>",
  exampleOutput: "Valid XML.",
  whyUseful: "Catch XML parser issues early.",
  faq: [{ question: "Does it validate XML?", answer: "Yes." }],
  related: ["json-validator"],
  kind: "standard",
  categories: ["developer-tools"],
  createdAt: "2026-03-18",
};

describe("XmlValidatorTool", () => {
  it("prefills a clean valid example when page examples include valid and invalid blocks", () => {
    const withDualExample: ToolDefinition = {
      ...xmlTool,
      exampleInput:
        "Valid XML example:\n<users>\n  <user id=\"1\">\n    <name>Ana</name>\n  </user>\n</users>\n\nInvalid XML example:\n<users>\n  <user id=\"1\">\n    <name>Ana</name>\n</users>",
    };

    render(<XmlValidatorTool tool={withDualExample} />);
    expect(screen.getByPlaceholderText("Paste XML...")).toHaveValue(
      "<users>\n  <user id=\"1\">\n    <name>Ana</name>\n  </user>\n</users>",
    );
  });

  it("validates correct xml input", async () => {
    const user = userEvent.setup();
    render(<XmlValidatorTool tool={xmlTool} />);

    await user.click(screen.getByRole("button", { name: "Validate XML" }));
    expect(screen.getByText("Valid XML. No syntax errors found.")).toBeInTheDocument();
  });

  it("shows highlighted error state for invalid xml", async () => {
    const user = userEvent.setup();
    render(<XmlValidatorTool tool={xmlTool} />);

    await user.clear(screen.getByPlaceholderText("Paste XML..."));
    await user.type(screen.getByPlaceholderText("Paste XML..."), "<root><item></root>");
    await user.click(screen.getByRole("button", { name: "Validate XML" }));

    expect(screen.getByText("XML validation failed")).toBeInTheDocument();
  });

  it("formats xml when format-before-validate is enabled", async () => {
    const user = userEvent.setup();
    render(<XmlValidatorTool tool={xmlTool} />);

    await user.clear(screen.getByPlaceholderText("Paste XML..."));
    await user.type(screen.getByPlaceholderText("Paste XML..."), "<root><item>1</item></root>");
    await user.click(screen.getByRole("checkbox", { name: "Format before validate" }));
    await user.click(screen.getByRole("button", { name: "Validate XML" }));

    expect(screen.getByPlaceholderText("Paste XML...")).toHaveValue("<root>\n  <item>1</item>\n</root>");
  });
});
