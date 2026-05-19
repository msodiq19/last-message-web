"use client";

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
                    <Logo variant="full" size="sm" href="/dashboard" />
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
                        href="mailto:hello@incase.so?subject=In Case Feedback"
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
