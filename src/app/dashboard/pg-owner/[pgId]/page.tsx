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

export default async function PgDetailPage({ params }: { params: { pgId: string } }) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const { pgId } = params;

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "AVAILABLE": return "#10b981";
            case "FULL": return "#ef4444";
            case "LOCKED": return "#64748b";
            default: return "#cbd5e1";
        }
    };

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
                    {pg.Floors.map(floor => (
                        <div key={floor.FloorNumber}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                                Floor {floor.FloorNumber}
                                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", background: "var(--bg-surface)", padding: "4px 12px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
                                    {floor.Rooms.length} Rooms
                                </span>
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                {floor.Rooms.map(room => (
                                    <Card key={room.RoomId} padding="20px" hover style={{ borderTop: `4px solid ${getStatusColor(room.Status)}` }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                            <div>
                                                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Room {room.RoomNumber}</h3>
                                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{room.Type}</p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: getStatusColor(room.Status), textTransform: "uppercase" }}>{room.Status}</span>
                                            </div>
                                        </div>

                                        <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", padding: "12px", marginBottom: "20px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "8px" }}>
                                                <span style={{ fontWeight: 600 }}>Occupancy</span>
                                                <span>{room.CurrentOccupancy} / {room.MaxCapacity}</span>
                                            </div>
                                            <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                                                <div style={{ 
                                                    height: "100%", 
                                                    width: `${(room.CurrentOccupancy / room.MaxCapacity) * 100}%`, 
                                                    background: getStatusColor(room.Status),
                                                    transition: "width 0.5s ease"
                                                }} />
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <Button variant="outline" size="sm" fullWidth>Manage</Button>
                                            <Button variant="ghost" size="sm">History</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
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
                                    <div key={app.Id} style={{ padding: "16px", border: "1px solid var(--border-light)", borderRadius: "12px", background: "var(--bg-secondary)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>Guest {app.GuestId.slice(0, 5)}</span>
                                            <span style={{ fontSize: "0.75rem", color: app.Status === "PENDING" ? "#f59e0b" : "#10b981", fontWeight: 700 }}>{app.Status}</span>
                                        </div>
                                        {app.Status === "PENDING" && (
                                            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                                <Button variant="primary" size="sm" fullWidth>Approve</Button>
                                                <Button variant="outline" size="sm" fullWidth>Reject</Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
