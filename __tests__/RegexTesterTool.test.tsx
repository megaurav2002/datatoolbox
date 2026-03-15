import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegexTesterTool from "@/components/tools/RegexTesterTool";

describe("RegexTesterTool", () => {
  it("generates a suggestion and applies it to tester", async () => {
    const user = userEvent.setup();
    render(<RegexTesterTool />);

    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Extract 6 digit order numbers");
    await user.click(screen.getByRole("button", { name: "Generate Regex" }));

    expect(screen.getByText("Suggested pattern")).toBeInTheDocument();
    expect(screen.getByText(/\\d\{6\}/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Use in Tester" }));
    expect(screen.getByDisplayValue("\\b\\d{6}\\b")).toBeInTheDocument();
    expect(screen.getByDisplayValue("g")).toBeInTheDocument();
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

    expect(screen.getByText("Invalid regex pattern or flags. Check escaping and try again.")).toBeInTheDocument();
  });
});
