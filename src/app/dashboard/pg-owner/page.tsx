import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getOwnerPgs, getOwnerApplications } from "@/lib/data";
import { Container } from "@/components/portfolio/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Building2, Users, ArrowUpRight, FileText } from "lucide-react";

export default async function OwnerDashboard() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) return null;

    const [pgs, applications] = await Promise.all([
        getOwnerPgs(userId),
        getOwnerApplications(userId)
    ]);

    const totalOccupancy = pgs.reduce((acc, pg) => {
        let occupied = 0;
        let total = 0;
        pg.Floors.forEach(f => f.Rooms.forEach(r => {
            occupied += r.CurrentOccupancy;
            total += r.MaxCapacity;
        }));
        return { occupied: acc.occupied + occupied, total: acc.total + total };
    }, { occupied: 0, total: 0 });

    const pendingApplications = applications.filter(a => a.Status === "PENDING").length;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>Dashboard Overview</h1>
                    <p style={{ color: "var(--text-secondary)" }}>Track your portfolio performance and guest requests.</p>
                </div>
                <Link href="/dashboard/pg-owner/add-pg">
                    <Button size="lg">+ Add Property</Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
                <Card padding="24px">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255, 56, 92, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                            <Building2 size={22} />
                        </div>
                        <span style={{ color: "#10b981", fontSize: "0.875rem", fontWeight: 700 }}>+2 New</span>
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>Total Properties</span>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4px" }}>{pgs.length}</h2>
                </Card>

                <Card padding="24px">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                            <Users size={22} />
                        </div>
                        <span style={{ color: "#10b981", fontSize: "0.875rem", fontWeight: 700 }}>
                            {((totalOccupancy.occupied / (totalOccupancy.total || 1)) * 100).toFixed(0)}%
                        </span>
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>Global Occupancy</span>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4px" }}>{totalOccupancy.occupied} / {totalOccupancy.total}</h2>
                </Card>

                <Card padding="24px">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                            <FileText size={22} />
                        </div>
                        {pendingApplications > 0 && <span style={{ color: "#f59e0b", fontSize: "0.875rem", fontWeight: 700 }}>Action Required</span>}
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>Pending Applications</span>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4px" }}>{pendingApplications}</h2>
                </Card>
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "24px" }}>Your Properties</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
                {pgs.map(pg => {
                    let pgOccupied = 0;
                    let pgTotal = 0;
                    pg.Floors.forEach(f => f.Rooms.forEach(r => {
                        pgOccupied += r.CurrentOccupancy;
                        pgTotal += r.MaxCapacity;
                    }));

                    return (
                        <Card key={pg.Id} padding="0" hover style={{ overflow: "hidden" }}>
                            <div style={{ height: "120px", background: "var(--primary)", opacity: 0.05, position: "relative" }}>
                                <div style={{ position: "absolute", top: "16px", left: "16px", background: pg.IsVerified ? "#10b981" : "#64748b", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700 }}>
                                    {pg.IsVerified ? "VERIFIED" : "PENDING"}
                                </div>
                            </div>
                            <div style={{ padding: "20px" }}>
                                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "4px" }}>{pg.Title}</h4>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "16px" }}>{pg.FullAddress}</p>
                                
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "16px" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Occupancy</span>
                                    <span style={{ fontWeight: 700 }}>{pgOccupied} / {pgTotal} beds</span>
                                </div>

                                <Link href={`/dashboard/pg-owner/${pg.Id}`}>
                                    <Button fullWidth variant="outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                        Manage Property <ArrowUpRight size={16} />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
