import md5 from "blueimp-md5";

export type HashAlgorithm = "md5" | "sha-1" | "sha-256" | "sha-384" | "sha-512";

const subtleAlgorithmMap: Record<Exclude<HashAlgorithm, "md5">, AlgorithmIdentifier> = {
  "sha-1": "SHA-1",
  "sha-256": "SHA-256",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512",
};

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function generateMd5Hash(input: string): string {
  return md5(input);
}

export async function generateHashValue(input: string, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === "md5") {
    return generateMd5Hash(input);
  }

  if (!globalThis.crypto?.subtle) {
    throw new Error("This browser does not support SHA hashing APIs.");
  }

  if (typeof TextEncoder === "undefined") {
    throw new Error("Text encoding APIs are not available in this environment.");
  }

  const bytes = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest(subtleAlgorithmMap[algorithm], bytes);
  return bytesToHex(digest);
}
