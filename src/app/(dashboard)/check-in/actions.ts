"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function checkInNow(messageId?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthenticated");

    const now = new Date().toISOString();

    if (messageId) {
        // Check in a specific message
        const { error } = await supabase
            .from("messages")
            .update({ last_checkin: now })
            .eq("id", messageId)
            .eq("user_id", user.id)
            .eq("status", "active");
        if (error) throw new Error(error.message);
    } else {
        // Check in ALL active messages at once
        const { error } = await supabase
            .from("messages")
            .update({ last_checkin: now })
            .eq("user_id", user.id)
            .eq("status", "active");
        if (error) throw new Error(error.message);
    }

    // Log activity
    await supabase.from("activity_logs").insert({
        user_id: user.id,
        type: "checkin",
        details: { message_id: messageId ?? "all" },
    } as any);

    revalidatePath("/check-in");
    revalidatePath("/dashboard");
}

export async function pauseMessage(messageId: string, days: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthenticated");

    // Extend last_checkin by `days` from now — effectively granting a grace
    const extendedCheckin = new Date(
        Date.now() - ((await getMessageFrequency(supabase, messageId)) - days) * 86400000
    ).toISOString();

    const { error } = await supabase
        .from("messages")
        .update({ last_checkin: extendedCheckin })
        .eq("id", messageId)
        .eq("user_id", user.id);

    if (error) throw new Error(error.message);

    await supabase.from("activity_logs").insert({
        user_id: user.id,
        type: "paused",
        details: { message_id: messageId, days },
    } as any);

    revalidatePath("/check-in");
    revalidatePath("/dashboard");
}

async function getMessageFrequency(supabase: any, messageId: string) {
    const { data } = await supabase
        .from("messages")
        .select("release_after")
        .eq("id", messageId)
        .single();
    return data?.release_after ?? 14;
}
