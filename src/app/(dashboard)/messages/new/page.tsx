"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SecurityService } from "@/lib/SecurityService";
import { createLockedMessage } from "./actions";
import { Check, ArrowLeft, X, Bold, Italic, Underline, List, Link2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = "write" | "checkin" | "recipients" | "review";

type Recipient = {
    id: string;
    email: string;
    name: string;
};

// ── Step Indicator ────────────────────────────────────────────────────────────
function Stepper({ current }: { current: Step }) {
    const steps: { key: Step; label: string }[] = [
        { key: "write", label: "Write" },
        { key: "checkin", label: "Set check-in" },
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
                                {isDone ? <Check size={11} strokeWidth={2.5} /> : i + 1}
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

// ── Step 1: Write ─────────────────────────────────────────────────────────────
function WriteStep({ content, onChange, onNext, onSaveDraft }: {
    content: string;
    onChange: (v: string) => void;
    onNext: () => void;
    onSaveDraft: () => void;
}) {
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <h2 className="ic-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>Write your message</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Write what matters. You can edit this anytime.</p>
            </div>
            <div>
                <textarea
                    className="ic-input"
                    rows={10}
                    placeholder="Start writing..."
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ resize: "vertical", lineHeight: 1.7, fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {[
                            { icon: <Bold size={12} strokeWidth={1.75} />, label: "Bold" },
                            { icon: <Italic size={12} strokeWidth={1.75} />, label: "Italic" },
                            { icon: <Underline size={12} strokeWidth={1.75} />, label: "Underline" },
                            { icon: <List size={12} strokeWidth={1.75} />, label: "List" },
                            { icon: <Link2 size={12} strokeWidth={1.75} />, label: "Link" },
                        ].map(({ icon, label }) => (
                            <button
                                key={label}
                                title={label + " - rich formatting coming soon"}
                                disabled
                                className="ic-btn ic-btn-ghost ic-btn-sm"
                                style={{ padding: "5px 7px", opacity: 0.4, cursor: "not-allowed" }}
                            >
                                {icon}
                            </button>
                        ))}
                        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8, opacity: 0.7 }}>
                            Rich formatting coming soon
                        </span>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{wordCount} words</span>
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
    frequency: number;
    gracePeriod: number;
    onFrequencyChange: (v: number) => void;
    onGracePeriodChange: (v: number) => void;
    onNext: () => void;
    onBack: () => void;
}) {
    const presets = [7, 14, 30];
    const isCustom = !presets.includes(frequency);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
                <h2 className="ic-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>Set your check-in</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>How often would you like to check in?</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {presets.map((days) => (
                    <label key={days} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: "var(--radius)", border: `1.5px solid ${frequency === days ? "var(--green-deep)" : "var(--border)"}`, background: frequency === days ? "rgba(22,60,52,0.04)" : "var(--surface)", cursor: "pointer", transition: "all 0.15s" }}>
                        <input type="radio" name="frequency" checked={frequency === days} onChange={() => onFrequencyChange(days)} style={{ marginTop: 2 }} />
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>
                                {days} days{" "}
                                {days === 14
                                    ? <span style={{ fontSize: 11, background: "var(--success-soft)", color: "var(--success)", padding: "1px 6px", borderRadius: 4, marginLeft: 6 }}>Recommended</span>
                                    : days === 7
                                        ? <span style={{ fontSize: 11, color: "var(--text-muted)" }}>For frequent reassurance</span>
                                        : <span style={{ fontSize: 11, color: "var(--text-muted)" }}>For extended periods</span>
                                }
                            </p>
                        </div>
                    </label>
                ))}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: "var(--radius)", border: `1.5px solid ${isCustom ? "var(--green-deep)" : "var(--border)"}`, background: "var(--surface)", cursor: "pointer" }}>
                    <input type="radio" name="frequency" checked={isCustom} onChange={() => onFrequencyChange(21)} style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>Custom</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Choose your own interval</p>
                        {isCustom && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                                <input
                                    type="number"
                                    min={1}
                                    max={365}
                                    className="ic-input"
                                    style={{ width: 80 }}
                                    value={frequency}
                                    onChange={(e) => onFrequencyChange(Math.max(1, Math.min(365, Number(e.target.value))))}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>days</span>
                            </div>
                        )}
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
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>We will remind you before it is too late.</p>
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
                <button onClick={onBack} className="ic-btn ic-btn-secondary" style={{ gap: 6 }}>
                    <ArrowLeft size={13} strokeWidth={1.75} /> Back
                </button>
                <button onClick={onNext} className="ic-btn ic-btn-primary" style={{ flex: 1 }}>Continue</button>
            </div>
        </div>
    );
}

