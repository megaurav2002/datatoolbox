import { generateHashValue, generateMd5Hash } from "@/lib/transformations/hash";
import { TextEncoder } from "util";

describe("hash utilities", () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).TextEncoder = TextEncoder;
  });

  it("generates md5 synchronously", () => {
    expect(generateMd5Hash("hello")).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it("generates md5 through async helper", async () => {
    await expect(generateHashValue("hello", "md5")).resolves.toBe(
      "5d41402abc4b2a76b9719d911017c592",
    );
  });

  it("throws if SHA hashing APIs are unavailable", async () => {
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });

    try {
      await expect(generateHashValue("hello", "sha-256")).rejects.toThrow(
        "This browser does not support SHA hashing APIs.",
      );
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: originalCrypto, configurable: true });
    }
  });

  it("throws if text encoding APIs are unavailable", async () => {
    const originalCrypto = globalThis.crypto;
    const originalTextEncoder = globalThis.TextEncoder;

    Object.defineProperty(globalThis, "crypto", {
      value: { subtle: { digest: jest.fn() } },
      configurable: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).TextEncoder = undefined;

    try {
      await expect(generateHashValue("hello", "sha-256")).rejects.toThrow(
        "Text encoding APIs are not available in this environment.",
      );
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: originalCrypto, configurable: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).TextEncoder = originalTextEncoder;
    }
  });

  it("returns lowercase hex digest for sha-256", async () => {
    const digestMock = jest.fn().mockResolvedValue(Uint8Array.from([0x0a, 0x0b, 0xff]).buffer);
    const originalCrypto = globalThis.crypto;

    Object.defineProperty(globalThis, "crypto", {
      value: { subtle: { digest: digestMock } },
      configurable: true,
    });

    try {
      const output = await generateHashValue("hello", "sha-256");
      expect(output).toBe("0a0bff");
      expect(digestMock).toHaveBeenCalled();
      const [, bytes] = digestMock.mock.calls[0] as [string, ArrayLike<number>];
      expect(Array.from(bytes)).toEqual([104, 101, 108, 108, 111]);
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: originalCrypto, configurable: true });
    }
  });
});
