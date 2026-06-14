"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useSession } from "next-auth/react";
import { User, Bell, Search } from "lucide-react";

interface ClientDashboardShellProps {
    children: React.ReactNode;
}

export const ClientDashboardShell: React.FC<ClientDashboardShellProps> = ({ children }) => {
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
            if (window.innerWidth <= 1024) {
                setIsCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-secondary)" }}>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            
            <main style={{ 
                flex: 1, 
                marginLeft: isCollapsed ? "80px" : "280px",
                transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                width: "100%",
                position: "relative"
            }}>
                {/* Optimized Dashboard Header */}
                <header style={{
                    height: "72px",
                    background: "var(--bg-surface)",
                    borderBottom: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 40px",
                    position: "sticky",
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                        <div style={{ position: "relative", width: "300px" }}>
                            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                            <input 
                                placeholder="Global search..." 
                                style={{ 
                                    width: "100%", 
                                    padding: "8px 12px 8px 40px", 
                                    background: "var(--bg-secondary)", 
                                    border: "none", 
                                    borderRadius: "10px",
                                    outline: "none",
                                    fontSize: "0.9rem"
                                }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", position: "relative" }}>
                            <Bell size={20} />
                            <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", background: "var(--primary)", borderRadius: "50%", border: "2px solid white" }} />
                        </button>
                        
                        <div style={{ height: "32px", width: "1px", background: "var(--border-light)" }} />

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text)" }}>{session?.user?.name || "Owner Dashboard"}</p>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Property Manager</p>
                            </div>
                            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ padding: "40px" }}>
                    {children}
                </div>
            </main>
        </div>
    );
};
