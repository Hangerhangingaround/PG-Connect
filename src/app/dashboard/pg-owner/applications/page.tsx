import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getOwnerApplications, getOwnerPgs } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Inbox, CheckCircle2, XCircle, Clock } from "lucide-react";

export default async function ApplicationsPage() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    const [applications, pgs] = await Promise.all([
        getOwnerApplications(userId),
        getOwnerPgs(userId)
    ]);

    const getPgTitle = (pgId: string) => pgs.find(p => p.Id === pgId)?.Title || "Unknown PG";

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Guest Applications</h1>
                <p style={{ color: "var(--text-secondary)" }}>Review and manage residency requests across your portfolio.</p>
            </div>

            {/* Application Stages */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                <Button variant="primary" size="sm" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={16} /> All Pending ({applications.filter(a => a.Status === "PENDING").length})
                </Button>
                <Button variant="outline" size="sm" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={16} /> Approved
                </Button>
                <Button variant="outline" size="sm" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <XCircle size={16} /> Rejected
                </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {applications.length === 0 ? (
                    <Card padding="60px" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📬</div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>No applications found</h3>
                        <p style={{ color: "var(--text-secondary)" }}>When guests apply to your PGs, they will appear here for review.</p>
                    </Card>
                ) : (
                    applications.map(app => (
                        <Card key={app.Id} padding="24px" hover>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <div style={{ 
                                        width: "56px", 
                                        height: "56px", 
                                        borderRadius: "14px", 
                                        background: "var(--primary-light)", 
                                        color: "var(--primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.25rem",
                                        fontWeight: 800
                                    }}>
                                        {app.GuestId.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                                            <h4 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Guest {app.GuestId.slice(0, 8)}</h4>
                                            <span style={{ fontSize: "0.75rem", background: "var(--bg-secondary)", padding: "2px 10px", borderRadius: "20px", fontWeight: 600, color: "var(--text-secondary)" }}>
                                                ID: {app.Id.slice(0, 8)}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                                            Applying for: <strong style={{ color: "var(--text)" }}>{getPgTitle(app.PgId)}</strong>
                                        </p>
                                        <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                            <span>Floor {app.FloorNumber || "N/A"}</span>
                                            <span>•</span>
                                            <span>Room {app.RoomId || "Any"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <div style={{ 
                                        display: "inline-flex", 
                                        alignItems: "center", 
                                        gap: "6px",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        background: app.Status === "PENDING" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                                        color: app.Status === "PENDING" ? "#f59e0b" : "#10b981",
                                        marginBottom: "16px"
                                    }}>
                                        {app.Status === "PENDING" ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                                        {app.Status}
                                    </div>
                                    {app.Status === "PENDING" && (
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <Button variant="outline" size="sm">Reject</Button>
                                            <Button variant="primary" size="sm">Review & Approve</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
