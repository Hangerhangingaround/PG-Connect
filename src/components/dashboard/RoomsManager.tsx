"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    Users, 
    BedDouble, 
    Layers, 
    Settings, 
    Trash2, 
    Mail, 
    Phone,
    ShieldAlert
} from "lucide-react";
import { PgListing, Room } from "@/models";

interface RoomsManagerProps {
    pg: PgListing;
}

export const RoomsManager: React.FC<RoomsManagerProps> = ({ pg }) => {
    const router = useRouter();
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
    const [status, setStatus] = useState<string>("AVAILABLE");
    const [submitting, setSubmitting] = useState(false);

    const getStatusColor = (s: string) => {
        switch (s) {
            case "AVAILABLE": return "#10b981";
            case "FULL": return "#ef4444";
            case "LOCKED": return "#64748b";
            default: return "#cbd5e1";
        }
    };

    const handleOpenModal = (room: Room, floorNum: number) => {
        setSelectedRoom(room);
        setSelectedFloor(floorNum);
        setStatus(room.Status);
    };

    const handleSaveStatus = async () => {
        if (!selectedRoom || selectedFloor === null) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/pg-listings/${pg.Id}/rooms`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId: selectedRoom.RoomId,
                    floorNumber: selectedFloor,
                    status: status
                })
            });

            if (res.ok) {
                setSelectedRoom(null);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update room status");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating room status");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckout = async (guestId: string) => {
        if (!selectedRoom || selectedFloor === null) return;
        if (!confirm("Are you sure you want to check out this resident? This will free up a bed.")) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/pg-listings/${pg.Id}/rooms`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId: selectedRoom.RoomId,
                    floorNumber: selectedFloor,
                    guestIdToCheckout: guestId
                })
            });

            if (res.ok) {
                // Update the local modal view immediately before page data refreshes
                const updatedGuests = (selectedRoom as any).Guests?.filter((g: any) => g.Id !== guestId) || [];
                const updatedOccupancy = Math.max(0, selectedRoom.CurrentOccupancy - 1);
                
                setSelectedRoom({
                    ...selectedRoom,
                    CurrentOccupancy: updatedOccupancy,
                    Guests: updatedGuests as any,
                    Status: updatedOccupancy < selectedRoom.MaxCapacity && selectedRoom.Status === "FULL" ? "AVAILABLE" : selectedRoom.Status
                });

                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to checkout guest");
            }
        } catch (err) {
            console.error(err);
            alert("Error checking out guest");
        } finally {
            setSubmitting(false);
        }
    };

    return (
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
                                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{room.Type} Sharing</p>
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
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        fullWidth
                                        onClick={() => handleOpenModal(room, floor.FloorNumber)}
                                    >
                                        <Settings size={14} /> Manage
                                    </Button>
                                    <Button variant="ghost" size="sm">History</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}

            {/* Room Management Modal */}
            {selectedRoom && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(12px)",
                    zIndex: 4000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }} onClick={() => setSelectedRoom(null)}>
                    <div style={{
                        background: "white",
                        width: "500px",
                        maxWidth: "95vw",
                        borderRadius: "24px",
                        padding: "32px",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        position: "relative"
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        <button 
                            onClick={() => setSelectedRoom(null)}
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

                        <div>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
                                Manage Room {selectedRoom.RoomNumber}
                            </h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "4px 0 0" }}>
                                Floor {selectedFloor} • {selectedRoom.Type} Sharing
                            </p>
                        </div>

                        {/* Status Config */}
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 700, display: "block", marginBottom: "8px" }}>Room Status</label>
                            <div style={{ display: "flex", gap: "8px" }}>
                                {["AVAILABLE", "FULL", "LOCKED"].map(s => (
                                    <Button
                                        key={s}
                                        type="button"
                                        variant={status === s ? "primary" : "outline"}
                                        size="sm"
                                        style={{ flex: 1 }}
                                        onClick={() => setStatus(s)}
                                        disabled={submitting}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Occupant/Guest List */}
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 700, display: "block", marginBottom: "12px" }}>
                                Residents ({selectedRoom.CurrentOccupancy} / {selectedRoom.MaxCapacity})
                            </label>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {(selectedRoom as any).Guests && (selectedRoom as any).Guests.length > 0 ? (
                                    (selectedRoom as any).Guests.map((guest: any) => (
                                        <div 
                                            key={guest.Id} 
                                            style={{
                                                padding: "16px",
                                                border: "1px solid var(--border-light)",
                                                borderRadius: "12px",
                                                background: "var(--bg-secondary)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>
                                                    {guest.Name}
                                                </div>
                                                <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Mail size={12} /> {guest.Email}</span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Phone size={12} /> {guest.Phone}</span>
                                                </div>
                                            </div>
                                            
                                            <button
                                                type="button"
                                                onClick={() => handleCheckout(guest.Id)}
                                                disabled={submitting}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "var(--error)",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: "6px",
                                                    borderRadius: "8px",
                                                    transition: "background 0.2s"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(193,53,17,0.05)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)", fontSize: "0.85rem", border: "1px dashed var(--border)", borderRadius: "12px" }}>
                                        No active residents checked in.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div style={{ display: "flex", gap: "12px", marginTop: "12px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
                            <Button 
                                variant="outline" 
                                onClick={() => setSelectedRoom(null)} 
                                style={{ flex: 1 }}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleSaveStatus} 
                                style={{ flex: 1 }}
                                disabled={submitting || status === selectedRoom.Status}
                            >
                                {submitting ? "Saving..." : "Save Status"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
