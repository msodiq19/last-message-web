"use client";

import { useState } from "react";
import { Key, CheckCircle2 } from "lucide-react";
import { SecurityService } from "@/lib/SecurityService";
import { saveTransferredKey } from "./actions";

export default function KeyTransferClient({
    messageRecipientId,
    temporaryPrivateKeyEncrypted,
    encryptedSymmetricKey,
    successorPublicKey,
    recipientName,
}: {
    messageRecipientId: string;
    temporaryPrivateKeyEncrypted: string;
    encryptedSymmetricKey: string;
    successorPublicKey: string;
    recipientName: string;
}) {
    const [vaultPassword, setVaultPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    async function handleTransfer(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Re-encrypt the symmetric key using the recipient's permanent public key
            const newEncryptedKey = await SecurityService.grantAccessToSuccessor(
                temporaryPrivateKeyEncrypted,
                vaultPassword,
                encryptedSymmetricKey,
                successorPublicKey
            );

            const result = await saveTransferredKey(messageRecipientId, newEncryptedKey);
            if (!result.success) throw new Error(result.error);

            setDone(true);
        } catch {
            setError("Incorrect vault password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 8,
                background: "var(--success-soft)", marginTop: 12,
            }}>
                <CheckCircle2 size={16} color="var(--success)" strokeWidth={1.75} />
                <p style={{ fontSize: 13, color: "var(--success)", fontWeight: 500 }}>
                    Setup complete. {recipientName} can now receive your message when it&apos;s released.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            padding: "14px 16px", borderRadius: 8,
            background: "rgba(255,200,50,0.08)",
            border: "1px solid rgba(255,200,50,0.3)",
            marginTop: 12,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Key size={14} strokeWidth={1.75} color="var(--text-secondary)" />
                <p style={{ fontSize: 13, fontWeight: 600 }}>Action needed — complete setup for {recipientName}</p>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }}>
                {recipientName} accepted your invitation. Enter your vault password to enable encrypted delivery — this only needs to happen once.
            </p>
            <form onSubmit={handleTransfer} style={{ display: "flex", gap: 8 }}>
                <input
                    type="password"
                    className="ic-input"
                    placeholder="Your vault password"
                    value={vaultPassword}
                    onChange={e => setVaultPassword(e.target.value)}
                    required
                    style={{ flex: 1, fontSize: 13 }}
                />
                <button
                    type="submit"
                    className="ic-btn ic-btn-primary ic-btn-sm"
                    disabled={loading || !vaultPassword}
                >
                    {loading ? "Securing…" : "Complete setup"}
                </button>
            </form>
            {error && (
                <p style={{ fontSize: 12, color: "var(--error)", marginTop: 8 }}>{error}</p>
            )}
        </div>
    );
}