// ── Step 3: Recipients ────────────────────────────────────────────────────────
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
                <h2 className="ic-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>Add recipients</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Who should receive this message if you do not check in?</p>
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
                        <button
                            onClick={() => onRemove(r.id)}
                            className="ic-btn ic-btn-ghost ic-btn-sm"
                            style={{ color: "var(--text-muted)", padding: "4px" }}
                        >
                            <X size={12} strokeWidth={2} />
                        </button>
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
                        <input
                            className="ic-input"
                            type="email"
                            placeholder="alex@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
                        />
                    </div>
                </div>
                <button onClick={handleAdd} disabled={!email.trim()} className="ic-btn ic-btn-secondary ic-btn-sm" style={{ alignSelf: "flex-start", gap: 6 }}>
                    + Add recipient
                </button>
            </div>

            <div className="ic-card" style={{ padding: 12, background: "var(--cream-warm)", borderColor: "var(--cream-dark)" }}>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Recipients receive a secure link. They never need an account.
                </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onBack} className="ic-btn ic-btn-secondary" style={{ gap: 6 }}>
                    <ArrowLeft size={13} strokeWidth={1.75} /> Back
                </button>
                <button onClick={onNext} disabled={recipients.length === 0} className="ic-btn ic-btn-primary" style={{ flex: 1 }}>Continue</button>
            </div>
        </div>
    );
}

