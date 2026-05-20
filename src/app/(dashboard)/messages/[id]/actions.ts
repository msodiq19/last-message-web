"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * After the sender runs grantAccessToSuccessor() client-side with their vault
 * password, this action saves the new encrypted key to the DB and marks
 * the recipient as key_transferred (still handshake_complete status, but key is valid now).
 */
export async function saveTransferredKey(
    messageRecipientId: string,
    newEncryptedKey: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthenticated" };

    // Verify the sender owns this message recipient (via message ownership)
    const { data: mr } = await supabase
        .from("message_recipients")
        .select("id, messages ( user_id )")
        .eq("id", messageRecipientId)
        .single();

    if (!mr || (mr as any).messages?.user_id !== user.id) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("message_recipients")
        .update({ encrypted_key: newEncryptedKey } as any)
        .eq("id", messageRecipientId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/messages`);
    return { success: true };
}
