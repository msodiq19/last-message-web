import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    // Fetch messages for this user
    const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("sender_email", user?.email ?? "")
        .order("created_at", { ascending: false })
        .limit(5);

    const hasMessages = messages && messages.length > 0;

    // Pick the soonest-due active message for the check-in ring
    const activeMessages = messages?.filter((m) => m.status === "active") ?? [];
    const soonestDue = activeMessages.length > 0
        ? activeMessages.reduce((a, b) => new Date(a.last_checkin) < new Date(b.last_checkin) ? a : b)
        : null;

    const nextCheckinDate = soonestDue
        ? new Date(new Date(soonestDue.last_checkin).getTime() + ((soonestDue.release_after || 14) * 24 * 60 * 60 * 1000))
        : null;
    const daysLeft = nextCheckinDate ? daysUntil(nextCheckinDate.toISOString()) : null;

    return (
        <>
            {/* Topbar */}
            <header className="ic-topbar">
                <div>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                        {greeting}, <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{firstName}</span>
                    </span>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
                        {hasMessages ? "Here's your today." : "Start by writing your first message."}
                    </p>
                </div>
                <Link href="/messages/new" className="ic-btn ic-btn-primary ic-btn-sm" style={{ gap: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    New message
                </Link>
            </header>

            <div className="ic-page-content">
                {!hasMessages ? (
                    /* ── Empty State ── */
                    <div className="ic-card" style={{ maxWidth: 480, margin: "60px auto" }}>
                        <div className="ic-empty">
                            <div style={{ fontSize: 52 }}>✉️</div>
                            <h2 className="ic-empty-title">No messages yet</h2>
                            <p className="ic-empty-desc">Create your first message for the people who matter.</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start", textAlign: "left", width: "100%" }}>
                                {["Write something meaningful", "Set your check-in interval", "Add people you trust"].map((item) => (
                                    <span key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                                        <span style={{ color: "var(--success)" }}>✓</span> {item}
                                    </span>
                                ))}
                            </div>
                            <Link href="/messages/new" className="ic-btn ic-btn-primary ic-btn-lg" style={{ marginTop: 8 }}>
                                Create your first message
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
                        {/* Left column */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Messages */}
                            <div className="ic-card">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px" }}>
                                    <span style={{ fontWeight: 600, fontSize: 15 }}>Your messages</span>
                                    <Link href="/messages" style={{ fontSize: 13, color: "var(--forest)", textDecoration: "none" }}>View all</Link>
                                </div>
                                {messages?.map((msg) => {
                                    const nextCheckin = new Date(new Date(msg.last_checkin).getTime() + ((msg.release_after || 14) * 24 * 60 * 60 * 1000));
                                    const days = daysUntil(nextCheckin.toISOString());
                                    const initials = getInitials(msg.recipient_email?.split("@")[0] ?? "R");
                                    return (
                                        <Link key={msg.id} href={`/messages/${msg.id}`} className="ic-message-item">
                                            <div className="ic-message-avatar">{initials}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span style={{ fontWeight: 600, fontSize: 14 }} className="ic-truncate">
                                                        To: {msg.recipient_email}
                                                    </span>
                                                    <span className={`ic-badge ic-badge-${msg.status}`} style={{ flexShrink: 0 }}>
                                                        <span className={`ic-dot ic-dot-${msg.status}`} />
                                                        {msg.status === "active" ? "Active" : "Released"}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                                                    Check-in every {msg.release_after} days
                                                </p>
                                                <p style={{ fontSize: 12, color: days <= 3 ? "var(--error)" : "var(--text-muted)", marginTop: 1 }}>
                                                    Next check-in: {formatDate(nextCheckin.toISOString())}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right column — Check-in status */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="ic-card" style={{ padding: 20 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>Check-in status</p>
                                {daysLeft !== null && (
                                    <>
                                        <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 16px" }}>
                                            <svg width="90" height="90" viewBox="0 0 90 90">
                                                <circle cx="45" cy="45" r="38" fill="none" stroke="var(--border)" strokeWidth="6" />
                                                <circle
                                                    cx="45" cy="45" r="38" fill="none"
                                                    stroke="var(--forest)"
                                                    strokeWidth="6"
                                                    strokeDasharray={`${2 * Math.PI * 38}`}
                                                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - Math.min(daysLeft / 14, 1))}`}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 45 45)"
                                                    style={{ transition: "stroke-dashoffset 1s var(--ease)" }}
                                                />
                                            </svg>
                                            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
                                                {daysLeft}
                                            </span>
                                        </div>
                                        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
                                            Days until next check-in
                                        </p>
                                        {nextCheckinDate && (
                                            <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                                                Due {formatDate(nextCheckinDate.toISOString())}
                                            </p>
                                        )}
                                    </>
                                )}
                                <Link href="/check-in" className="ic-btn ic-btn-primary ic-btn-full" style={{ marginTop: 16 }}>
                                    Manage check-in
                                </Link>
                            </div>

                            {/* Recent activity summary */}
                            <div className="ic-card" style={{ padding: 16 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>Recent activity</p>
                                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                    <Link href="/activity" style={{ color: "var(--forest)", textDecoration: "none" }}>View all activity →</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
