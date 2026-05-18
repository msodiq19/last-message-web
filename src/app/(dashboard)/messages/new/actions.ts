"use server";

import { createClient } from "@/lib/supabase/server";

export async function createLockedMessage(payload: {
    encryptedBlob: string;
    temporaryPublicKey: string;
    temporaryPrivateKeyEncrypted: string;
    encryptedSymmetricKey: string;
    releaseAfter: number;
    recipients: { email: string; name: string }[];
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthenticated");

    // 1. Insert Profile if missing (upsert)
    await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email!,
    });

    // 2. Insert Message
    const { data: msg_data, error: msg_err } = await supabase.from("messages").insert({
        user_id: user.id,
        sender_email: user.email!, // legacy fallback field
        encrypted_blob: payload.encryptedBlob,
        temporary_public_key: payload.temporaryPublicKey,
        temporary_private_key_enc: payload.temporaryPrivateKeyEncrypted,
        release_after: payload.releaseAfter,
        status: "active"
    } as any).select("id").single();

    if (msg_err) throw new Error("Failed to create message: " + msg_err.message);

    const message_id = msg_data.id;

    // 3. Process Recipients
    for (const rec of payload.recipients) {
        // Upsert successor for this user
        let successorId;
        const { data: exist } = await supabase
            .from("successors")
            .select("id")
            .eq("user_id", user.id)
            .eq("email", rec.email)
            .single();

        if (exist) {
            successorId = exist.id;
        } else {
            const { data: ins } = await supabase.from("successors").insert({
                user_id: user.id,
                email: rec.email,
                name: rec.name
            } as any).select("id").single();
            successorId = ins!.id;
        }

        // Insert Message Recipient Lockbox
        await supabase.from("message_recipients").insert({
            message_id,
            successor_id: successorId,
            encrypted_key: payload.encryptedSymmetricKey,
            handshake_token: crypto.randomUUID().slice(0, 16),
            status: "pending"
        } as any);
    }

    // 4. Log Activity
    await supabase.from("activity_logs").insert({
        user_id: user.id,
        type: "message_created",
        details: { recipients_count: payload.recipients.length }
    } as any);

    return { success: true, messageId: message_id };
}
