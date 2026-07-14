"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/portfolio/Container";
import { Navbar } from "@/components/portfolio/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { PgListing, Floor, Room } from "@/models";
import { useSession } from "next-auth/react";

export default function GuestApplyPage() {
    const { id } = useParams();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [pg, setPg] = useState<PgListing | null>(null);
    const { data: session, status } = useSession();

    // Form state
    const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [conditions, setConditions] = useState("");
    const [permanentAddress, setPermanentAddress] = useState("");

    React.useEffect(() => {
        fetch(`/api/pg-listings/${id}`) // Assuming we handle ID in route or just fetch all and find
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPg(data.find((p: any) => p.Id === id) || null);
                } else {
                    setPg(data);
                }
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    PgId: id,
                    GuestId: (session?.user as any)?.id || "guest-user-1",
                    FloorNumber: selectedFloor,
                    RoomId: selectedRoom,
                    Conditions: conditions,
                    PermanentAddress: permanentAddress,
                }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || "Failed to submit application");
            }
        } catch (err) {
            console.error("Apply error:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "loading") {
        return (
            <main style={{ minHeight: "100vh", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Loading session...</p>
            </main>
        );
    }

    if (status === "unauthenticated") {
        return (
            <main style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
                <Navbar />
                <Container size="sm" style={{ paddingTop: "120px", textAlign: "center" }}>
                    <div style={{ fontSize: "5rem", marginBottom: "24px" }}>🔒</div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px", color: "var(--text)" }}>Login Required</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", marginBottom: "40px" }}>
                        You must be signed in to apply for a PG residency.
                    </p>
                    <Button size="lg" shadow="lg" onClick={() => router.push(`/login?callbackUrl=/pg/${id}/apply`)}>
                        Sign In / Register
                    </Button>
                </Container>
            </main>
        );
    }

    if (success) {
        return (
            <main style={{ minHeight: "100vh", background: "white" }}>
                <Navbar />
                <Container size="sm" style={{ paddingTop: "120px", textAlign: "center" }}>
                    <div style={{ fontSize: "5rem", marginBottom: "24px" }}>📩</div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "16px" }}>Application Sent!</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", marginBottom: "40px" }}>
                        Your application for {selectedRoom ? `Room ${selectedRoom}` : "this PG"} has been sent to the owner. You'll be notified via email once they review it.
                    </p>
                    <Button size="lg" shadow="lg" onClick={() => router.push("/")}>Back to Home</Button>
                </Container>
            </main>
        );
    }

    return (
        <main style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
            <Navbar />
            <Container size="sm" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Apply for Residency</h1>
                    <p style={{ color: "var(--text-secondary)" }}>Property ID: {id}</p>
                </div>

                <Card padding="40px">
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: "12px" }}>Select Floor (Optional)</label>
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
                            </div>
                        </div>

                        {selectedFloor && (
                            <div>
                                <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: "12px" }}>Select Room (Optional)</label>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                                    {pg?.Floors.find(f => f.FloorNumber === selectedFloor)?.Rooms.map(r => (
                                        <Button 
                                            key={r.RoomId} 
                                            type="button" 
                                            variant={selectedRoom === r.RoomId ? "primary" : "outline"} 
                                            size="sm"
                                            disabled={r.Status !== "AVAILABLE"}
                                            onClick={() => setSelectedRoom(r.RoomId)}
                                        >
                                            {r.RoomNumber} {r.Status !== "AVAILABLE" && `(${r.Status})`}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <TextArea 
                            label="Your Permanent Address" 
                            placeholder="Current home address for verification..." 
                            value={permanentAddress} 
                            onChange={(e) => setPermanentAddress(e.target.value)} 
                            required 
                        />

                        <TextArea 
                            label="Special Conditions / Requests" 
                            placeholder="e.g. Need a quiet room, late check-in, veg meals only..." 
                            value={conditions} 
                            onChange={(e) => setConditions(e.target.value)} 
                            style={{ height: "120px" }}
                        />

                        <Button type="submit" size="lg" shadow="lg" disabled={submitting} style={{ marginTop: "12px" }}>
                            {submitting ? "Submitting Application..." : "Submit Application"}
                        </Button>
                    </form>
                </Card>
            </Container>
        </main>
    );
}
