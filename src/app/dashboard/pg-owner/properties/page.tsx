import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getOwnerPgs } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Search, Filter } from "lucide-react";

export default async function PropertiesPage() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const pgs = await getOwnerPgs(userId);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>My Properties</h1>
                    <p style={{ color: "var(--text-secondary)" }}>Manage your listings and view occupancy details.</p>
                </div>
                <Link href="/dashboard/pg-owner/add-pg">
                    <Button size="lg">+ Add Property</Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div style={{ 
                display: "flex", 
                gap: "12px", 
                marginBottom: "32px",
                background: "var(--bg-surface)",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid var(--border-light)"
            }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                    <input 
                        placeholder="Search by name or address..."
                        style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            outline: "none",
                            fontSize: "0.9rem"
                        }}
                    />
                </div>
                <Button variant="outline" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Filter size={16} /> Filters
                </Button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                {pgs.map(pg => {
                    let pgOccupied = 0;
                    let pgTotal = 0;
                    pg.Floors.forEach(f => f.Rooms.forEach(r => {
                        pgOccupied += r.CurrentOccupancy;
                        pgTotal += r.MaxCapacity;
                    }));

                    return (
                        <Card key={pg.Id} padding="0" hover style={{ overflow: "hidden" }}>
                            <div style={{ padding: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <div>
                                        <h4 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "4px" }}>{pg.Title}</h4>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{pg.FullAddress}</p>
                                    </div>
                                    <div style={{ background: pg.IsVerified ? "rgba(16, 185, 129, 0.1)" : "rgba(100, 116, 139, 0.1)", color: pg.IsVerified ? "#10b981" : "#64748b", padding: "4px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 800 }}>
                                        {pg.IsVerified ? "VERIFIED" : "PENDING"}
                                    </div>
                                </div>
                                
                                <div style={{ 
                                    background: "var(--bg-secondary)", 
                                    padding: "16px", 
                                    borderRadius: "12px", 
                                    marginBottom: "20px" 
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "8px" }}>
                                        <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Occupancy</span>
                                        <span style={{ fontWeight: 700 }}>{pgOccupied} / {pgTotal} beds</span>
                                    </div>
                                    <div style={{ height: "6px", background: "var(--border-light)", borderRadius: "3px", overflow: "hidden" }}>
                                        <div style={{ 
                                            height: "100%", 
                                            width: `${(pgOccupied / (pgTotal || 1)) * 100}%`, 
                                            background: "var(--primary)",
                                            borderRadius: "3px" 
                                        }} />
                                    </div>
                                </div>

                                <Link href={`/dashboard/pg-owner/${pg.Id}`}>
                                    <Button fullWidth variant="outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                        View Details <ArrowUpRight size={16} />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    );
                })}
            </div>
            
            {pgs.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏠</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>No properties listed yet</h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Start by adding your first PG property to the dashboard.</p>
                    <Link href="/dashboard/pg-owner/add-pg">
                        <Button>Add Your First Property</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
