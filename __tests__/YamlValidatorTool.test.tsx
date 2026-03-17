import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import YamlValidatorTool from "@/components/tools/YamlValidatorTool";
import type { ToolDefinition } from "@/lib/types";

const yamlTool: ToolDefinition = {
  slug: "yaml-validator",
  title: "YAML Validator",
  shortDescription: "Validate YAML.",
  tags: ["yaml"],
  intro: "Validate YAML syntax.",
  howToUse: ["Paste", "Validate"],
  exampleInput: "version: 1\nservice:\n  name: api",
  exampleOutput: "Valid YAML.",
  whyUseful: "Catch YAML mistakes early.",
  faq: [{ question: "Does it validate?", answer: "Yes." }],
  related: ["yaml-formatter"],
  kind: "standard",
  categories: ["developer-tools"],
  createdAt: "2026-03-17",
};

describe("YamlValidatorTool", () => {
  it("validates correct yaml", async () => {
    const user = userEvent.setup();
    render(<YamlValidatorTool tool={yamlTool} />);

    await user.click(screen.getByRole("button", { name: "Validate YAML" }));
    expect(screen.getByText("Valid YAML. No syntax or indentation issues found.")).toBeInTheDocument();
  });

  it("shows a validation error for invalid yaml", async () => {
    const user = userEvent.setup();
    render(<YamlValidatorTool tool={yamlTool} />);

    await user.clear(screen.getByPlaceholderText("Paste YAML..."));
    await user.type(screen.getByPlaceholderText("Paste YAML..."), "services:\n  - name: api\n   image: bad-indent");
    await user.click(screen.getByRole("button", { name: "Validate YAML" }));

    expect(screen.getByText(/YAML validation failed:/)).toBeInTheDocument();
  });
});