// ── Step 4: Review ────────────────────────────────────────────────────────────
function ReviewStep({ content, frequency, gracePeriod, recipients, onBack, onSubmit, submitting, onGoToStep }: {
    content: string;
    frequency: number;
    gracePeriod: number;
    recipients: Recipient[];
    onBack: () => void;
    onSubmit: (vaultPassword: string) => void;
    submitting: boolean;
    onGoToStep: (s: Step) => void;
}) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit() {
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setError("");
        onSubmit(password);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
                <h2 className="ic-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>Review and confirm</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Please review your message settings before locking it.</p>
            </div>

            <div className="ic-card" style={{ padding: 0 }}>
                {[
                    { label: "Message", detail: "Your message is encrypted and ready.", step: "write" as Step },
                    { label: "Check-in", detail: `Every ${frequency} days. Grace period: ${gracePeriod} days.`, step: "checkin" as Step },
                    { label: "Recipients", detail: `${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}`, step: "recipients" as Step },
                ].map(({ label, detail, step }) => (
                    <div key={label} className="ic-settings-row" style={{ padding: "14px 16px" }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{detail}</p>
                        </div>
                        <button
                            className="ic-btn ic-btn-ghost ic-btn-sm"
                            style={{ color: "var(--green-deep)" }}
                            onClick={() => onGoToStep(step)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            <div className="ic-card" style={{ padding: 14, background: "var(--cream-warm)", borderColor: "var(--cream-dark)" }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>What happens next?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                        "If you check in, nothing happens. Your message stays safe.",
                        `If you miss a check-in, we will wait ${gracePeriod} days before delivering.`,
                        "If we still do not hear from you, your message is delivered securely.",
                    ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                            <span style={{ fontWeight: 700, color: "var(--green-deep)", flexShrink: 0 }}>{i + 1}.</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Message encrypted and ready", "Client-side encryption", "Zero-knowledge storage", "Secure delivery protocol"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                        <Check size={13} strokeWidth={2} color="var(--success)" /> {item}
                    </div>
                ))}
            </div>

            <div className="ic-card" style={{ padding: 16 }}>
                <label className="ic-label">Your vault password</label>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                    Create a password to encrypt your message on this device. You will need it to edit the message later.
                </p>
                <input
                    type="password"
                    className="ic-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    required
                />
                {error && (
                    <p style={{ fontSize: 12, color: "var(--error)", marginTop: 6 }}>{error}</p>
                )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onBack} className="ic-btn ic-btn-secondary" style={{ gap: 6 }}>
                    <ArrowLeft size={13} strokeWidth={1.75} /> Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting || password.length < 6}
                    className="ic-btn ic-btn-primary"
                    style={{ flex: 1, gap: 8 }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {submitting ? "Locking securely..." : "Lock and activate"}
                </button>
            </div>
        </div>
    );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────
export default function NewMessagePage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("write");
    const [content, setContent] = useState("");
    const [frequency, setFrequency] = useState(14);
    const [gracePeriod, setGracePeriod] = useState(7);
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    async function handleSubmit(vaultPassword: string) {
        setSubmitting(true);
        setSubmitError("");
        try {
            const lockedPayload = await SecurityService.lockMessage(content, vaultPassword);
            await createLockedMessage({
                encryptedBlob: lockedPayload.encryptedBlob,
                temporaryPublicKey: lockedPayload.temporaryPublicKey,
                temporaryPrivateKeyEncrypted: lockedPayload.temporaryPrivateKeyEncrypted,
                encryptedSymmetricKey: lockedPayload.encryptedSymmetricKey,
                releaseAfter: frequency,
                recipients: recipients.map(r => ({ email: r.email, name: r.name }))
            });
            router.push("/dashboard");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setSubmitError("Failed to encrypt and lock message: " + msg);
            setSubmitting(false);
        }
    }

    return (
        <>
            <header className="ic-topbar">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        onClick={() => router.back()}
                        className="ic-btn ic-btn-ghost ic-btn-sm"
                        style={{ padding: "6px 8px" }}
                    >
                        <ArrowLeft size={14} strokeWidth={1.75} />
                    </button>
                    <Stepper current={step} />
                </div>
                <button className="ic-btn ic-btn-secondary ic-btn-sm" onClick={() => { }}>Save draft</button>
            </header>

            <div className="ic-page-content" style={{ maxWidth: 600, padding: "40px 24px" }}>
                {submitError && (
                    <div style={{ padding: "10px 14px", background: "var(--error-soft)", border: "1px solid rgba(196,74,58,0.2)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--error)", marginBottom: 16 }}>
                        {submitError}
                    </div>
                )}
                {step === "write" && (
                    <WriteStep content={content} onChange={setContent} onNext={() => setStep("checkin")} onSaveDraft={() => { }} />
                )}
                {step === "checkin" && (
                    <CheckinStep
                        frequency={frequency}
                        gracePeriod={gracePeriod}
                        onFrequencyChange={setFrequency}
                        onGracePeriodChange={setGracePeriod}
                        onNext={() => setStep("recipients")}
                        onBack={() => setStep("write")}
                    />
                )}
                {step === "recipients" && (
                    <RecipientsStep
                        recipients={recipients}
                        onAdd={(r) => setRecipients([...recipients, r])}
                        onRemove={(id) => setRecipients(recipients.filter((r) => r.id !== id))}
                        onNext={() => setStep("review")}
                        onBack={() => setStep("checkin")}
                    />
                )}
                {step === "review" && (
                    <ReviewStep
                        content={content}
                        frequency={frequency}
                        gracePeriod={gracePeriod}
                        recipients={recipients}
                        onBack={() => setStep("recipients")}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        onGoToStep={setStep}
                    />
                )}
            </div>
        </>
    );
}
