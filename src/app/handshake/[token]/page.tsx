import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import HandshakeClient from "./HandshakeClient";

export default async function HandshakePage({ params }: { params: { token: string } }) {
    const supabase = await createClient();

    const { data: recipient } = await supabase
        .from("message_recipients")
        .select(`
      id, status,
      messages ( sender_email ),
      successors ( name, email )
    `)
        .eq("handshake_token", params.token)
        .single();

    if (!recipient || recipient.status !== "pending") {
        // If completed or token invalid, show standard error or not found
        return (
            <div className="ic-auth-page" style={{ alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Link invalid</h1>
                    <p style={{ color: "var(--text-muted)" }}>This request has either expired or already been accepted.</p>
                </div>
            </div>
        );
    }

    const senderEmail = recipient.messages?.sender_email ?? "Someone";
    const recipientName = recipient.successors?.name ?? "Recipient";

    return <HandshakeClient token={params.token} senderName={senderEmail.split("@")[0]} recipientName={recipientName} />;
}
