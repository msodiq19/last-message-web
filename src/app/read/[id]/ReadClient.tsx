"use client";

import { useState } from "react";
import { SecurityService } from "@/lib/SecurityService";
import { Check } from "lucide-react";
import { Logo } from "@/lib/components/Logo";

export default function ReadClient({
    messageId,
    senderName,
    encryptedBlob,
    encryptedSymmetricKey,
    permanentPrivateKeyEncrypted
}: {
    messageId: string;
    senderName: string;
    encryptedBlob: string;
    encryptedSymmetricKey: string;
    permanentPrivateKeyEncrypted: string;
}) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [plaintext, setPlaintext] = useState<string | null>(null);
    const [error, setError] = useState("");

    async function handleDecrypt(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const decrypted = await SecurityService.openMessageAsSuccessor(
                encryptedBlob,
                encryptedSymmetricKey,
                permanentPrivateKeyEncrypted,
                password
            );
            setPlaintext(decrypted);

            // Mark as read
            fetch(`/api/messages/${messageId}/read`, { method: "POST" }).catch(() => {});
        } catch (err: any) {
            setError("Incorrect password. Please check your Access Password and try again.");
        } finally {
            setLoading(false);
        }
    }

    if (plaintext !== null) {
        return (
            <div className="ic-auth-page" style={{ paddingTop: 60, paddingBottom: 60 }}>
                <div style={{ maxWidth: 680, width: "100%", margin: "0 auto", padding: "0 24px" }}>
                    <div className="ic-auth-logo" style={{ marginBottom: 40 }}>
                        <Logo href="/" size="sm" />
                        <span style={{ fontWeight: 600, fontSize: 16 }}>in case</span>
                    </div>

                    <div className="ic-card" style={{ padding: "40px" }}>
                        <h1 className="ic-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                            A message from {senderName}
                        </h1>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>
                            Decrypted securely on your device.
                        </p>

                        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 15, color: "var(--text-primary)" }}>
                            {plaintext}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ic-auth-page">
            <div className="ic-auth-panel" style={{ maxWidth: 460 }}>
                <div className="ic-auth-logo">
                    <Logo href="/" size="sm" />
                    <span style={{ fontWeight: 600, fontSize: 16 }}>in case</span>
                </div>

                <div className="ic-auth-card">
                    <h1 className="ic-auth-title" style={{ fontSize: 24 }}>Unlock Message</h1>
                    <p className="ic-auth-subtitle">
                        <strong>{senderName}</strong> left a message for you. It requires your Access Password to decrypt.
                    </p>

                    <form onSubmit={handleDecrypt} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label className="ic-label">Your Access Password</label>
                            <input
                                type="password"
                                className="ic-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{ padding: "10px 13px", background: "var(--error-soft)", border: "1px solid rgba(196,74,58,0.2)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--error)" }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="ic-btn ic-btn-primary ic-btn-full ic-btn-lg" disabled={loading || !password}>
                            {loading ? "Decrypting locally…" : "Decrypt Message"}
                        </button>
                    </form>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 24 }}>
                        {["Message is decrypted entirely on your device", "The server cannot read the message"].map((item) => (
                            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                                <Check size={13} strokeWidth={2} color="var(--success)" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
