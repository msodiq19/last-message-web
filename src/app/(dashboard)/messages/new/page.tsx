"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SecurityService } from "@/lib/SecurityService";
import { createLockedMessage } from "./actions";

// ── Types ──────────────────────────────────────────────────────────────────────
type Step = "write" | "checkin" | "recipients" | "review";

type Recipient = {
    id: string;
    email: string;
    name: string;
};

// ── Step Indicator ─────────────────────────────────────────────────────────────
function Stepper({ current }: { current: Step }) {
    const steps: { key: Step; label: string }[] = [
        { key: "write", label: "Write" },
        { key: "checkin", label: "Check-in" },
        { key: "recipients", label: "Recipients" },
        { key: "review", label: "Review" },
    ];
    const currentIdx = steps.findIndex((s) => s.key === current);

    return (
        <div className="ic-stepper" style={{ gap: 0 }}>
            {steps.map((s, i) => {
                const isDone = i < currentIdx;
                const isActive = i === currentIdx;
                return (
                    <div key={s.key} style={{ display: "flex", alignItems: "center" }}>
                        <div className="ic-stepper-item" style={{ flexDirection: "column", gap: 4 }}>
                            <div className={`ic-stepper-dot ${isDone ? "ic-stepper-dot--done" : isActive ? "ic-stepper-dot--active" : ""}`}>
                                {isDone ? "✓" : i + 1}
                            </div>
                            <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--text-primary)" : isDone ? "var(--success)" : "var(--text-muted)" }}>
                                {s.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`ic-stepper-line ${isDone ? "ic-stepper-line--done" : ""}`} style={{ marginBottom: 16 }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Step 1: Write ──────────────────────────────────────────────────────────────
function WriteStep({ content, onChange, onNext, onSaveDraft }: { content: string; onChange: (v: string) => void; onNext: () => void; onSaveDraft: () => void }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Write your message</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Write what matters. You can edit this anytime.</p>
            </div>
            <div>
                <textarea
                    className="ic-input"
                    rows={10}
                    placeholder="Start writing…"
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ resize: "vertical", lineHeight: 1.7, fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["B", "I", "U", "≡", "•", "⟨⟩", "🔗"].map((f) => (
                            <button key={f} className="ic-btn ic-btn-ghost ic-btn-sm" style={{ padding: "4px 8px", fontSize: 12 }}>{f}</button>
                        ))}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{content.length} words</span>
                </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={onSaveDraft} className="ic-btn ic-btn-secondary">Save draft</button>
                <button onClick={onNext} disabled={!content.trim()} className="ic-btn ic-btn-primary" style={{ flex: 1 }}>Continue</button>
            </div>
        </div>
    );
}

// ── Step 2: Check-in ──────────────────────────────────────────────────────────
function CheckinStep({ frequency, gracePeriod, onFrequencyChange, onGracePeriodChange, onNext, onBack }: {
    frequency: number; gracePeriod: number;
    onFrequencyChange: (v: number) => void;
    onGracePeriodChange: (v: number) => void;
    onNext: () => void; onBack: () => void;
}) {
    const options = [7, 14, 30];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Set your check-in</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>How often would you like to check in?</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {options.map((days) => (
                    <label key={days} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: "var(--radius)", border: `1.5px solid ${frequency === days ? "var(--forest)" : "var(--border)"}`, background: frequency === days ? "rgba(45,74,45,0.04)" : "var(--surface)", cursor: "pointer", transition: "all 0.15s" }}>
                        <input type="radio" name="frequency" checked={frequency === days} onChange={() => onFrequencyChange(days)} style={{ marginTop: 2 }} />
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{days} days {days === 14 ? <span style={{ fontSize: 11, background: "var(--success-soft)", color: "var(--success)", padding: "1px 6px", borderRadius: 4, marginLeft: 6 }}>Recommended</span> : days === 7 ? <span style={{ fontSize: 11, color: "var(--text-muted)" }}>For frequent reassurance</span> : <span style={{ fontSize: 11, color: "var(--text-muted)" }}>For extended periods</span>}</p>
                        </div>
                    </label>
                ))}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: "var(--radius)", border: `1.5px solid ${![7, 14, 30].includes(frequency) ? "var(--forest)" : "var(--border)"}`, background: "var(--surface)", cursor: "pointer" }}>
                    <input type="radio" name="frequency" checked={![7, 14, 30].includes(frequency)} onChange={() => onFrequencyChange(21)} />
                    <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>Custom</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Choose your own interval</p>
                    </div>
                </label>
            </div>

            <div>
                <label className="ic-label">Grace period</label>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Time to wait after a missed check-in before delivery.</p>
                <select className="ic-input" value={gracePeriod} onChange={(e) => onGracePeriodChange(Number(e.target.value))} style={{ maxWidth: 180 }}>
                    {[3, 5, 7, 14].map((d) => <option key={d} value={d}>{d} days</option>)}
                </select>
            </div>

            <div className="ic-card" style={{ padding: 14, background: "var(--cream-warm)", borderColor: "var(--cream-dark)" }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Reminders</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>We'll remind you before it's too late.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                    {[
                        { label: "Email reminders", sublabel: "3 days, 1 day before" },
                        { label: "Push notifications", sublabel: "Sent to this device" },
                    ].map(({ label, sublabel }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 500 }}>{label}</p>
                                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{sublabel}</p>
                            </div>
                            <label className="ic-toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="ic-toggle-slider" />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onBack} className="ic-btn ic-btn-secondary">← Back</button>
                <button onClick={onNext} className="ic-btn ic-btn-primary" style={{ flex: 1 }}>Continue</button>
            </div>
        </div>
    );
}

// ── Step 3: Recipients ─────────────────────────────────────────────────────────
function RecipientsStep({ recipients, onAdd, onRemove, onNext, onBack }: {
    recipients: Recipient[];
    onAdd: (r: Recipient) => void;
    onRemove: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    function handleAdd() {
        if (!email.trim()) return;
        onAdd({ id: crypto.randomUUID(), email: email.trim(), name: name.trim() || email.split("@")[0] });
        setName(""); setEmail("");
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Add recipients</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Who should receive this message if you don&apos;t check in?</p>
            </div>

            <div className="ic-card" style={{ padding: 0 }}>
                {recipients.length === 0 ? (
                    <p style={{ padding: 20, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>No recipients added yet</p>
                ) : recipients.map((r) => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                        <div className="ic-message-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                            {r.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.email}</p>
                        </div>
                        <span className="ic-badge ic-badge-active" style={{ fontSize: 11 }}>Can view</span>
                        <button onClick={() => onRemove(r.id)} className="ic-btn ic-btn-ghost ic-btn-sm" style={{ color: "var(--text-muted)", padding: "4px" }}>✕</button>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                        <label className="ic-label">Name</label>
                        <input className="ic-input" placeholder="Alex" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div style={{ flex: 2 }}>
                        <label className="ic-label">Email</label>
                        <input className="ic-input" type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <button onClick={handleAdd} disabled={!email.trim()} className="ic-btn ic-btn-secondary ic-btn-sm" style={{ alignSelf: "flex-start", gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add recipient
                </button>
            </div>

            <div className="ic-card" style={{ padding: 12, background: "var(--cream-warm)", borderColor: "var(--cream-dark)" }}>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Recipients receive a secure link. They never need an account.
                </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onBack} className="ic-btn ic-btn-secondary">← Back</button>
                <button onClick={onNext} disabled={recipients.length === 0} className="ic-btn ic-btn-primary" style={{ flex: 1 }}>Continue</button>
            </div>
        </div>
    );
}

// ── Step 4: Review ────────────────────────────────────────────────────────────
function ReviewStep({ content, frequency, gracePeriod, recipients, onBack, onSubmit, submitting }: {
    content: string; frequency: number; gracePeriod: number; recipients: Recipient[];
    onBack: () => void; onSubmit: (vaultPassword: string) => void; submitting: boolean;
}) {
    const [password, setPassword] = useState("");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Review &amp; confirm</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Please review your message settings before locking it.</p>
            </div>

            <div className="ic-card" style={{ padding: 0 }}>
                {[
                    { label: "Message", detail: "Your message is encrypted and ready.", action: "Edit" },
                    { label: "Check-in", detail: `Every ${frequency} days. Grace period: ${gracePeriod} days.`, action: "Edit" },
                    { label: "Recipients", detail: `${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}`, action: "Edit" },
                ].map(({ label, detail, action }) => (
                    <div key={label} className="ic-settings-row" style={{ padding: "14px 16px" }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{detail}</p>
                        </div>
                        <button className="ic-btn ic-btn-ghost ic-btn-sm" style={{ color: "var(--forest)" }}>{action}</button>
                    </div>
                ))}
            </div>

            <div className="ic-card" style={{ padding: 14, background: "var(--cream-warm)", borderColor: "var(--cream-dark)" }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>What happens next?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                        "If you check in, nothing happens. Your message stays safe.",
                        `If you miss a check-in, we'll wait ${gracePeriod} days before delivering.`,
                        "If we still don't hear from you, your message is delivered securely.",
                    ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                            <span style={{ fontWeight: 700, color: "var(--forest)", flexShrink: 0 }}>{i + 1}.</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Message encrypted and ready", "Secure-side encryption ✓", "Zero-knowledge storage ✓", "Secure delivery protocol ✓"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--success)" }}>✓</span> {item}
                    </div>
                ))}
            </div>

            <div className="ic-card" style={{ padding: 16 }}>
                <label className="ic-label">Your Vault Password</label>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                    Create a master password to encrypt your message on this device. You'll need this to edit the message later.
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

            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onBack} className="ic-btn ic-btn-secondary">← Back</button>
                <button onClick={() => onSubmit(password)} disabled={submitting || password.length < 6} className="ic-btn ic-btn-primary" style={{ flex: 1, gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    {submitting ? "Locking securely…" : "Lock & activate"}
                </button>
            </div>
        </div>
    );
}

// ── Main Wizard ────────────────────────────────────────────────────────────────
export default function NewMessagePage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("write");
    const [content, setContent] = useState("");
    const [frequency, setFrequency] = useState(14);
    const [gracePeriod, setGracePeriod] = useState(7);
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(vaultPassword: string) {
        setSubmitting(true);
        try {
            // 1. Encrypt message locally using zero-knowledge WebCrypto architecture
            const lockedPayload = await SecurityService.lockMessage(content, vaultPassword);

            // 2. Submit to server action
            await createLockedMessage({
                encryptedBlob: lockedPayload.encryptedBlob,
                temporaryPublicKey: lockedPayload.temporaryPublicKey,
                temporaryPrivateKeyEncrypted: lockedPayload.temporaryPrivateKeyEncrypted,
                encryptedSymmetricKey: lockedPayload.encryptedSymmetricKey,
                releaseAfter: frequency,
                recipients: recipients.map(r => ({ email: r.email, name: r.name }))
            });

            router.push("/dashboard");
        } catch (err: any) {
            console.error("Failed to commit message:", err);
            alert("Failed to encrypt and lock message. See console.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <header className="ic-topbar">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => router.back()} className="ic-btn ic-btn-ghost ic-btn-sm" style={{ padding: "6px 8px" }}>
                        ←
                    </button>
                    <Stepper current={step} />
                </div>
                <button className="ic-btn ic-btn-secondary ic-btn-sm" onClick={() => { }}>Save draft</button>
            </header>

            <div className="ic-page-content" style={{ maxWidth: 600, padding: "40px 24px" }}>
                {step === "write" && (
                    <WriteStep content={content} onChange={setContent} onNext={() => setStep("checkin")} onSaveDraft={() => { }} />
                )}
                {step === "checkin" && (
                    <CheckinStep frequency={frequency} gracePeriod={gracePeriod} onFrequencyChange={setFrequency} onGracePeriodChange={setGracePeriod} onNext={() => setStep("recipients")} onBack={() => setStep("write")} />
                )}
                {step === "recipients" && (
                    <RecipientsStep recipients={recipients} onAdd={(r) => setRecipients([...recipients, r])} onRemove={(id) => setRecipients(recipients.filter((r) => r.id !== id))} onNext={() => setStep("review")} onBack={() => setStep("checkin")} />
                )}
                {step === "review" && (
                    <ReviewStep content={content} frequency={frequency} gracePeriod={gracePeriod} recipients={recipients} onBack={() => setStep("recipients")} onSubmit={handleSubmit} submitting={submitting} />
                )}
            </div>
        </>
    );
}
