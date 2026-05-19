import { createClient } from "@/lib/supabase/server";
import CheckInClient from "./CheckInClient";

function daysUntil(dateStr: string) {
    return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}

export default async function CheckinPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: messagesData } = await supabase
        .from("messages")
        .select(`
            id, release_after, last_checkin,
            message_recipients (
                successors ( name )
            )
        `)
        .eq("user_id", user?.id || "")
        .eq("status", "active");

    const messages: any[] = messagesData || [];

    // Find the message due soonest (smallest daysUntil next check-in)
    const withDue = messages.map((m) => {
        const nextDue = new Date(
            new Date(m.last_checkin).getTime() + m.release_after * 86400000
        );
        return { ...m, daysLeft: daysUntil(nextDue.toISOString()), nextDue };
    });
    withDue.sort((a, b) => a.daysLeft - b.daysLeft);

    const soonest = withDue[0] ?? null;
    const nextCheckinDate = soonest ? soonest.nextDue : null;
    const daysLeft = soonest ? soonest.daysLeft : null;

    return (
        <>
            <header className="ic-topbar">
                <div>
                    <h1 className="ic-page-title">Check-in</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                        Keep your messages active by checking in regularly.
                    </p>
                </div>
            </header>

            <div className="ic-page-content" style={{ maxWidth: 560 }}>
                <CheckInClient
                    messages={withDue}
                    soonest={soonest}
                    nextCheckinDate={nextCheckinDate}
                    daysLeft={daysLeft}
                />
            </div>
        </>
    );
}
