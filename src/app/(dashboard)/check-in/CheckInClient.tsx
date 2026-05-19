"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { checkInNow, pauseMessage } from "./actions";

type Message = {
    id: string;
    release_after: number;
    last_checkin: string;
    message_recipients?: { successors?: { name: string } | null }[];
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}
function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    }) + " · " + new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit",
    });
}
function daysUntil(dateStr: string) {
    return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}

export default function CheckInClient({
    messages,
    soonest,
    nextCheckinDate,
    daysLeft,
}: {
    messages: Message[];
    soonest: Message | null;
    nextCheckinDate: Date | null;
    daysLeft: number | null;
}) {
    const [pending, startTransition] = useTransition();
    const [done, setDone] = useState(false);
    const [pauseDays, setPauseDays] = useState(7);
    const [pausingId, setPausingId] = useState<string | null>(null);

    function handleCheckIn() {
        startTransition(async () => {
            await checkInNow();
            setDone(true);
        });
    }

    function handlePause(messageId: string) {
        startTransition(async () => {
            await pauseMessage(messageId, pauseDays);
        });
    }

    if (!soonest) {
        return (
            <div className="ic-card">
                <div className="ic-empty">
                    <div style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 72, height: 72, borderRadius: "50%",
                        background: "var(--success-soft)", marginBottom: 8,
                    }}>
                        <CheckCircle2 size={32} strokeWidth={1.25} color="var(--success)" />
                    </div>
                    <h2 className="ic-empty-title">No active messages</h2>
                    <p className="ic-empty-desc">Create a message to start your check-in timer.</p>
                    <Link href="/messages/new" className="ic-btn ic-btn-primary">Write a message</Link>
                </div>
            </div>
        );
    }

    if (done) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="ic-card" style={{ padding: 28, textAlign: "center" }}>
                    <div style={{
                        margin: "0 auto 20px", width: 72, height: 72, borderRadius: "50%",
                        background: "var(--success-soft)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                    }}>
                        <CheckCircle2 size={32} strokeWidth={1.25} color="var(--success)" />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        You&apos;re all set.
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
                        Your timer has been reset. All active messages are secure.
                    </p>
                    <div style={{
                        padding: "12px 16px", background: "var(--cream-warm)",
                        borderRadius: "var(--radius)", fontSize: 13,
                        color: "var(--text-secondary)", marginBottom: 20,
                    }}>
                        Next check-in due:{" "}
                        <strong>{formatDate(new Date(Date.now() + (soonest.release_after * 86400000)).toISOString())}</strong>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <Link href="/messages" className="ic-btn ic-btn-secondary" style={{ flex: 1 }}>View messages</Link>
                        <Link href="/dashboard" className="ic-btn ic-btn-secondary" style={{ flex: 1 }}>Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    const isUrgent = daysLeft !== null && daysLeft <= 3;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Main check-in card */}
            <div className="ic-card" style={{ padding: 28, textAlign: "center" }}>
                <div style={{
                    margin: "0 auto 20px", width: 80, height: 80, borderRadius: "50%",
                    background: isUrgent ? "var(--error-soft)" : "rgba(22,60,52,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <CheckCircle2 size={32} strokeWidth={1.25} color={isUrgent ? "var(--error)" : "var(--green-deep)"} />
                </div>

                {isUrgent && (
                    <p style={{
                        fontSize: 12, fontWeight: 600, color: "var(--error)",
                        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
                    }}>
                        Check-in due soon
                    </p>
                )}

                <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {daysLeft !== null
                        ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} until your next check-in`
                        : "Check in now"}
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
                    {nextCheckinDate
                        ? `Due ${formatDate(nextCheckinDate.toISOString())}`
                        : "Keep your messages secure by checking in regularly."}
                </p>

                <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginBottom: 20, padding: "12px 16px",
                    background: "var(--cream-warm)", borderRadius: "var(--radius)", fontSize: 13,
                }}>
                    <div>
                        <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>Frequency</p>
                        <p style={{ fontWeight: 600 }}>Every {soonest.release_after} days</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>Last checked in</p>
                        <p style={{ fontWeight: 600 }}>{formatDate(soonest.last_checkin)}</p>
                    </div>
                </div>

                <button
                    onClick={handleCheckIn}
                    disabled={pending}
                    className="ic-btn ic-btn-primary ic-btn-full ic-btn-lg"
                    style={{ marginBottom: 8 }}
                >
                    {pending ? "Checking in…" : "Check in now"}
                </button>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    This resets the timer for all your active messages.
                </p>
            </div>

            {/* Snooze */}
            <div className="ic-card" style={{ padding: 20 }}>
                <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Need more time?</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
                    Extend your deadline if you won&apos;t be able to check in on time.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <select
                        className="ic-input"
                        style={{ flex: 1 }}
                        value={pauseDays}
                        onChange={(e) => setPauseDays(Number(e.target.value))}
                    >
                        <option value={3}>3 more days</option>
                        <option value={7}>7 more days</option>
                        <option value={14}>14 more days</option>
                    </select>
                    <button
                        onClick={() => {
                            if (soonest) {
                                setPausingId(soonest.id);
                                handlePause(soonest.id);
                            }
                        }}
                        disabled={pending}
                        className="ic-btn ic-btn-secondary"
                    >
                        Extend
                    </button>
                </div>
            </div>

            {/* Active messages list */}
            <div className="ic-card" style={{ padding: 0 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text-secondary)" }}>
                        Active messages — {messages.length}
                    </p>
                </div>
                {messages.map((msg) => {
                    const nextDue = new Date(new Date(msg.last_checkin).getTime() + msg.release_after * 86400000);
                    const days = daysUntil(nextDue.toISOString());
                    const urgent = days <= 3;
                    const recipients = msg.message_recipients
                        ?.map((mr) => mr.successors?.name)
                        .filter(Boolean).join(", ") || "No recipients";
                    return (
                        <Link key={msg.id} href={`/messages/${msg.id}`} className="ic-message-item">
                            <div className="ic-message-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                                {recipients.slice(0, 2).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: 13 }} className="ic-truncate">
                                    To: {recipients}
                                </p>
                                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                    Last checked in: {formatDateTime(msg.last_checkin)}
                                </p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: urgent ? "var(--error)" : "var(--text-muted)" }}>
                                    {days}d left
                                </p>
                            </div>
                            <ChevronRight size={14} strokeWidth={1.75} color="var(--text-muted)" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
