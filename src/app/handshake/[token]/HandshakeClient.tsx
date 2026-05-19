"use client";

import { useState } from "react";
import { SecurityService } from "@/lib/SecurityService";
import { Lock, Check } from "lucide-react";
import { Logo } from "@/lib/components/Logo";

export default function HandshakeClient({ token, senderName, recipientName }: { token: string; senderName: string; recipientName: string }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleAccept(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Generate keys client-side and lock Private Key with Access Password
            const { permanentPublicKey, permanentPrivateKeyEncrypted } = await SecurityService.setupSuccessorKeys(password);

            // 2. Transmit to server
            // await supabase.from('successors').update({ public_key: ..., private_key_enc: ... }).eq('token', token)
            // await supabase.from('message_recipients').update({ status: 'handshake_complete' })

            await new Promise((r) => setTimeout(r, 1500)); // simulate network
            setDone(true);
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div className="ic-auth-page">
                <div className="ic-auth-panel">
                    <div className="ic-auth-card" style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(22,60,52,0.08)", marginBottom: 20 }}><Lock size={28} strokeWidth={1.25} color="var(--green-deep)" /></div>
                        <h1 className="ic-auth-title">Connection secured</h1>
                        <p className="ic-auth-subtitle">
                            You're officially a trusted recipient for {senderName}.<br />
                            Your keys have been generated securely on your device.
                        </p>
                        <div className="ic-card" style={{ padding: 16, background: "var(--cream-warm)", textAlign: "left", marginBottom: 24 }}>
                            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Keep your password safe</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                                Without the password you just created, you will not be able to decrypt the message if it is ever released to you. We cannot recover it.
                            </p>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>You can safely close this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ic-auth-page">
            <div className="ic-auth-panel">
                <div className="ic-auth-logo">
                    <Logo href="/" size="sm" />
                    <span style={{ fontWeight: 600, fontSize: 16 }}>in case</span>
                </div>

                <div className="ic-auth-card">
                    <h1 className="ic-auth-title">Accept message request</h1>
                    <p className="ic-auth-subtitle">
                        <strong>{senderName}</strong> has chosen you as a trusted recipient for a private message.
                    </p>

                    <div style={{ padding: 16, borderLeft: "3px solid var(--forest)", background: "var(--surface-inset)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", marginBottom: 24 }}>
                        <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>
                            This message is zero-knowledge encrypted. To ensure only you can read it, we need to generate a secure "digital lockbox" for you.
                        </p>
                    </div>

                    <form onSubmit={handleAccept} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label className="ic-label">Create an Access Password</label>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                                Used to encrypt your key on this device. Do not lose this.
                            </p>
                            <input
                                type="password"
                                className="ic-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4, marginBottom: 8 }}>
                            {["Client-side key generation automatically handled", "We never see your password or private key"].map((item) => (
                                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                                    <Check size={13} strokeWidth={2} color="var(--success)" /> {item}
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="ic-btn ic-btn-primary ic-btn-full ic-btn-lg" disabled={loading || password.length < 6}>
                            {loading ? "Generating keys…" : "Generate keys & Accept"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
