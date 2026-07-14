"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Mail, 
    Phone, 
    MessageSquare, 
    BedDouble, 
    Layers, 
    Check, 
    X,
    Sparkles
} from "lucide-react";
import { PgApplication, PgListing } from "@/models";
import { useRouter } from "next/navigation";


interface ApplicationCardProps {
    application: PgApplication;
    pg: PgListing | undefined;
    onStatusChange?: (appId: string, newStatus: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, pg, onStatusChange }) => {
    const router = useRouter();
    const [status, setStatus] = useState<string>(application.Status);
    const [submitting, setSubmitting] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Allocation states
    const [selectedFloor, setSelectedFloor] = useState<number | null>(
        application.FloorNumber || (pg?.Floors && pg.Floors.length > 0 ? pg.Floors[0].FloorNumber : null)
    );
    const [selectedRoom, setSelectedRoom] = useState<string | null>(application.RoomId || null);

    const handleCopyPhone = () => {
        const phone = application.Guest?.Phone || "Not Provided";
        navigator.clipboard.writeText(phone).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleReject = async () => {
        if (!confirm("Are you sure you want to reject this application?")) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: application.Id,
                    status: "REJECTED"
                })
            });

            if (res.ok) {
                setStatus("REJECTED");
                if (onStatusChange) onStatusChange(application.Id, "REJECTED");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to reject application");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating application status");
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedFloor || !selectedRoom) {
            alert("Please select a floor and room to allocate for the guest.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: application.Id,
                    status: "APPROVED",
                    floorNumber: selectedFloor,
                    roomId: selectedRoom,
                    pgId: application.PgId
                })
            });

            if (res.ok) {
                setStatus("APPROVED");
                setShowApproveModal(false);
                if (onStatusChange) onStatusChange(application.Id, "APPROVED");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to approve application");
            }
        } catch (err) {
            console.error(err);
            alert("Error approving application");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter rooms based on selected floor
    const currentFloorRooms = pg?.Floors.find(f => f.FloorNumber === selectedFloor)?.Rooms || [];

    return (
        <>
            <Card padding="24px" hover style={{ opacity: submitting ? 0.7 : 1, transition: "opacity 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "20px", flex: 1, minWidth: "280px" }}>
                        <div style={{ 
                            width: "56px", 
                            height: "56px", 
                            borderRadius: "14px", 
                            background: status === "PENDING" ? "var(--primary-light)" : status === "APPROVED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                            color: status === "PENDING" ? "var(--primary)" : status === "APPROVED" ? "#10b981" : "#ef4444",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            transition: "all 0.3s ease"
                        }}>
                            {(application.Guest?.Name || "G").slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px", flexWrap: "wrap" }}>
                                <h4 style={{ fontSize: "1.125rem", fontWeight: 800 }}>{application.Guest?.Name || `Guest ${application.GuestId.slice(0, 8)}`}</h4>
                                <span style={{ fontSize: "0.75rem", background: "var(--bg-secondary)", padding: "2px 10px", borderRadius: "20px", fontWeight: 600, color: "var(--text-secondary)" }}>
                                    ID: {application.Id.slice(0, 8)}
                                </span>
                            </div>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                                Applying for: <strong style={{ color: "var(--text)" }}>{pg?.Title || "Unknown PG"}</strong>
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                                <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Layers size={14} /> Floor {application.FloorNumber || "Not Specified"}</span>
                                    <span>•</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><BedDouble size={14} /> Room {pg?.Floors.flatMap(f => f.Rooms).find(r => r.RoomId === application.RoomId)?.RoomNumber || "Any"}</span>
                                </div>
                                {application.Conditions && (
                                    <div style={{ 
                                        display: "flex", 
                                        gap: "8px", 
                                        fontSize: "0.825rem", 
                                        background: "var(--bg-secondary)", 
                                        padding: "8px 12px", 
                                        borderRadius: "8px", 
                                        marginTop: "4px",
                                        color: "var(--text)",
                                        borderLeft: "3px solid var(--primary)"
                                    }}>
                                        <MessageSquare size={16} style={{ flexShrink: 0, color: "var(--primary)", marginTop: "2px" }} />
                                        <span>"{application.Conditions}"</span>
                                    </div>
                                )}
                            </div>

                            {/* Contact Details Quick View */}
                            {application.Guest && (
                                <div style={{ display: "flex", gap: "16px", fontSize: "0.775rem", color: "var(--text-secondary)" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12} /> {application.Guest.Email}</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Phone size={12} /> {application.Guest.Phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <div style={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "6px",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background: status === "PENDING" ? "rgba(245, 158, 11, 0.1)" : status === "APPROVED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: status === "PENDING" ? "#f59e0b" : status === "APPROVED" ? "#10b981" : "#ef4444",
                            marginBottom: "16px",
                            textTransform: "uppercase"
                        }}>
                            {status === "PENDING" ? <Clock size={14} /> : status === "APPROVED" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {status}
                        </div>
                        
                        {status === "PENDING" && (
                            <div style={{ display: "flex", gap: "8px" }}>
                                <Button variant="outline" size="sm" onClick={handleReject} disabled={submitting}>
                                    <X size={14} /> Reject
                                </Button>
                                <Button variant="primary" size="sm" onClick={() => setShowApproveModal(true)} disabled={submitting}>
                                    <Check size={14} /> Review & Approve
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Room Allocation and Approval Modal */}
            {showApproveModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(12px)",
                    zIndex: 4000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }} onClick={() => setShowApproveModal(false)}>
                    <div style={{
                        background: "white",
                        width: "550px",
                        maxWidth: "95vw",
                        borderRadius: "24px",
                        padding: "32px",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        position: "relative",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        <button 
                            onClick={() => setShowApproveModal(false)}
                            style={{
                                position: "absolute",
                                top: "24px",
                                right: "24px",
                                background: "none",
                                border: "none",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                color: "var(--text-secondary)"
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "8px" }}>
                                <Sparkles size={16} /> Application Review
                            </div>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
                                Allocate Room & Approve
                            </h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "4px 0 0" }}>
                                Select a floor and room to assign to this resident.
                            </p>
                        </div>

                        {/* Guest Quick Bio */}
                        <div style={{ background: "var(--bg-secondary)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                                Applicant Profile
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
                                <div>
                                    <span style={{ color: "var(--text-secondary)", display: "block", fontSize: "0.75rem" }}>FULL NAME</span>
                                    <strong>{application.Guest?.Name || "Guest User"}</strong>
                                </div>
                                <div>
                                    <span style={{ color: "var(--text-secondary)", display: "block", fontSize: "0.75rem" }}>COLLEGE</span>
                                    <strong>{application.Guest?.College || "Amity University"}</strong>
                                </div>
                                <div>
                                    <span style={{ color: "var(--text-secondary)", display: "block", fontSize: "0.75rem" }}>EMAIL</span>
                                    <strong>{application.Guest?.Email || "Not Provided"}</strong>
                                </div>
                                <div>
                                    <span style={{ color: "var(--text-secondary)", display: "block", fontSize: "0.75rem" }}>PHONE</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <strong>{application.Guest?.Phone || "Not Provided"}</strong>
                                        <button 
                                            onClick={handleCopyPhone}
                                            style={{
                                                background: "var(--primary-light)",
                                                border: "none",
                                                color: "var(--primary)",
                                                fontSize: "0.7rem",
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: 600
                                            }}
                                        >
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {application.Conditions && (
                                <div style={{ fontSize: "0.85rem", borderTop: "1px solid var(--border-light)", paddingTop: "10px" }}>
                                    <span style={{ color: "var(--text-secondary)", display: "block", fontSize: "0.75rem", marginBottom: "4px" }}>GUEST REQUEST & REMARKS</span>
                                    <div style={{ padding: "8px 12px", background: "white", borderRadius: "8px", borderLeft: "3px solid var(--primary)", fontStyle: "italic" }}>
                                        "{application.Conditions}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Floor Selection */}
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 700, display: "block", marginBottom: "12px", color: "var(--text)" }}>
                                1. Select Floor
                            </label>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {pg?.Floors.map(f => (
                                    <Button 
                                        key={f.FloorNumber} 
                                        type="button" 
                                        variant={selectedFloor === f.FloorNumber ? "primary" : "outline"} 
                                        size="sm"
                                        onClick={() => { setSelectedFloor(f.FloorNumber); setSelectedRoom(null); }}
                                    >
                                        Floor {f.FloorNumber}
                                    </Button>
                                ))}
                                {(!pg?.Floors || pg.Floors.length === 0) && (
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>No floors configured for this property.</p>
                                )}
                            </div>
                        </div>

                        {/* Room Selection */}
                        {selectedFloor && (
                            <div>
                                <label style={{ fontSize: "0.875rem", fontWeight: 700, display: "block", marginBottom: "12px", color: "var(--text)" }}>
                                    2. Allocate Room
                                </label>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
                                    {currentFloorRooms.map(r => {
                                        const isFull = r.CurrentOccupancy >= r.MaxCapacity;
                                        const isSelected = selectedRoom === r.RoomId;
                                        return (
                                            <div 
                                                key={r.RoomId}
                                                onClick={() => !isFull && setSelectedRoom(r.RoomId)}
                                                style={{
                                                    padding: "12px",
                                                    borderRadius: "12px",
                                                    border: isSelected 
                                                        ? "2px solid var(--primary)" 
                                                        : "1px solid var(--border)",
                                                    background: isSelected 
                                                        ? "var(--primary-light)" 
                                                        : isFull ? "#f1f5f9" : "white",
                                                    cursor: isFull ? "not-allowed" : "pointer",
                                                    opacity: isFull ? 0.6 : 1,
                                                    textAlign: "center",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: isSelected ? "var(--primary)" : "var(--text)" }}>
                                                    Room {r.RoomNumber}
                                                </div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "4px 0" }}>
                                                    {r.Type} Sharing
                                                </div>
                                                <div style={{ 
                                                    fontSize: "0.7rem", 
                                                    fontWeight: 700,
                                                    color: isFull ? "#ef4444" : isSelected ? "var(--primary)" : "#10b981" 
                                                }}>
                                                    {isFull ? "FULL" : `${r.CurrentOccupancy}/${r.MaxCapacity} Beds`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {currentFloorRooms.length === 0 && (
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>No rooms configured on this floor.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "12px", marginTop: "12px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowApproveModal(false)} 
                                style={{ flex: 1 }}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleApprove} 
                                style={{ flex: 1 }}
                                disabled={submitting || !selectedFloor || !selectedRoom}
                            >
                                {submitting ? "Processing..." : "Confirm & Approve"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
