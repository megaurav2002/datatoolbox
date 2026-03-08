import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToolOutput from "@/components/ToolOutput";

describe("ToolOutput", () => {
  it("renders error message when provided", () => {
    render(<ToolOutput value="" error="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows helper message when copy is clicked with empty output", async () => {
    const user = userEvent.setup();
    render(<ToolOutput value="" />);

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(screen.getByText("Nothing to copy yet.")).toBeInTheDocument();
  });
});
