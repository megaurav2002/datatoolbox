import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegexTesterTool from "@/components/tools/RegexTesterTool";

describe("RegexTesterTool", () => {
  it("renders regex-specific helper sections", () => {
    render(<RegexTesterTool />);

    expect(screen.getByText("Common Regex Patterns")).toBeInTheDocument();
    expect(screen.getByText("When to use flags")).toBeInTheDocument();
    expect(screen.queryByText("Regex learning guides")).not.toBeInTheDocument();
    expect(screen.getByText("Example prompts")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tip: Generated regex patterns are starting points. You can refine and test them using the regex tester below.",
      ),
    ).toBeInTheDocument();
  });

  it("generates a suggestion and applies it to tester", async () => {
    const user = userEvent.setup();
    render(<RegexTesterTool />);

    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Extract 6 digit order numbers");
    await user.click(screen.getByRole("button", { name: "Generate Regex" }));

    expect(screen.getByText("Suggested pattern")).toBeInTheDocument();
    expect(screen.getAllByText(/\\d\{6\}/).length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByRole("button", { name: "Use in Tester" }));
    expect(screen.getByDisplayValue("\\b\\d{6}\\b")).toBeInTheDocument();
    expect(screen.getByDisplayValue("g")).toBeInTheDocument();
  });

  it("applies quick presets to tester fields", async () => {
    const user = userEvent.setup();
    render(<RegexTesterTool />);

    await user.click(screen.getByRole("button", { name: "Apply UUID preset" }));
    expect(
      screen.getByDisplayValue(
        "\\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\b",
      ),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("gi")).toBeInTheDocument();
  });

  it("runs regex tests and reports match count", async () => {
    const user = userEvent.setup();
    render(<RegexTesterTool />);

    await user.click(screen.getByRole("button", { name: "Test Regex" }));
    expect(
      screen.getByText((_, element) => element?.textContent === "Match count: 2"),
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Pattern"));
    await user.type(screen.getByLabelText("Pattern"), "(");
    await user.click(screen.getByRole("button", { name: "Test Regex" }));

    expect(
      screen.getByText(
        "Invalid regex pattern or flags. Check escapes (for example \\d or \\.) and valid flags (g, i, m, s, u, y).",
      ),
    ).toBeInTheDocument();
  });
});
