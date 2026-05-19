"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Database, Mail, ShieldCheck, Eye, ArrowRight } from "lucide-react";
import { TrustBadge } from "@/lib/components/TrustBadge";

type SettingsTab = "account" | "security" | "notifications" | "privacy";

export default function SettingsPage() {
    const [tab, setTab] = useState<SettingsTab>("account");

    const tabs: { key: SettingsTab; label: string }[] = [
        { key: "account", label: "Account" },
        { key: "security", label: "Security & Encryption" },
        { key: "notifications", label: "Notifications" },
        { key: "privacy", label: "Privacy" },
    ];

    return (
        <>
            <header className="ic-topbar">
                <h1 style={{ fontSize: 18, fontWeight: 700 }}>Settings</h1>
            </header>

            <div className="ic-page-content" style={{ maxWidth: 680 }}>
                {/* Tab nav */}
                <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            style={{
                                padding: "10px 16px", fontSize: 14, fontWeight: 500,
                                background: "transparent", border: "none", cursor: "pointer",
                                color: tab === t.key ? "var(--forest)" : "var(--text-muted)",
                                borderBottom: tab === t.key ? "2px solid var(--forest)" : "2px solid transparent",
                                marginBottom: -1, transition: "all 0.15s",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Account tab */}
                {tab === "account" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="ic-card" style={{ padding: 20 }}>
                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Account</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div><label className="ic-label">Full name</label><input className="ic-input" defaultValue="" placeholder="Your name" /></div>
                                <div><label className="ic-label">Email</label><input className="ic-input" type="email" defaultValue="" disabled style={{ opacity: 0.6 }} /></div>
                                <button className="ic-btn ic-btn-primary ic-btn-sm" style={{ alignSelf: "flex-start" }}>Save changes</button>
                            </div>
                        </div>
                        <div className="ic-card" style={{ padding: 20 }}>
                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Help &amp; Support</p>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>How to contact us</p>
                            <Link href="/help" className="ic-btn ic-btn-secondary ic-btn-sm">Get help</Link>
                        </div>
                        <div className="ic-card" style={{ padding: 20 }}>
                            <button className="ic-btn ic-btn-ghost ic-btn-sm" style={{ color: "var(--text-muted)" }}>Log out</button>
                        </div>
                    </div>
                )}

                {/* Security tab */}
                {tab === "security" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="ic-card" style={{ padding: 20, borderLeft: "3px solid var(--forest)" }}>
                            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Your privacy is built in</p>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                                We only put data on our servers that you and your recipients can read.
                            </p>
                        </div>
                        {[
                            { icon: <Lock size={16} strokeWidth={1.5} color="var(--green-deep)" />, label: "Encryption", sublabel: "End-to-end · Client-side", action: "›" },
                            { icon: <Database size={16} strokeWidth={1.5} color="var(--green-deep)" />, label: "Data storage", sublabel: "Zero-knowledge · Encrypted at rest", action: "›" },
                            { icon: <Mail size={16} strokeWidth={1.5} color="var(--green-deep)" />, label: "Delivery protocol", sublabel: "Two-factor auth · Expiring access", action: "›" },
                            { icon: <ShieldCheck size={16} strokeWidth={1.5} color="var(--green-deep)" />, label: "Account security", sublabel: "Two-factor auth · Login alerts", action: "›" },
                            { icon: <Eye size={16} strokeWidth={1.5} color="var(--green-deep)" />, label: "Privacy", sublabel: "Data policy · Your rights", action: "›" },
                        ].map(({ icon, label, sublabel, action }) => (
                            <div key={label} className="ic-card ic-settings-row" style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "rgba(22,60,52,0.07)" }}>{icon}</div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
                                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{sublabel}</p>
                                    </div>
                                </div>
                                <span style={{ color: "var(--text-muted)", fontSize: 18 }}>{action}</span>
                            </div>
                        ))}
                        <div className="ic-card" style={{ padding: 16, background: "var(--cream-warm)" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Your privacy is everything</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                                We don&apos;t store your messages, and your recipients will never access your messages or keys on our servers.
                            </p>
                            <Link href="/security" style={{ fontSize: 13, color: "var(--forest)", textDecoration: "none", marginTop: 8, display: "block" }}>
                                Learn more about our security architecture
                            </Link>
                        </div>
                    </div>
                )}

                {/* Notifications tab */}
                {tab === "notifications" && (
                    <div className="ic-card" style={{ padding: 20 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Notifications &amp; alerts</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {[
                                { label: "Email reminders", sublabel: "Sent to your email" },
                                { label: "Push notifications", sublabel: "Sent to this device" },
                            ].map(({ label, sublabel }) => (
                                <div key={label} className="ic-settings-row">
                                    <div>
                                        <p style={{ fontWeight: 500, fontSize: 14 }}>{label}</p>
                                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{sublabel}</p>
                                    </div>
                                    <label className="ic-toggle">
                                        <input type="checkbox" defaultChecked />
                                        <span className="ic-toggle-slider" />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Privacy tab */}
                {tab === "privacy" && (
                    <div className="ic-card" style={{ padding: 20 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Privacy</p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                            Your privacy is our priority. We abide by the following, incidents, and safe policies.
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <Link href="/privacy" className="ic-btn ic-btn-secondary ic-btn-sm">View privacy policy</Link>
                            <Link href="/data" className="ic-btn ic-btn-secondary ic-btn-sm">Download my data</Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
