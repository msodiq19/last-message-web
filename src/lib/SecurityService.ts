/**
 * Security Service for the CyberTwin "Salted Fragment" architecture.
 * Implements Web Crypto API for zero-knowledge key splitting and encryption.
 */

function bufferToHex(buffer: ArrayBuffer | ArrayBufferLike): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes.buffer;
}

export class SecurityService {
    /**
     * Generate a new AES-256-GCM Vault Key (VK).
     * Generates 256 bits (32 bytes) of random values.
     */
    static generateVaultKey(): Uint8Array {
        const keyBytes = new Uint8Array(32);
        crypto.getRandomValues(keyBytes);
        return keyBytes;
    }

    /**
     * Split the Vault Key into two 128-bit halves (A and B).
     */
    static splitVaultKey(vk: Uint8Array): { fragmentA: Uint8Array; fragmentBHex: string } {
        if (vk.length !== 32) throw new Error("Vault Key must be 256 bits / 32 bytes");
        const fragmentA = vk.slice(0, 16);
        const fragmentB = vk.slice(16, 32);
        return {
            fragmentA,
            fragmentBHex: bufferToHex(fragmentB.buffer),
        };
    }

    /**
     * Reconstruct the Vault Key from Fragment A and Fragment B.
     */
    static reconstructVaultKey(fragmentA: Uint8Array, fragmentBHex: string): Uint8Array {
        const fragmentB = new Uint8Array(hexToBuffer(fragmentBHex));
        if (fragmentA.length !== 16 || fragmentB.length !== 16) {
            throw new Error("Both fragments must be exactly 128 bits / 16 bytes");
        }
        const vk = new Uint8Array(32);
        vk.set(fragmentA, 0);
        vk.set(fragmentB, 16);
        return vk;
    }

    /**
     * Derive a Key from the user's secret answer using PBKDF2.
     * Returns a CryptoKey that can be used for AES-GCM.
     */
    static async deriveKeyFromAnswer(answer: string, saltHex?: string): Promise<{ key: CryptoKey; saltHex: string }> {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            enc.encode(answer),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        let salt: Uint8Array;
        if (saltHex) {
            salt = new Uint8Array(hexToBuffer(saltHex));
        } else {
            salt = crypto.getRandomValues(new Uint8Array(16));
        }

        const key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt as any,
                iterations: 100000,
                hash: "SHA-256",
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );

        return { key, saltHex: bufferToHex(salt.buffer) };
    }

    /**
     * Encrypt Fragment A using the derived answer key.
     * Format returned (Hex): [salt (16b)] [iv (12b)] [ciphertext]
     */
    static async encryptFragmentA(fragmentA: Uint8Array, answer: string): Promise<string> {
        const { key, saltHex } = await this.deriveKeyFromAnswer(answer);
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const ciphertextBuf = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            fragmentA as any
        );

        const ivHex = bufferToHex(iv.buffer);
        const cipherHex = bufferToHex(ciphertextBuf);

        return `${saltHex}${ivHex}${cipherHex}`;
    }

    /**
     * Decrypt Fragment A using the answer.
     */
    static async decryptFragmentA(encryptedPayloadHex: string, answer: string): Promise<Uint8Array> {
        if (encryptedPayloadHex.length < 56 /* 32 for salt + 24 for iv */) {
            throw new Error("Invalid payload length");
        }

        const saltHex = encryptedPayloadHex.substring(0, 32);
        const ivHex = encryptedPayloadHex.substring(32, 56);
        const cipherHex = encryptedPayloadHex.substring(56);

        const { key } = await this.deriveKeyFromAnswer(answer, saltHex);
        const iv = new Uint8Array(hexToBuffer(ivHex));
        const ciphertext = new Uint8Array(hexToBuffer(cipherHex));

        const decryptedBuf = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext as any
        );

        return new Uint8Array(decryptedBuf);
    }

    /**
     * Encrypt vault content using the complete Vault Key.
     * Output format: [iv (12b hex)] [ciphertext (hex)]
     */
    static async encryptContent(content: string, vk: Uint8Array): Promise<string> {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            vk as any,
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ciphertextBuf = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            enc.encode(content) as any
        );

        return `${bufferToHex(iv.buffer)}${bufferToHex(ciphertextBuf)}`;
    }

    /**
     * Decrypt vault content using the complete Vault Key.
     */
    static async decryptContent(encryptedContentHex: string, vk: Uint8Array): Promise<string> {
        if (encryptedContentHex.length < 24) throw new Error("Invalid content length");

        const ivHex = encryptedContentHex.substring(0, 24);
        const cipherHex = encryptedContentHex.substring(24);

        const key = await crypto.subtle.importKey(
            "raw",
            vk as any,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );

        const iv = new Uint8Array(hexToBuffer(ivHex));
        const ciphertext = new Uint8Array(hexToBuffer(cipherHex));

        const decryptedBuf = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext as any
        );

        return new TextDecoder().decode(decryptedBuf);
    }
}
