import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HashGeneratorTool from "@/components/tools/HashGeneratorTool";
import type { ToolDefinition } from "@/lib/types";
import { TextEncoder } from "util";

const hashTool: ToolDefinition = {
  slug: "hash-generator",
  title: "Hash Generator",
  shortDescription: "Generate hashes.",
  tags: ["hash"],
  intro: "Generate MD5 and SHA hashes.",
  howToUse: ["Paste", "Choose algorithm", "Generate"],
  exampleInput: "hello",
  exampleOutput: "5d41402abc4b2a76b9719d911017c592",
  whyUseful: "Checksums and verification.",
  faq: [{ question: "Algorithms?", answer: "MD5 and SHA." }],
  related: ["base64-encoder"],
  kind: "standard",
  categories: ["developer-tools"],
  createdAt: "2026-03-27",
};

describe("HashGeneratorTool", () => {
  beforeAll(() => {
    // jsdom in this setup does not expose TextEncoder by default.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).TextEncoder = TextEncoder;
  });

  it("generates md5 hash by default", async () => {
    const user = userEvent.setup();
    render(<HashGeneratorTool tool={hashTool} />);

    await user.click(screen.getByRole("button", { name: "Generate MD5 Hash" }));

    expect(screen.getByDisplayValue("5d41402abc4b2a76b9719d911017c592")).toBeInTheDocument();
  });

  it("clears stale output when input changes", async () => {
    const user = userEvent.setup();
    render(<HashGeneratorTool tool={hashTool} />);

    await user.click(screen.getByRole("button", { name: "Generate MD5 Hash" }));
    expect(screen.getByDisplayValue("5d41402abc4b2a76b9719d911017c592")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Paste text to hash..."), "!");
    expect(screen.queryByDisplayValue("5d41402abc4b2a76b9719d911017c592")).not.toBeInTheDocument();
  });

  it("generates sha-256 hash using web crypto", async () => {
    const user = userEvent.setup();
    const digestMock = jest.fn().mockResolvedValue(Uint8Array.from([0x00, 0xab, 0xff]).buffer);

    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", {
      value: { subtle: { digest: digestMock } },
      configurable: true,
    });

    try {
      render(<HashGeneratorTool tool={hashTool} />);

      await user.selectOptions(screen.getByRole("combobox"), "sha-256");
      await user.click(screen.getByRole("button", { name: "Generate SHA-256 Hash" }));

      await waitFor(() => {
        expect(digestMock).toHaveBeenCalled();
      });

      expect(screen.getByDisplayValue("00abff")).toBeInTheDocument();
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: originalCrypto, configurable: true });
    }
  });
});
