"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Database, Mail, ShieldCheck, Eye, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SettingsTab = "account" | "security" | "notifications" | "privacy";

export default function SettingsPage() {
    const router = useRouter();
    const [tab, setTab] = useState<SettingsTab>("account");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            setEmail(user.email || "");
            setName(user.user_metadata?.full_name || "");
        });
    }, []);

    async function handleSave() {
        setSaving(true);
        setSaveMsg("");
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
        if (!error) {
            // Also update profiles table
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from("profiles").upsert({ id: user.id, email: user.email!, full_name: name } as any);
            }
            setSaveMsg("Saved.");
        } else {
            setSaveMsg("Failed to save. Please try again.");
        }
        setSaving(false);
        setTimeout(() => setSaveMsg(""), 3000);
    }

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    const tabs: { key: SettingsTab; label: string }[] = [
        { key: "account", label: "Account" },
        { key: "security", label: "Security" },
        { key: "notifications", label: "Notifications" },
        { key: "privacy", label: "Privacy" },
    ];

    return (
        <>
            <header className="ic-topbar">
                <div>
                    <h1 className="ic-page-title">Settings</h1>
                </div>
            </header>

            <div className="ic-page-content" style={{ maxWidth: 680 }}>
                {/* Tab nav */}
                <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            style={{
                                padding: "10px 16px", fontSize: 13, fontWeight: 500,
                                background: "transparent", border: "none", cursor: "pointer",
                                color: tab === t.key ? "var(--green-deep)" : "var(--text-muted)",
                                borderBottom: tab === t.key ? "2px solid var(--green-deep)" : "2px solid transparent",
                                marginBottom: -1, transition: "all 0.15s",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Account */}
                {tab === "account" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="ic-card" style={{ padding: 20 }}>
                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Profile</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div>
                                    <label className="ic-label">Full name</label>
                                    <input
                                        className="ic-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="ic-label">Email</label>
                                    <input
                                        className="ic-input"
                                        type="email"
                                        value={email}
                                        disabled
                                        style={{ opacity: 0.6 }}
                                    />
                                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                                        Email cannot be changed here.
                                    </p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="ic-btn ic-btn-primary ic-btn-sm"
                                    >
                                        {saving ? "Saving…" : "Save changes"}
                                    </button>
                                    {saveMsg && (
                                        <span style={{ fontSize: 13, color: saveMsg === "Saved." ? "var(--success)" : "var(--error)" }}>
                                            {saveMsg}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="ic-card" style={{ padding: 20 }}>
                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Account actions</p>
                            <button
                                onClick={handleLogout}
                                className="ic-btn ic-btn-ghost ic-btn-sm"
                                style={{ color: "var(--error)" }}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                )}

                {/* Security */}
                {tab === "security" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div className="ic-card" style={{ padding: 16, borderLeft: "3px solid var(--green-deep)" }}>
                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Your privacy is built in</p>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                                We only put data on our servers that you and your recipients can read.
                            </p>
                        </div>
                        {[
                            { icon: <Lock size={15} strokeWidth={1.5} color="var(--green-deep)" />, label: "Encryption", sublabel: "End-to-end · Client-side" },
                            { icon: <Database size={15} strokeWidth={1.5} color="var(--green-deep)" />, label: "Data storage", sublabel: "Zero-knowledge · Encrypted at rest" },
                            { icon: <Mail size={15} strokeWidth={1.5} color="var(--green-deep)" />, label: "Delivery protocol", sublabel: "Secure link · Expiring access" },
                            { icon: <ShieldCheck size={15} strokeWidth={1.5} color="var(--green-deep)" />, label: "Account security", sublabel: "Auth protected · Session managed" },
                            { icon: <Eye size={15} strokeWidth={1.5} color="var(--green-deep)" />, label: "Privacy", sublabel: "Data policy · Your rights" },
                        ].map(({ icon, label, sublabel }) => (
                            <Link key={label} href="/security" className="ic-card ic-settings-row" style={{ padding: "12px 16px", textDecoration: "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: "rgba(22,60,52,0.07)" }}>
                                        {icon}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 500, fontSize: 14 }}>{label}</p>
                                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{sublabel}</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} strokeWidth={1.75} color="var(--text-muted)" />
                            </Link>
                        ))}
                        <Link href="/security" style={{ fontSize: 13, color: "var(--green-deep)", textDecoration: "none", marginTop: 4 }}>
                            Read the full security architecture →
                        </Link>
                    </div>
                )}

                {/* Notifications */}
                {tab === "notifications" && (
                    <div className="ic-card" style={{ padding: 20 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Notifications &amp; alerts</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {[
                                { label: "Email reminders", sublabel: "Sent to your email before check-in is due" },
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

                {/* Privacy */}
                {tab === "privacy" && (
                    <div className="ic-card" style={{ padding: 20 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Privacy</p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                            Your messages are encrypted on your device before they reach our servers.
                            We cannot read them. Your privacy is structural, not a promise.
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <Link href="/security" className="ic-btn ic-btn-secondary ic-btn-sm">Security architecture</Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
