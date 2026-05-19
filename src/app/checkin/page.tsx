"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/lib/components/Logo";
import { CheckCircle2, XCircle, LogIn } from "lucide-react";

function CheckinContent() {
    const searchParams = useSearchParams();
    const ct = searchParams.get("ct");

    // Email-based check-in tokens are deprecated.
    // Users must check in through the authenticated dashboard.
    return (
        <div className="ic-auth-page">
            <div className="ic-auth-panel">
                <div className="ic-auth-logo">
                    <Logo href="/" size="sm" />
                </div>
                <div className="ic-auth-card" style={{ textAlign: "center" }}>
                    {ct ? (
                        <>
                            <div style={{
                                display: "inline-flex", alignItems: "center",
                                justifyContent: "center", width: 64, height: 64,
                                borderRadius: "50%", background: "var(--warning-soft)",
                                marginBottom: 20,
                            }}>
                                <XCircle size={26} strokeWidth={1.25} color="var(--warning)" />
                            </div>
                            <h1 className="ic-auth-title">Email check-ins are no longer active</h1>
                            <p className="ic-auth-subtitle" style={{ marginBottom: 24 }}>
                                For your security, check-ins now require you to be signed in.
                                Please log in to check in directly from your dashboard.
                            </p>
                        </>
                    ) : (
                        <>
                            <div style={{
                                display: "inline-flex", alignItems: "center",
                                justifyContent: "center", width: 64, height: 64,
                                borderRadius: "50%", background: "rgba(22,60,52,0.07)",
                                marginBottom: 20,
                            }}>
                                <CheckCircle2 size={26} strokeWidth={1.25} color="var(--green-deep)" />
                            </div>
                            <h1 className="ic-auth-title">Check in to your account</h1>
                            <p className="ic-auth-subtitle" style={{ marginBottom: 24 }}>
                                Sign in to reset your check-in timer and keep your messages active.
                            </p>
                        </>
                    )}
                    <Link href="/login" className="ic-btn ic-btn-primary ic-btn-full" style={{ gap: 8 }}>
                        <LogIn size={15} strokeWidth={1.75} />
                        Sign in to check in
                    </Link>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.55 }}>
                        Once signed in, go to <strong>Check-in</strong> in your dashboard sidebar.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CheckinPage() {
    return (
        <Suspense fallback={
            <div className="ic-auth-page">
                <div className="ic-auth-panel">
                    <div style={{ textAlign: "center", padding: 40 }}>
                        <div style={{
                            width: 32, height: 32, border: "2px solid var(--border)",
                            borderTopColor: "var(--green-deep)", borderRadius: "50%",
                            animation: "spin 0.8s linear infinite", margin: "0 auto",
                        }} />
                    </div>
                </div>
            </div>
        }>
            <CheckinContent />
        </Suspense>
    );
}
