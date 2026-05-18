"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const passwordChecks = {
        length: password.length >= 8,
        number: /\d/.test(password),
        special: /[^a-zA-Z0-9]/.test(password),
    };

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSent(true);
        }
    }

    async function handleGoogleLogin() {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    }

    if (sent) {
        return (
            <div className="ic-auth-page">
                <div className="ic-auth-panel">
                    <div className="ic-auth-logo">
                        <div className="ic-auth-logo-mark">✉</div>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>in case</span>
                    </div>
                    <div className="ic-auth-card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                        <h1 className="ic-auth-title">Check your email</h1>
                        <p className="ic-auth-subtitle">
                            We&apos;ve sent a verification link to <strong>{email}</strong>.
                        </p>
                        <ul style={{ textAlign: "left", fontSize: 13, color: "var(--text-secondary)", listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                            {["Open the email from 'in case'", "Click the verification link", "Return here to continue"].map((step, i) => (
                                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ color: "var(--success)" }}>✓</span> {step}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setSent(false)}
                            className="ic-btn ic-btn-ghost ic-btn-full"
                            style={{ fontSize: 13 }}
                        >
                            Didn&apos;t receive it? Resend email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ic-auth-page">
            <div className="ic-auth-panel">
                <div className="ic-auth-logo">
                    <div className="ic-auth-logo-mark">✉</div>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>in case</span>
                </div>

                <div className="ic-auth-card">
                    <h1 className="ic-auth-title">Create your account</h1>
                    <p className="ic-auth-subtitle">Start protecting the words that matter.</p>

                    <button onClick={handleGoogleLogin} className="ic-btn ic-btn-secondary ic-btn-full" style={{ gap: 10, marginBottom: 4 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="ic-divider"><span>or</span></div>

                    <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label className="ic-label" htmlFor="name">Full name</label>
                            <input id="name" type="text" className="ic-input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="ic-label" htmlFor="email">Email</label>
                            <input id="email" type="email" className="ic-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                        </div>
                        <div>
                            <label className="ic-label" htmlFor="password">Password</label>
                            <input id="password" type="password" className="ic-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                            {password.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                                    {[
                                        { label: "8+ characters", ok: passwordChecks.length },
                                        { label: "One number", ok: passwordChecks.number },
                                        { label: "One special character", ok: passwordChecks.special },
                                    ].map(({ label, ok }) => (
                                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                                            <span style={{ color: ok ? "var(--success)" : "var(--text-muted)" }}>{ok ? "✓" : "○"}</span>
                                            <span style={{ color: ok ? "var(--success)" : "var(--text-muted)" }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div style={{ padding: "10px 13px", background: "var(--error-soft)", border: "1px solid rgba(196,74,58,0.2)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--error)" }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="ic-btn ic-btn-primary ic-btn-full ic-btn-lg" disabled={loading} style={{ marginTop: 4 }}>
                            {loading ? "Creating account…" : "Create account"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{ color: "var(--forest)", fontWeight: 500, textDecoration: "none" }}>Log in</Link>
                    </p>
                    <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.5 }}>
                        By continuing, you agree to our{" "}
                        <Link href="/terms" style={{ color: "var(--forest-muted)", textDecoration: "none" }}>Terms</Link>{" "}
                        &amp;{" "}
                        <Link href="/privacy" style={{ color: "var(--forest-muted)", textDecoration: "none" }}>Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
