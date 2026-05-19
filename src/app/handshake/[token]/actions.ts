"use server";

import { createClient } from "@/lib/supabase/server";

export async function completeHandshake(
    token: string,
    permanentPublicKey: string,
    permanentPrivateKeyEncrypted: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    // 1. Look up the message_recipient by handshake_token
    const { data: mr, error: mrErr } = await supabase
        .from("message_recipients")
        .select("id, successor_id, status")
        .eq("handshake_token", token)
        .single();

    if (mrErr || !mr) return { success: false, error: "Invalid handshake token." };
    if (mr.status !== "pending") return { success: false, error: "Handshake already completed." };

    // 2. Save public key + encrypted private key on the successor record
    const { error: sucErr } = await supabase
        .from("successors")
        .update({
            public_key: permanentPublicKey,
            private_key_enc: permanentPrivateKeyEncrypted,
        } as any)
        .eq("id", mr.successor_id);

    if (sucErr) return { success: false, error: "Failed to save keys." };

    // 3. Mark handshake complete
    const { error: statusErr } = await supabase
        .from("message_recipients")
        .update({ status: "handshake_complete" } as any)
        .eq("id", mr.id);

    if (statusErr) return { success: false, error: "Failed to update status." };

    return { success: true };
}
