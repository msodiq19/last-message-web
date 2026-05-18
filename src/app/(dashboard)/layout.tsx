"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
};

function IconDashboard() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
}
function IconMessages() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function IconRecipients() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function IconCheckin() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>;
}
function IconActivity() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
}
function IconSettings() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M20 12h2M19.07 19.07l-1.41-1.41M12 20v2M4.93 19.07l1.41-1.41M4 12H2M4.93 4.93l1.41 1.41" /></svg>;
}

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { href: "/messages", label: "Messages", icon: <IconMessages /> },
    { href: "/recipients", label: "Recipients", icon: <IconRecipients /> },
    { href: "/check-in", label: "Check-in", icon: <IconCheckin /> },
    { href: "/activity", label: "Activity", icon: <IconActivity /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleSignOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <div className="ic-layout">
            {/* Sidebar */}
            <aside className="ic-sidebar">
                <div className="ic-sidebar-logo">
                    <div className="ic-sidebar-logo-mark">✉</div>
                    <span className="ic-sidebar-logo-text">in case</span>
                </div>

                <nav className="ic-nav-section">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`ic-nav-item ${isActive ? "ic-nav-item--active" : ""}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ borderTop: "1px solid var(--sidebar-border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Link
                        href="/settings"
                        className={`ic-nav-item ${pathname.startsWith("/settings") ? "ic-nav-item--active" : ""}`}
                    >
                        <IconSettings />
                        Settings
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="ic-nav-item"
                        style={{ border: "none", cursor: "pointer" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="ic-main">
                {children}
            </main>
        </div>
    );
}
