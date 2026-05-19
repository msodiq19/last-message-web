"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Paperclip, UserPlus, MessageSquare, Clock } from "lucide-react";

type ActivityLog = {
    id: string;
    type: string;
    details: any;
    created_at: string;
};

type Tab = "all" | "checkins" | "reminders" | "deliveries";

function getActivityMeta(log: ActivityLog) {
    const date = new Date(log.created_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    }) + " · " + new Date(log.created_at).toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit",
    });

    switch (log.type) {
        case "checkin":
            return {
                icon: <CheckCircle2 size={15} strokeWidth={1.5} />,
                label: "Check-in completed",
                detail: date,
                color: "var(--success-soft)",
                iconColor: "var(--success)",
                tab: "checkins",
            };
        case "message_created":
            return {
                icon: <MessageSquare size={15} strokeWidth={1.5} />,
                label: "Message created",
                detail: `${log.details?.recipients_count ?? 0} recipient${log.details?.recipients_count !== 1 ? "s" : ""} · ${date}`,
                color: "var(--cream-warm)",
                iconColor: "var(--text-muted)",
                tab: "all",
            };
        case "reminder":
            return {
                icon: <Mail size={15} strokeWidth={1.5} />,
                label: "Reminder sent",
                detail: date,
                color: "var(--warning-soft)",
                iconColor: "var(--warning)",
                tab: "reminders",
            };
        case "delivered":
        case "message_delivered":
            return {
                icon: <Mail size={15} strokeWidth={1.5} />,
                label: "Message delivered",
                detail: date,
                color: "var(--error-soft)",
                iconColor: "var(--error)",
                tab: "deliveries",
            };
        case "paused":
            return {
                icon: <Clock size={15} strokeWidth={1.5} />,
                label: `Timer extended by ${log.details?.days ?? "?"} days`,
                detail: date,
                color: "var(--warning-soft)",
                iconColor: "var(--warning)",
                tab: "all",
            };
        case "recipient_added":
            return {
                icon: <UserPlus size={15} strokeWidth={1.5} />,
                label: "Recipient added",
                detail: date,
                color: "var(--cream-warm)",
                iconColor: "var(--text-muted)",
                tab: "all",
            };
        default:
            return {
                icon: <Paperclip size={15} strokeWidth={1.5} />,
                label: log.type.replace(/_/g, " "),
                detail: date,
                color: "var(--cream-warm)",
                iconColor: "var(--text-muted)",
                tab: "all",
            };
    }
}

export default function ActivityClient({ logs }: { logs: ActivityLog[] }) {
    const [tab, setTab] = useState<Tab>("all");

    const tabs: { key: Tab; label: string }[] = [
        { key: "all", label: "All activity" },
        { key: "checkins", label: "Check-ins" },
        { key: "reminders", label: "Reminders" },
        { key: "deliveries", label: "Deliveries" },
    ];

    const filtered = logs.filter((log) => {
        if (tab === "all") return true;
        const meta = getActivityMeta(log);
        return meta.tab === tab;
    });

    return (
        <>
            <div style={{
                display: "flex", gap: 4, marginBottom: 20,
                background: "var(--surface-inset)", borderRadius: "var(--radius-sm)",
                padding: 3, width: "fit-content",
            }}>
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`ic-btn ic-btn-sm ${tab === t.key ? "ic-btn-primary" : "ic-btn-ghost"}`}
                        style={{ fontSize: 13 }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="ic-card" style={{ padding: 0 }}>
                {filtered.length === 0 ? (
                    <div className="ic-empty">
                        <p className="ic-empty-desc">No activity yet.</p>
                    </div>
                ) : filtered.map((log) => {
                    const meta = getActivityMeta(log);
                    return (
                        <div key={log.id} className="ic-activity-item" style={{ padding: "14px 16px" }}>
                            <div className="ic-activity-icon" style={{ background: meta.color, color: meta.iconColor }}>
                                {meta.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 500, fontSize: 14, color: "var(--text-primary)" }}>{meta.label}</p>
                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{meta.detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
