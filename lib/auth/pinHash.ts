/**
 * PIN hashing with salt. Uses expo-crypto (SHA-256 + random salt).
 * Never store or log raw PINs.
 */
import * as Crypto from "expo-crypto";

const SALT_BYTES = 32;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Generate a random salt (hex string) for storing in DB. */
export async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(SALT_BYTES);
  return bytesToHex(bytes);
}

/** Hash PIN with salt; returns hex string. */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = salt + ":" + pin;
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
  return digest;
}

/** Verify PIN against stored salt and hash. */
export async function verifyPin(
  pin: string,
  salt: string | null,
  storedHash: string
): Promise<boolean> {
  if (!salt || !storedHash) return false;
  const computed = await hashPin(pin, salt);
  return computed === storedHash;
}
