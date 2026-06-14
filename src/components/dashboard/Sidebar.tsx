"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Building2, 
    FileText, 
    Settings, 
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Home,
    CreditCard
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = (session?.user as any)?.role;

    const ownerItems = [
        { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard/pg-owner" },
        { name: "Properties", icon: <Building2 size={20} />, href: "/dashboard/pg-owner/properties" },
        { name: "Applications", icon: <FileText size={20} />, href: "/dashboard/pg-owner/applications" },
        { name: "Add Property", icon: <PlusCircle size={20} />, href: "/dashboard/pg-owner/add-pg" },
        { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/pg-owner/settings" },
    ];

    const guestItems = [
        { name: "My Stay", icon: <Home size={20} />, href: "/dashboard/paying-guest" },
        { name: "Applications", icon: <FileText size={20} />, href: "/dashboard/paying-guest/applications" },
        { name: "Payments", icon: <CreditCard size={20} />, href: "/dashboard/paying-guest/payments" },
        { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/paying-guest/settings" },
    ];

    const menuItems = role === "PG_OWNER" ? ownerItems : guestItems;

    const isActive = (path: string) => pathname === path;

    return (
        <aside style={{
            width: isCollapsed ? "80px" : "280px",
            height: "100vh",
            background: "var(--bg-card)",
            borderRight: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 100,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: "20px 0"
        }}>
            {/* Collapse Toggle */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    position: "absolute",
                    right: "-12px",
                    top: "32px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)"
                }}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo Area */}
            <div style={{ padding: "0 24px", marginBottom: "40px", overflow: "hidden" }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <div style={{ 
                        width: "32px", 
                        height: "32px", 
                        background: "var(--primary)", 
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                        flexShrink: 0
                    }}>P</div>
                    {!isCollapsed && <span style={{ marginLeft: "12px", fontWeight: 800, fontSize: "1.25rem", color: "var(--text)", letterSpacing: "-0.5px" }}>PGXplore</span>}
                </Link>
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, padding: "0 16px" }}>
                {menuItems.map((item) => (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px",
                            marginBottom: "8px",
                            borderRadius: "12px",
                            textDecoration: "none",
                            color: isActive(item.href) ? "var(--primary)" : "var(--text-secondary)",
                            background: isActive(item.href) ? "var(--primary-light)" : "transparent",
                            transition: "all 0.2s",
                            overflow: "hidden"
                        }}
                    >
                        <span style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</span>
                        {!isCollapsed && <span style={{ marginLeft: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            {/* User Profile / Logout */}
            <div style={{ padding: "0 16px", marginTop: "auto" }}>
                <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "none",
                        background: "rgba(193, 53, 17, 0.05)",
                        color: "var(--error)",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span style={{ marginLeft: "12px", fontWeight: 600 }}>Logout</span>}
                </button>
            </div>
        </aside>
    );
};
