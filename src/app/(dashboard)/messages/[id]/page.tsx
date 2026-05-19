import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { TrustBadge } from "@/lib/components/TrustBadge";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("messages")
        .select(`
      *,
      message_recipients (
        id, status, handshake_token,
        successors ( name, email, public_key )
      )
    `)
        .eq("id", id)
        .single();

    const message: any = data;

    if (!message || message.user_id !== user?.id) {
        console.error("404 Triggered! message exists:", !!message, "user_id matches:", message?.user_id === user?.id);
        return notFound();
    }

    const nextCheckin = new Date(new Date(message.last_checkin).getTime() + ((message.release_after || 14) * 86400000));
    const daysLeft = Math.max(0, Math.ceil((nextCheckin.getTime() - Date.now()) / 86400000));

    return (
        <>
            <header className="ic-topbar">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Link href="/messages" className="ic-btn ic-btn-ghost ic-btn-sm" style={{ padding: "6px 8px" }}><ArrowLeft size={14} strokeWidth={1.75} /></Link>
                    <h1 style={{ fontSize: 16, fontWeight: 600 }}>Message details</h1>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="ic-btn ic-btn-ghost ic-btn-sm">Pause timer</button>
                    <button className="ic-btn ic-btn-secondary ic-btn-sm">Edit message</button>
                </div>
            </header>

            <div className="ic-page-content" style={{ maxWidth: 680 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>Message status</h2>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                            Created on {new Date(message.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <span className={`ic-badge ic-badge-${message.status}`} style={{ fontSize: 13, padding: "6px 12px" }}>
                        <span className={`ic-dot ic-dot-${message.status}`} />
                        {message.status === "active" ? "Active" : "Released"}
                    </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    <div className="ic-card" style={{ padding: 20 }}>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Check-in frequency</p>
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Every {message.release_after} days</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>Last check-in</p>
                        <p style={{ fontSize: 14 }}>{new Date(message.last_checkin).toLocaleDateString()}</p>
                    </div>

                    <div className="ic-card" style={{ padding: 20, background: daysLeft <= 3 ? "var(--error-soft)" : "var(--surface)" }}>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Next check-in due</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: daysLeft <= 3 ? "var(--error)" : "var(--text-primary)" }}>{daysLeft} days</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Due {nextCheckin.toLocaleDateString()}</p>
                    </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recipients</h3>
                <div className="ic-card" style={{ padding: 0, marginBottom: 24 }}>
                    {message.message_recipients?.length === 0 ? (
                        <p style={{ padding: 16, fontSize: 13, color: "var(--text-muted)" }}>No recipients added.</p>
                    ) : message.message_recipients?.map((mr: any) => (
                        <div key={mr.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                            <div className="ic-message-avatar">{mr.successors.name.slice(0, 2).toUpperCase()}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: 14 }}>{mr.successors.name}</p>
                                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{mr.successors.email}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                {mr.status === 'pending' && <span className="ic-badge ic-badge-paused">Handshake pending</span>}
                                {mr.status === 'handshake_complete' && <span className="ic-badge ic-badge-active">Ready</span>}
                                {mr.status === 'delivered' && <span className="ic-badge ic-badge-released">Delivered</span>}
                                {mr.status === 'read' && <span className="ic-badge ic-badge-active">Read</span>}
                            </div>
                        </div>
                    ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Message Privacy</h3>
                <div className="ic-card" style={{ padding: 16, background: "var(--cream-warm)" }}>
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "rgba(22,60,52,0.07)", flexShrink: 0, marginTop: 2 }}><Lock size={16} strokeWidth={1.5} color="var(--green-deep)" /></div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>End-to-end Encrypted</p>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>
                                Your message is stored securely on our servers using zero-knowledge encryption.
                                We cannot read your message, nor can we read the keys used to encrypt it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
