import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getGuestApplications } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Home, Compass, FileText, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export default async function GuestDashboard() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) return null;

    const applications = await getGuestApplications(userId);
    const pendingCount = applications.filter(a => a.Status === "PENDING").length;
    const activeStay = applications.find(a => a.Status === "APPROVED");

    return (
        <div>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>
                    Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                    Manage your applications and stay details from your guest dashboard.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "40px" }}>
                {/* Active Stay / Booking Status */}
                <Card padding="32px" shadow="lg" style={{ borderLeft: "6px solid var(--primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Home size={24} />
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, background: activeStay ? "#10b9811a" : "#f59e0b1a", color: activeStay ? "#10b981" : "#f59e0b", padding: "4px 12px", borderRadius: "20px" }}>
                            {activeStay ? "ACTIVE RESIDENT" : "SEARCHING"}
                        </span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "8px" }}>
                        {activeStay ? "You're all set!" : "Find your next home"}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.6" }}>
                        {activeStay 
                            ? "You have an active approval at Zenith PG. Check your move-in details and payment schedule."
                            : "You don't have an active stay yet. Explore our verified listings near your campus."
                        }
                    </p>
                    <Link href="/#explore">
                        <Button fullWidth style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            {activeStay ? "View Stay Details" : "Browse PGs"} <ArrowRight size={18} />
                        </Button>
                    </Link>
                </Card>

                {/* Application Stats */}
                <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "24px" }}>
                    <Card padding="24px" hover>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 500 }}>Pending Applications</h4>
                                <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{pendingCount}</p>
                            </div>
                        </div>
                    </Card>

                    <Card padding="24px" hover>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 500 }}>Total Requests</h4>
                                <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{applications.length}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "24px" }}>Recent Activity</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {applications.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", background: "var(--bg-surface)", borderRadius: "24px", border: "1px dashed var(--border)" }}>
                        <p style={{ color: "var(--text-secondary)" }}>No recent activity to show.</p>
                    </div>
                ) : (
                    applications.slice(0, 3).map(app => (
                        <Card key={app.Id} padding="20px">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: app.Status === "APPROVED" ? "#10b9811a" : "#f59e0b1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {app.Status === "APPROVED" ? <CheckCircle2 size={18} color="#10b981" /> : <Clock size={18} color="#f59e0b" />}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Application submitted for PG</h4>
                                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Status: {app.Status}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">View</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
