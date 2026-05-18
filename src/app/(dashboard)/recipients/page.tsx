import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function RecipientsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: messagesData } = await supabase
        .from("messages")
        .select(`
            id, status, release_after, last_checkin,
            message_recipients (
                successors ( name, email )
            )
        `)
        .eq("user_id", user?.id || "");

    const messages: any[] = messagesData || [];

    // Group by recipient email for address-book style
    const recipientMap = new Map<string, typeof messages>();
    messages.forEach((m) => {
        m.message_recipients?.forEach((mr: any) => {
            const email = mr.successors?.email;
            if (email) {
                const current = recipientMap.get(email) || [];
                recipientMap.set(email, [...current, m]);
            }
        });
    });

    const recipients = Array.from(recipientMap.entries());

    return (
        <>
            <header className="ic-topbar">
                <h1 style={{ fontSize: 18, fontWeight: 700 }}>Recipients</h1>
                <Link href="/messages/new" className="ic-btn ic-btn-primary ic-btn-sm" style={{ gap: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add recipient
                </Link>
            </header>

            <div className="ic-page-content">
                {recipients.length === 0 ? (
                    <div className="ic-card" style={{ maxWidth: 420, margin: "60px auto" }}>
                        <div className="ic-empty">
                            <div style={{ fontSize: 48 }}>👤</div>
                            <h2 className="ic-empty-title">No recipients yet</h2>
                            <p className="ic-empty-desc">Recipients are added when you create a message.</p>
                            <Link href="/messages/new" className="ic-btn ic-btn-primary">Write a message</Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                            About recipients: Recipients receive a secure link to your message. They never need an account where your message is stored.
                        </div>
                        <div className="ic-card" style={{ padding: 0 }}>
                            {recipients.map(([email, msgs]) => {
                                // Extract the name for this recipient from the first message mapping
                                const name = msgs[0]?.message_recipients?.find((mr: any) => mr.successors?.email === email)?.successors?.name || email.split("@")[0];

                                return (
                                    <div key={email} className="ic-message-item" style={{ cursor: "default" }}>
                                        <div className="ic-message-avatar">
                                            {name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 600, fontSize: 14 }} className="ic-truncate">{name}</p>
                                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{email}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{msgs.length} message{msgs.length > 1 ? "s" : ""}</span>
                                            <span className="ic-badge ic-badge-active" style={{ fontSize: 11 }}>Can view</span>
                                            <button className="ic-btn ic-btn-ghost ic-btn-sm" style={{ padding: "4px 6px" }}>···</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
