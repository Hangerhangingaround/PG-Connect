"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/portfolio/Container";
import { Navbar } from "@/components/portfolio/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PgListing, RoomStatus, Floor, Room, PgApplication } from "@/models";
 
// Real data fetched via useEffect
 
export default function OwnerDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [selectedPgId, setSelectedPgId] = useState<string | null>(null);

    React.useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);
    const [pgs, setPgs] = useState<PgListing[]>([]);
    const [applications, setApplications] = useState<PgApplication[]>([]);
    const [loading, setLoading] = useState(true);
 
    const OWNER_ID = (session?.user as any)?.id;
 
    const fetchData = async () => {
        if (!OWNER_ID) {
            console.log("OwnerDashboard: Missing OWNER_ID");
            return;
        }
        setLoading(true);
        console.log("OwnerDashboard: Fetching for OWNER_ID:", OWNER_ID);
        try {
            const [pgRes, appRes] = await Promise.all([
                fetch(`/api/pg-listings?ownerId=${OWNER_ID}`),
                fetch(`/api/applications?ownerId=${OWNER_ID}`)
            ]);
            if (pgRes.ok) {
                const pgData = await pgRes.json();
                console.log("OwnerDashboard: Fetched PGs:", pgData);
                setPgs(pgData);
            }
            if (appRes.ok) {
                const appData = await appRes.json();
                console.log("OwnerDashboard: Fetched Applications:", appData);
                setApplications(appData);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };
 
    React.useEffect(() => {
        if (status === "authenticated") {
            fetchData();
        }
    }, [status, OWNER_ID]);

    if (status === "loading") {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Redirecting to login...</p>
            </div>
        );
    }

    const selectedPg = pgs.find(p => p.Id === selectedPgId);

    const handleApplicationAction = async (appId: string, status: "APPROVED" | "REJECTED", pgId: string, floorNumber?: number, roomId?: string) => {
        try {
            const res = await fetch("/api/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: appId, status, pgId, floorNumber, roomId }),
            });
            if (res.ok) {
                fetchData(); // Refresh data
            }
        } catch (err) {
            console.error("Action error:", err);
        }
    };

    const toggleRoomLock = async (floorNum: number, roomId: string) => {
        // Toggle lock manually if needed, or rely on occupancy
        // Simplified for this step
    };

    const getStatusColor = (status: RoomStatus) => {
        switch (status) {
            case "AVAILABLE": return "#10b981";
            case "FULL": return "#ef4444";
            case "LOCKED": return "#64748b";
            default: return "#cbd5e1";
        }
    };

    const calculateOccupancy = (pg: PgListing) => {
        let total = 0;
        let occupied = 0;
        pg.Floors.forEach(f => {
            f.Rooms.forEach(r => {
                total += r.MaxCapacity;
                occupied += r.CurrentOccupancy;
            });
        });
        return { total, occupied };
    };

    if (!selectedPgId) {
        return (
            <main style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
                <Navbar />
                <Container style={{ paddingTop: "100px", paddingBottom: "100px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                        <div>
                            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>Your Properties</h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Manage your PG listings and track real-time occupancy.</p>
                        </div>
                        <Link href="/owner/add-pg">
                            <Button size="lg" shadow="lg">+ Add New Property</Button>
                        </Link>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
                        {pgs.map(pg => {
                            const stats = calculateOccupancy(pg);
                            return (
                                <Card key={pg.Id} padding="0" hover onClick={() => setSelectedPgId(pg.Id)} style={{ cursor: "pointer", overflow: "hidden" }}>
                                    <div style={{ height: "160px", background: "var(--primary)", opacity: 0.1, position: "relative" }}>
                                        <div style={{ position: "absolute", top: "20px", left: "20px", background: pg.IsVerified ? "#10b981" : "#64748b", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                                            {pg.IsVerified ? "VERIFIED" : "PENDING VERIFICATION"}
                                        </div>
                                    </div>
                                    <div style={{ padding: "24px" }}>
                                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "4px" }}>{pg.Title}</h3>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>{pg.FullAddress}</p>
                                        
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                                            <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "12px", textAlign: "center" }}>
                                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Occupancy</span>
                                                <p style={{ fontWeight: 800, fontSize: "1.1rem" }}>{stats.occupied} / {stats.total}</p>
                                            </div>
                                            <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "12px", textAlign: "center" }}>
                                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Monthly Revenue</span>
                                                <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#10b981" }}>₹{pg.Rent * stats.occupied}</p>
                                            </div>
                                        </div>
 
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <Button fullWidth variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedPgId(pg.Id); }}>Manage Details</Button>
                                            <Link href={`/pg/${pg.Id}`} target="_blank" style={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>
                                                <Button fullWidth variant="ghost">View Public</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </Container>
            </main>
        );
    }

    if (!selectedPg) return null;

    const stats = calculateOccupancy(selectedPg);

    return (
        <main style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
            <Navbar />
            <Container style={{ paddingTop: "100px", paddingBottom: "100px" }}>
                <div style={{ marginBottom: "32px" }}>
                    <Button variant="ghost" onClick={() => setSelectedPgId(null)} style={{ padding: 0, marginBottom: "16px" }}>← Back to Properties</Button>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>{selectedPg.Title}</h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>{selectedPg.FullAddress}</p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <Button variant="outline">Edit Config</Button>
                            <Button variant="outline" onClick={() => setSelectedPgId(null)}>Switch PG</Button>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                        {selectedPg.Floors.map(floor => (
                            <div key={floor.FloorNumber}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                                    Floor {floor.FloorNumber}
                                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", background: "white", padding: "4px 12px", borderRadius: "20px", border: "1px solid var(--border)" }}>
                                        {floor.Rooms.length} Rooms
                                    </span>
                                </h2>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                    {floor.Rooms.map(room => (
                                        <Card key={room.RoomId} padding="20px" hover style={{ borderLeft: `6px solid ${getStatusColor(room.Status)}` }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                                <div>
                                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Room</span>
                                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{room.RoomNumber}</h3>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: getStatusColor(room.Status), textTransform: "uppercase" }}>{room.Status}</span>
                                                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{room.Type}</p>
                                                </div>
                                            </div>

                                            <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", padding: "12px", marginBottom: "20px" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "8px" }}>
                                                    <span style={{ fontWeight: 600 }}>Occupancy</span>
                                                    <span>{room.CurrentOccupancy} / {room.MaxCapacity}</span>
                                                </div>
                                                <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                                                    <div style={{ 
                                                        height: "100%", 
                                                        width: `${(room.CurrentOccupancy / room.MaxCapacity) * 100}%`, 
                                                        background: getStatusColor(room.Status),
                                                        transition: "width 0.5s ease"
                                                    }} />
                                                </div>
 
                                                {room.CurrentOccupancy > 0 && (
                                                    <div>
                                                        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase" }}>Current Residents</span>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                                                            {room.GuestIds?.map((gid, idx) => (
                                                                <span key={idx} style={{ fontSize: "0.75rem", background: "white", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                                                                    Guest {gid.slice(0, 5)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
 
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    fullWidth 
                                                    onClick={() => toggleRoomLock(floor.FloorNumber, room.RoomId)}
                                                >
                                                    {room.Status === "LOCKED" ? "Unlock Room" : "Lock Room"}
                                                </Button>
                                                <Button variant="ghost" size="sm">Edit Room</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <Card padding="24px">
                            <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>Property Summary</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Current Occupancy</span>
                                    <span style={{ fontWeight: 700 }}>{stats.occupied} / {stats.total}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Available Beds</span>
                                    <span style={{ fontWeight: 700, color: "#10b981" }}>{stats.total - stats.occupied}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Configured Rooms</span>
                                    <span style={{ fontWeight: 700 }}>{selectedPg.Floors.reduce((acc, f) => acc + f.Rooms.length, 0)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card padding="24px">
                            <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>Residency Applications</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {applications.length === 0 ? (
                                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontStyle: "italic" }}>No pending requests</p>
                                ) : (
                                    applications.map(app => (
                                        <div key={app.Id} style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-secondary)" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>Guest {app.GuestId.slice(0, 5)}</span>
                                                <span style={{ fontSize: "0.75rem", color: app.Status === "PENDING" ? "#f59e0b" : "#10b981", fontWeight: 700 }}>{app.Status}</span>
                                            </div>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                                                {app.Conditions || "No special requests"}
                                            </p>
                                            {app.Status === "PENDING" && (
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <Button variant="primary" size="sm" fullWidth onClick={() => handleApplicationAction(app.Id, "APPROVED", app.PgId, app.FloorNumber, app.RoomId)}>Approve</Button>
                                                    <Button variant="outline" size="sm" fullWidth onClick={() => handleApplicationAction(app.Id, "REJECTED", app.PgId)}>Reject</Button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>

                        <Card padding="24px">
                            <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>Quick Actions</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ fontSize: "0.875rem" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Base Rent:</span> ₹{selectedPg.Rent}
                                </div>
                                <div style={{ fontSize: "0.875rem" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Verification:</span> {selectedPg.IsVerified ? "✅ Verified" : "⏳ Pending"}
                                </div>
                                <Button fullWidth variant="outline" size="sm" style={{ marginTop: "8px" }}>General Settings</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </main>
    );
}
