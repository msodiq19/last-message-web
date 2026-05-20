import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Mail, Plus, ArrowRight } from "lucide-react";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function daysUntil(dateStr: string) {
    return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}

export default async function MessagesPage() {
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
        .order("created_at", { ascending: false });

    const messages: any[] = messagesData || [];

    const hasMessages = messages && messages.length > 0;

    return (
        <>
            <header className="ic-topbar">
                <div>
                    <h1 style={{ fontSize: 18, fontWeight: 700 }}>Messages</h1>
                </div>
                <Link href="/messages/new" className="ic-btn ic-btn-primary ic-btn-sm" style={{ gap: 6 }}>
                    <Plus size={13} strokeWidth={2.5} />
                    New message
                </Link>
            </header>

            <div className="ic-page-content">
                {!hasMessages ? (
                    <div className="ic-card" style={{ maxWidth: 420, margin: "60px auto" }}>
                        <div className="ic-empty">
                            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(22,60,52,0.07)", marginBottom: 8 }}><Mail size={28} strokeWidth={1.25} color="var(--green-deep)" /></div>
                            <h2 className="ic-empty-title">No messages yet</h2>
                            <p className="ic-empty-desc">Write your first message for the people who matter.</p>
                            <Link href="/messages/new" className="ic-btn ic-btn-primary" style={{ gap: 6 }}>
                                <Plus size={13} strokeWidth={2.5} /> New message
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="ic-card">
                        {messages.map((msg) => {
                            const nextCheckin = new Date(new Date(msg.last_checkin).getTime() + ((msg.release_after || 14) * 86400000));
                            const days = daysUntil(nextCheckin.toISOString());
                            const recipientsList = msg.message_recipients?.map((mr: any) => mr.successors?.name).filter(Boolean).join(", ") || "No recipients";
                            const avatarLetter = (recipientsList !== "No recipients" ? recipientsList : "M").slice(0, 2).toUpperCase();

                            return (
                                <Link key={msg.id} href={`/messages/${msg.id}`} className="ic-message-item">
                                    <div className="ic-message-avatar">
                                        {avatarLetter}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                            <span style={{ fontWeight: 600, fontSize: 14 }} className="ic-truncate">
                                                To: {recipientsList}
                                            </span>
                                            <span className={`ic-badge ic-badge-${msg.status}`} style={{ flexShrink: 0 }}>
                                                <span className={`ic-dot ic-dot-${msg.status}`} />
                                                {msg.status === "active" ? "Active" : "Released"}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                            Check-in every {msg.release_after} days
                                        </p>
                                        {msg.status === "active" ? (
                                            <p style={{ fontSize: 12, color: days <= 3 ? "var(--error)" : "var(--text-muted)", marginTop: 1 }}>
                                                Next check-in: {formatDate(nextCheckin.toISOString())} · {days} days
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
                                                Released{msg.released_at ? ` on ${formatDate(msg.released_at)}` : ""}
                                            </p>
                                        )}
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
