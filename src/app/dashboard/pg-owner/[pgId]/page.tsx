import React from "react";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPgById, getOwnerApplications } from "@/lib/data";
import { Container } from "@/components/portfolio/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ChevronLeft, MapPin, BadgeCheck, Users, BedDouble } from "lucide-react";
import { RoomsManager } from "@/components/dashboard/RoomsManager";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";

export default async function PgDetailPage({ params }: { params: Promise<{ pgId: string }> }) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const { pgId } = await params;

    const [pg, applications] = await Promise.all([
        getPgById(pgId),
        getOwnerApplications(userId)
    ]);

    if (!pg) return notFound();
    if (pg.OwnerId !== userId) redirect("/dashboard/pg-owner");

    const pgApplications = applications.filter(a => a.PgId === pgId);
    
    let occupied = 0;
    let total = 0;
    pg.Floors.forEach(f => f.Rooms.forEach(r => {
        occupied += r.CurrentOccupancy;
        total += r.MaxCapacity;
    }));

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <Link href="/dashboard/pg-owner" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "16px", fontWeight: 600 }}>
                    <ChevronLeft size={20} /> Back to Dashboard
                </Link>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                            <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>{pg.Title}</h1>
                            {pg.IsVerified && (
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                                    <BadgeCheck size={14} /> VERIFIED
                                </div>
                            )}
                        </div>
                        <p style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <MapPin size={18} /> {pg.FullAddress}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Button variant="outline">Edit Property</Button>
                        <Button variant="primary">Export Report</Button>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px" }}>
                {/* Main Content: Floors & Rooms */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    <RoomsManager pg={pg} />
                </div>

                {/* Sidebar: Applications & Quick Stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <Card padding="24px">
                        <h3 style={{ fontWeight: 800, marginBottom: "20px", fontSize: "1.1rem" }}>Occupancy Summary</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}><Users size={16} /> Occupied</span>
                                <span style={{ fontWeight: 700 }}>{occupied} beds</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}><BedDouble size={16} /> Total Capacity</span>
                                <span style={{ fontWeight: 700 }}>{total} beds</span>
                            </div>
                            <div style={{ height: "1px", background: "var(--border-light)", margin: "8px 0" }} />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Availability Rate</span>
                                <span style={{ fontWeight: 700, color: "#10b981" }}>{(((total - occupied) / (total || 1)) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </Card>

                    <Card padding="24px">
                        <h3 style={{ fontWeight: 800, marginBottom: "20px", fontSize: "1.1rem" }}>Guest Applications</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {pgApplications.length === 0 ? (
                                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontStyle: "italic" }}>No recent applications</p>
                            ) : (
                                pgApplications.map(app => (
                                    <ApplicationCard key={app.Id} application={app} pg={pg} />
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
