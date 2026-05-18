import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " · " +
        new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default async function CheckinPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: messagesData } = await supabase
        .from("messages")
        .select(`
            *,
            message_recipients (
                successors ( name )
            )
        `)
        .eq("user_id", user?.id || "")
        .eq("status", "active")
        .order("last_checkin", { ascending: true });

    const messages: any[] = messagesData || [];
    const soonest = messages?.[0];
    const daysPerFreq = soonest?.release_after || 14;
    const nextCheckinDate = soonest && soonest.last_checkin
        ? new Date(new Date(soonest.last_checkin).getTime() + daysPerFreq * 86400000)
        : null;

    return (
        <>
            <header className="ic-topbar">
                <h1 style={{ fontSize: 18, fontWeight: 700 }}>Check-in</h1>
            </header>

            <div className="ic-page-content" style={{ maxWidth: 560 }}>
                {!soonest ? (
                    <div className="ic-card">
                        <div className="ic-empty">
                            <div style={{ fontSize: 48 }}>✅</div>
                            <h2 className="ic-empty-title">You&apos;re all set</h2>
                            <p className="ic-empty-desc">No active messages require a check-in right now.</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Main check-in card */}
                        <div className="ic-card" style={{ padding: 28, textAlign: "center" }}>
                            <div style={{ margin: "0 auto 16px", width: 80, height: 80, borderRadius: "50%", background: "var(--success-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                                ✅
                            </div>
                            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>You&apos;re all set</h2>
                            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
                                Thanks for checking in. We&apos;ll keep your messages secure.
                            </p>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, padding: "12px 16px", background: "var(--cream-warm)", borderRadius: "var(--radius)", fontSize: 13 }}>
                                <div>
                                    <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>Next check-in due</p>
                                    <p style={{ fontWeight: 600 }}>{nextCheckinDate ? nextCheckinDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>Check-in frequency</p>
                                    <p style={{ fontWeight: 600 }}>Every {daysPerFreq} days</p>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 10 }}>
                                <Link href="/messages" className="ic-btn ic-btn-secondary" style={{ flex: 1 }}>View messages</Link>
                                <Link href="/messages/new" className="ic-btn ic-btn-secondary" style={{ flex: 1 }}>Manage check-in</Link>
                            </div>
                        </div>

                        {/* Snooze card */}
                        <div className="ic-card" style={{ padding: 20 }}>
                            <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Need a break?</h3>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>Pause your timer if you won&apos;t be able to check in.</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <select className="ic-input" style={{ flex: 1 }}>
                                    <option value="3">3 days</option>
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                </select>
                                <button className="ic-btn ic-btn-secondary">Pause timer</button>
                            </div>
                        </div>

                        {/* Messages using this checkin */}
                        <div className="ic-card" style={{ padding: 0 }}>
                            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                                <p style={{ fontWeight: 600, fontSize: 14 }}>Active messages</p>
                            </div>
                            {messages?.map((msg) => {
                                const recipientsList = msg.message_recipients?.map((mr: any) => mr.successors?.name).filter(Boolean).join(", ") || "No recipients";
                                const avatarLetter = (recipientsList !== "No recipients" ? recipientsList : "M").slice(0, 2).toUpperCase();

                                return (
                                    <Link key={msg.id} href={`/messages/${msg.id}`} className="ic-message-item">
                                        <div className="ic-message-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                                            {avatarLetter}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 600, fontSize: 13 }} className="ic-truncate">To: {recipientsList}</p>
                                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Last checked in: {formatDate(msg.last_checkin)}</p>
                                        </div>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                                        </svg>
                                    </Link>
                                );
                            })}
                        </div>

                        <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
                            You can view your messages anytime.{" "}
                            <Link href="/messages" style={{ color: "var(--forest)", textDecoration: "none" }}>View</Link>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
