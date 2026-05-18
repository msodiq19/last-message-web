"use client";

import { useState } from "react";

type Tab = "all" | "checkins" | "reminders" | "deliveries";

const MOCK_ACTIVITY = [
    { id: "1", type: "checkin", icon: "✅", label: "Check-in completed", detail: "May 12, 2024 · 1:41 AM", color: "var(--success-soft)", iconColor: "var(--success)" },
    { id: "2", type: "reminder", icon: "✉", label: "Reminder sent", detail: "Email reminder · To: Alex's Mom", color: "var(--warning-soft)", iconColor: "var(--warning)" },
    { id: "3", type: "reminder", icon: "✉", label: "Reminder sent (Push)", detail: "May 10, 2024 · 9:30 AM", color: "var(--warning-soft)", iconColor: "var(--warning)" },
    { id: "4", type: "other", icon: "📎", label: "Attachment uploaded", detail: "Alex's Mom", color: "var(--cream-warm)", iconColor: "var(--text-muted)" },
    { id: "5", type: "other", icon: "👤", label: "Recipient added", detail: "Alex's Mom", color: "var(--cream-warm)", iconColor: "var(--text-muted)" },
    { id: "6", type: "checkin", icon: "✅", label: "Check-in completed", detail: "Nov 15, 2024 · 6:12 AM", color: "var(--success-soft)", iconColor: "var(--success)" },
    { id: "7", type: "other", icon: "✉️", label: "Message created", detail: "May 8, 2024 · 4:22 PM", color: "var(--cream-warm)", iconColor: "var(--text-muted)" },
];

export default function ActivityPage() {
    const [tab, setTab] = useState<Tab>("all");

    const filtered = MOCK_ACTIVITY.filter((a) => {
        if (tab === "all") return true;
        if (tab === "checkins") return a.type === "checkin";
        if (tab === "reminders") return a.type === "reminder";
        if (tab === "deliveries") return a.type === "delivery";
        return true;
    });

    const tabs: { key: Tab; label: string }[] = [
        { key: "all", label: "All messages" },
        { key: "checkins", label: "Check-ins" },
        { key: "reminders", label: "Reminders" },
        { key: "deliveries", label: "Deliveries" },
    ];

    return (
        <>
            <header className="ic-topbar">
                <h1 style={{ fontSize: 18, fontWeight: 700 }}>Activity</h1>
            </header>

            <div className="ic-page-content">
                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--surface-inset)", borderRadius: "var(--radius-sm)", padding: 4, width: "fit-content" }}>
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
                        <div className="ic-empty"><p className="ic-empty-desc">No activity yet.</p></div>
                    ) : filtered.map((item) => (
                        <div key={item.id} className="ic-activity-item" style={{ padding: "14px 16px" }}>
                            <div className="ic-activity-icon" style={{ background: item.color, color: item.iconColor }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 500, fontSize: 14, color: "var(--text-primary)" }}>{item.label}</p>
                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
