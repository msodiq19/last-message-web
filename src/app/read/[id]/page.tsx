import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReadClient from "./ReadClient";

export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Validate the recipient has access and the message is delivered
  // URL contains message_recipients.id (sent by cron)
  const { data: recipient } = await supabase
    .from("message_recipients")
    .select(`
      id, status, encrypted_key,
      messages ( encrypted_blob, sender_email ),
      successors ( id, private_key_enc )
    `)
    .eq("id", id)
    .single();

  const recipientData: any = recipient;

  if (!recipientData || recipientData.status !== "delivered") {
    return (
      <div className="ic-auth-page" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔏</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Message unavailable</h1>
          <p style={{ color: "var(--text-muted)" }}>This message is either securely vaulted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  const senderEmail = recipientData.messages?.sender_email ?? "Someone";

  return (
    <ReadClient
      messageId={id}
      senderName={senderEmail.split("@")[0]}
      encryptedBlob={recipientData.messages?.encrypted_blob}
      encryptedSymmetricKey={recipientData.encrypted_key}
      permanentPrivateKeyEncrypted={recipientData.successors?.private_key_enc}
    />
  );
}
