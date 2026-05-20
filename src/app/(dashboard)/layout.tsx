"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Mail,
    Users,
    CheckSquare,
    Activity,
    Settings,
    LogOut,
    MessageCircleHeart,
    Menu,
    X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/lib/components/Logo";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} strokeWidth={1.5} /> },
    { href: "/messages", label: "Messages", icon: <Mail size={15} strokeWidth={1.5} /> },
    { href: "/recipients", label: "Recipients", icon: <Users size={15} strokeWidth={1.5} /> },
    { href: "/check-in", label: "Check-in", icon: <CheckSquare size={15} strokeWidth={1.5} /> },
    { href: "/activity", label: "Activity", icon: <Activity size={15} strokeWidth={1.5} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    async function handleSignOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <div className="ic-layout">
            <div className="ic-mobile-header">
                <Logo variant="full" size="sm" href="/dashboard" />
                <button
                    className="ic-mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`ic-sidebar ${isMobileMenuOpen ? "is-open" : ""}`}>
                <div className="ic-sidebar-logo" style={{ justifyContent: "space-between" }}>
                    <div onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo variant="full" size="sm" href="/dashboard" />
                    </div>
                    <button
                        className="ic-sidebar-close-btn"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)" }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="ic-nav-section">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
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
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`ic-nav-item ${pathname.startsWith("/settings") ? "ic-nav-item--active" : ""}`}
                    >
                        <Settings size={15} strokeWidth={1.5} />
                        Settings
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="ic-nav-item"
                        style={{ border: "none", cursor: "pointer" }}
                    >
                        <LogOut size={15} strokeWidth={1.5} />
                        Log out
                    </button>
                    <a
                        href="https://tally.so/r/GxqMWQ"
                        target="_blank"
                        rel="noreferrer"
                        className="ic-nav-item"
                        style={{ border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                    >
                        <MessageCircleHeart size={15} strokeWidth={1.5} />
                        Give feedback
                    </a>
                </div>
            </aside>

            {/* Main */}
            <main className="ic-main">
                {children}
            </main>
        </div>
    );
}
