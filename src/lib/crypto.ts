/**
 * Client-side encryption/decryption using Web Crypto API (AES-256-GCM).
 *
 * All crypto happens in the browser. The server never sees the plaintext
 * or the encryption key.
 */

/**
 * Generate a new AES-256-GCM encryption key.
 * Returns the key as a base64url-encoded string.
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"]
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  return bufferToBase64url(raw);
}

/**
 * Generate a random check-in token (32 bytes, base64url-encoded).
 */
export function generateCheckinToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bufferToBase64url(bytes.buffer);
}

/**
 * Encrypt a plaintext message with the given base64url-encoded key.
 * Returns a base64url-encoded string containing IV + ciphertext.
 */
export async function encryptMessage(
  plaintext: string,
  keyBase64url: string
): Promise<string> {
  const keyBuffer = base64urlToBuffer(keyBase64url);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  // Prepend IV to ciphertext: [12 bytes IV][ciphertext]
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return bufferToBase64url(combined.buffer);
}

/**
 * Decrypt a base64url-encoded blob (IV + ciphertext) with the given key.
 * Returns the plaintext string, or null if decryption fails (wrong key).
 */
export async function decryptMessage(
  encryptedBase64url: string,
  keyBase64url: string
): Promise<string | null> {
  try {
    const combined = new Uint8Array(base64urlToBuffer(encryptedBase64url));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const keyBuffer = base64urlToBuffer(keyBase64url);
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    // Wrong key or corrupted data → return null
    return null;
  }
}

/**
 * Force-download the encryption key as a .key file.
 */
export function downloadKeyFile(key: string, filename = "last-message.key") {
  const content = `# Last Message Encryption Key\n# WARNING: If you lose this key, your message is permanently unrecoverable.\n# Keep this file safe.\n\n${key}\n`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Encoding helpers ---

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
