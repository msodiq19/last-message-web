import { createClient } from "@/lib/supabase/server";
import ActivityClient from "./ActivityClient";

export default async function ActivityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: logs } = await supabase
        .from("activity_logs")
        .select("id, type, details, created_at")
        .eq("user_id", user?.id || "")
        .order("created_at", { ascending: false })
        .limit(100);

    return (
        <>
            <header className="ic-topbar">
                <div>
                    <h1 className="ic-page-title">Activity</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                        A record of check-ins, reminders, and deliveries.
                    </p>
                </div>
            </header>
            <div className="ic-page-content">
                <ActivityClient logs={logs || []} />
            </div>
        </>
    );
}
