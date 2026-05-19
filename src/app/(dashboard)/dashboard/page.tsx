import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Mail, Plus, Check, ArrowRight, Lock, Shield } from "lucide-react";

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatRelative(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return formatDate(dateStr);
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

    const { data: messagesData } = await supabase
        .from("messages")
        .select(`*, message_recipients ( successors ( name ) )`)
        .eq("user_id", user?.id || "")
        .order("created_at", { ascending: false })
        .limit(5);

    const messages: any[] = messagesData || [];
    const hasMessages = messages.length > 0;

    const activeMessages = messages.filter((m) => m.status === "active");
    const soonestDue = activeMessages.length > 0
        ? activeMessages.reduce((a, b) => new Date(a.last_checkin) < new Date(b.last_checkin) ? a : b)
        : null;

    const nextCheckinDate = soonestDue
        ? new Date(new Date(soonestDue.last_checkin).getTime() + ((soonestDue.release_after || 14) * 24 * 60 * 60 * 1000))
        : null;
    const daysLeft = nextCheckinDate ? daysUntil(nextCheckinDate.toISOString()) : null;
    const totalDays = soonestDue?.release_after || 14;
    const ringProgress = daysLeft !== null ? Math.min(daysLeft / totalDays, 1) : 0;

    return (
        <>
            {/* Topbar */}
            <header className="ic-topbar">
                <div>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                        {greeting}, <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{firstName}</span>
                    </span>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
                        {hasMessages ? "Here is your overview for today." : "Start by writing your first message."}
                    </p>
                </div>
                <Link href="/messages/new" className="ic-btn ic-btn-primary ic-btn-sm" style={{ gap: 6 }}>
                    <Plus size={13} strokeWidth={2.5} />
                    New message
                </Link>
            </header>

            <div className="ic-page-content">
                {!hasMessages ? (
                    /* ── Empty State ── */
                    <div className="ic-card" style={{ maxWidth: 480, margin: "60px auto" }}>
                        <div className="ic-empty">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(22,60,52,0.07)", marginBottom: 8 }}>
                                <Mail size={28} strokeWidth={1.25} color="var(--green-deep)" />
                            </div>
                            <h2 className="ic-empty-title">No messages yet</h2>
                            <p className="ic-empty-desc">Create your first message for the people who matter.</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start", textAlign: "left", width: "100%" }}>
                                {["Write something meaningful", "Set your check-in interval", "Add people you trust"].map((item) => (
                                    <span key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                                        <Check size={13} strokeWidth={2} color="var(--success)" /> {item}
                                    </span>
                                ))}
                            </div>
                            <Link href="/messages/new" className="ic-btn ic-btn-primary ic-btn-lg" style={{ marginTop: 8 }}>
                                Create your first message
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
                        {/* ── Left column: Messages ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="ic-card">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px" }}>
                                    <span style={{ fontWeight: 600, fontSize: 15 }}>Your messages</span>
                                    <Link href="/messages" style={{ fontSize: 13, color: "var(--green-deep)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                                        View all <ArrowRight size={12} strokeWidth={2} />
                                    </Link>
                                </div>
                                {messages.map((msg) => {
                                    const lastCheckin = new Date(msg.last_checkin);
                                    const nextCheckin = new Date(lastCheckin.getTime() + ((msg.release_after || 14) * 24 * 60 * 60 * 1000));
                                    const days = daysUntil(nextCheckin.toISOString());
                                    const progressPct = Math.round((1 - days / (msg.release_after || 14)) * 100);
                                    const recipientsList = msg.message_recipients?.map((mr: any) => mr.successors?.name).filter(Boolean).join(", ") || "No recipients";
                                    const initials = getInitials(recipientsList !== "No recipients" ? recipientsList : "M");
                                    const isUrgent = days <= 3 && msg.status === "active";

                                    return (
                                        <Link key={msg.id} href={`/messages/${msg.id}`} className="ic-message-item">
                                            <div className="ic-message-avatar">{initials}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                                                    <span style={{ fontWeight: 600, fontSize: 14 }} className="ic-truncate">
                                                        To: {recipientsList}
                                                    </span>
                                                    <span className={`ic-badge ic-badge-${msg.status}`} style={{ flexShrink: 0, fontSize: 11 }}>
                                                        <span className={`ic-dot ic-dot-${msg.status}`} />
                                                        {msg.status === "active" ? "Active" : msg.status === "paused" ? "Paused" : "Released"}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
                                                    Check-in every {msg.release_after} days
                                                </p>
                                                {/* Progress bar */}
                                                <div style={{ height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden", marginBottom: 5 }}>
                                                    <div style={{
                                                        height: "100%",
                                                        width: `${Math.min(progressPct, 100)}%`,
                                                        background: isUrgent ? "var(--error)" : "var(--green-deep)",
                                                        borderRadius: 2,
                                                        transition: "width 0.4s ease",
                                                    }} />
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                                                    <span>Last check-in: {formatRelative(lastCheckin.toISOString())}</span>
                                                    <span style={{ color: isUrgent ? "var(--error)" : "var(--text-muted)" }}>
                                                        Next: {formatDate(nextCheckin.toISOString())}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Right column ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {/* Check-in ring */}
                            <div className="ic-card" style={{ padding: 24, textAlign: "center" }}>
                                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 16 }}>
                                    Check-in status
                                </p>
                                {daysLeft !== null ? (
                                    <>
                                        <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 14px" }}>
                                            <svg width="110" height="110" viewBox="0 0 110 110">
                                                <circle cx="55" cy="55" r="46" fill="none" stroke="var(--border)" strokeWidth="7" />
                                                <circle
                                                    cx="55" cy="55" r="46"
                                                    fill="none"
                                                    stroke={daysLeft <= 3 ? "var(--error)" : "var(--green-deep)"}
                                                    strokeWidth="7"
                                                    strokeDasharray={`${2 * Math.PI * 46}`}
                                                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - ringProgress)}`}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 55 55)"
                                                    style={{ transition: "stroke-dashoffset 1s var(--ease)" }}
                                                />
                                            </svg>
                                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: daysLeft <= 3 ? "var(--error)" : "var(--text-primary)" }}>{daysLeft}</span>
                                                <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>days left</span>
                                            </div>
                                        </div>
                                        {nextCheckinDate && (
                                            <>
                                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Next check-in due</p>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>{formatDate(nextCheckinDate.toISOString())}</p>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: "50%", background: "rgba(22,60,52,0.07)", margin: "0 auto 16px" }}>
                                        <Check size={24} strokeWidth={1.5} color="var(--success)" />
                                    </div>
                                )}
                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
                                    {daysLeft !== null ? "You are all set. We will keep your messages secure." : "No active messages"}
                                </p>
                                <Link href="/check-in" className="ic-btn ic-btn-primary ic-btn-full ic-btn-sm">
                                    Manage check-in
                                </Link>
                            </div>

                            {/* Privacy card */}
                            <div className="ic-card" style={{ padding: 16, background: "var(--green-deep)", border: "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <Lock size={13} strokeWidth={1.75} color="rgba(246,241,232,0.7)" />
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--cream)" }}>Your privacy is everything.</p>
                                </div>
                                <p style={{ fontSize: 12, color: "rgba(246,241,232,0.65)", lineHeight: 1.55 }}>
                                    We do not store your messages. They stay encrypted — always.
                                </p>
                                <Link href="/security" style={{ fontSize: 11, color: "rgba(246,241,232,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginTop: 10 }}>
                                    <Shield size={10} strokeWidth={2} />
                                    Learn more
                                </Link>
                            </div>

                            {/* Recent activity */}
                            <div className="ic-card" style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Recent activity</p>
                                    <Link href="/activity" style={{ fontSize: 12, color: "var(--green-deep)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                                        View all <ArrowRight size={11} strokeWidth={2} />
                                    </Link>
                                </div>
                                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Activity from the last 7 days will appear here.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
