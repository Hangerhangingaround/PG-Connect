"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/portfolio/Navbar";
import { Container } from "@/components/portfolio/Container";
import { Section } from "@/components/portfolio/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/portfolio/Badge";
import { Footer } from "@/components/portfolio/Footer";
import { useSession } from "next-auth/react";
import { ChatWidget } from "@/components/portfolio/ChatWidget";

export default function PGDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, status: authStatus } = useSession();
    const [pg, setPg] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/pg-listings/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch details");
                return res.json();
            })
            .then(data => {
                setPg(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching PG:", err);
                setLoading(false);
            });
    }, [id]);

    const handleCopyPhone = () => {
        const textToCopy = pg?.Owner?.Phone || "+91 98765 43210";
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => fallbackCopy(textToCopy));
        } else {
            fallbackCopy(textToCopy);
        }
    };

    const handleChatClick = () => {
        if (authStatus === "unauthenticated") {
            router.push(`/login?callbackUrl=/pg/${id}`);
            return;
        }
        setShowChat(true);
    };

    const fallbackCopy = (text: string) => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand("copy");
            document.body.removeChild(textArea);
            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                alert("Could not copy phone number. Please copy it manually.");
            }
        } catch (err) {
            console.error("Fallback copy failed:", err);
            alert("Could not copy phone number. Please copy it manually.");
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ animation: "pulse 1.5s infinite", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-secondary)" }}>Loading premium stay...</div>
            </div>
        );
    }

    if (!pg || pg.error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <div style={{ fontSize: "4rem" }}>🏠</div>
                <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Stay not found</h2>
                <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <main style={{ background: "white" }}>
            <Navbar />
            
            <Container size="xl" style={{ paddingTop: "40px", paddingBottom: "80px" }}>
                {/* 1. Title & Actions */}
                <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px", letterSpacing: "-1px" }}>{pg.Title}</h1>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                            <span style={{ textDecoration: "underline", fontWeight: 600 }}>{pg.Area}, {pg.City}</span>
                            <span>•</span>
                            <Badge variant="success">Verified Property</Badge>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Button variant="ghost">📤 Share</Button>
                        <Button variant="ghost">❤️ Save</Button>
                    </div>
                </div>

                {/* 2. Image Gallery (Airbnb Style Mosaic) */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "2fr 1fr 1fr", 
                    gridTemplateRows: "200px 200px", 
                    gap: "12px", 
                    borderRadius: "16px", 
                    overflow: "hidden",
                    marginBottom: "48px"
                }}>
                    <style jsx>{`
                        @media (max-width: 768px) {
                            .image-mosaic {
                                grid-template-columns: 1fr !important;
                                grid-template-rows: 300px !important;
                            }
                            .sidebar-sticky {
                                position: static !important;
                                width: 100% !important;
                            }
                        }
                    `}</style>
                    <div className="image-mosaic" style={{ gridRow: "span 2", background: "#eee" }}>
                        <img src={pg.Images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ background: "#eee" }}>
                        <img src={pg.Images?.[1] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ background: "#eee" }}>
                        <img src={pg.Images?.[2] || "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ background: "#eee" }}>
                        <img src={pg.Images?.[3] || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ background: "#eee" }}>
                        <img src={pg.Images?.[4] || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                </div>

                {/* 3. Main Content Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "80px" }}>
                    <div className="main-content">
                        {/* Host info */}
                        <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>Private stay hosted by {pg.PostedBy || "Owner"}</h2>
                                    <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                                        {pg.Floors?.reduce((acc: number, f: any) => acc + f.Rooms.length, 0) || 0} Rooms total • Shared bathrooms
                                    </p>
                                </div>
                                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f0f0f0", overflow: "hidden" }}>
                                    <img src={`https://i.pravatar.cc/150?u=${pg.Id}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            </div>
                        </div>
 
                        {/* Description */}
                        <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                            <p style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "var(--text)" }}>
                                {pg.Description || "No description provided."}
                            </p>
                        </div>
 
                        {/* Amenities */}
                        <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: "24px" }}>What this place offers</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                {pg.Amenities?.map((a: string, i: number) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem", color: "var(--text)" }}>
                                        <span style={{ fontSize: "1.25rem" }}>✔️</span> {a}
                                    </div>
                                ))}
                                {(!pg.Amenities || pg.Amenities.length === 0) && <p style={{ color: "var(--text-secondary)" }}>No amenities listed.</p>}
                            </div>
                        </div>
 
                        {/* Nearby Landmarks */}
                        <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: "24px" }}>Location Highlights</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                {pg.NearbyLandmarks?.map((l: any, i: number) => (
                                    <div key={i} style={{ padding: "12px 20px", background: "var(--bg-secondary)", borderRadius: "12px", fontSize: "0.95rem" }}>
                                        <span style={{ fontWeight: 700 }}>🚶 {l.Distance || l.distance}</span> from {l.Name || l.name}
                                    </div>
                                ))}
                                {(!pg.NearbyLandmarks || pg.NearbyLandmarks.length === 0) && <p style={{ color: "var(--text-secondary)" }}>No landmarks nearby.</p>}
                            </div>
                        </div>

                        {/* Videos */}
                        {pg.Videos && pg.Videos.length > 0 && (
                            <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: "24px" }}>Virtual Tour / Videos</h2>
                                <div style={{ display: "grid", gridTemplateColumns: pg.Videos.length === 1 ? "1fr" : "1fr 1fr", gap: "20px" }}>
                                    {pg.Videos.map((vid: string, i: number) => (
                                        <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border-light)", background: "black", aspectRatio: "1.77" }}>
                                            <video src={vid} style={{ width: "100%", height: "100%" }} controls />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location Map */}
                        {((pg.Latitude && pg.Longitude) || pg.GoogleMapsUrl) && (
                            <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-light)", marginBottom: "32px" }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: "24px" }}>Location Map</h2>
                                <div style={{ width: "100%", height: "350px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border-light)", marginBottom: "16px" }}>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={
                                            pg.Latitude && pg.Longitude
                                                ? `https://maps.google.com/maps?q=${pg.Latitude},${pg.Longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                                                : `https://maps.google.com/maps?q=${encodeURIComponent(pg.GoogleMapsUrl || "")}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                                        }
                                    />
                                </div>
                                {pg.GoogleMapsUrl && (
                                    <a href={pg.GoogleMapsUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline">🌐 Open in Google Maps</Button>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 4. Sticky Sidebar */}
                    <aside className="sidebar-sticky" style={{ position: "sticky", top: "120px", height: "fit-content" }}>
                        <div style={{ 
                            padding: "24px", 
                            border: "1px solid var(--border-light)", 
                            borderRadius: "16px", 
                            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                            background: "white"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
                                <div>
                                    <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>₹{pg.Rent}</span>
                                    <span style={{ color: "var(--text-secondary)" }}> / month</span>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                                <div style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.85rem" }}>
                                    <div style={{ fontWeight: 800, textTransform: "uppercase", fontSize: "0.7rem", marginBottom: "4px" }}>SECURITY DEPOSIT</div>
                                    <div>₹{pg.SecurityDeposit} (Refundable)</div>
                                </div>
                                <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                                    <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                                        <div style={{ fontSize: "0.7rem", fontWeight: 800 }}>CHECK-IN</div>
                                        <div style={{ fontSize: "0.85rem" }}>Flexible</div>
                                    </div>
                                    <div style={{ padding: "12px", display: "flex", justifyContent: "space-between" }}>
                                        <div style={{ fontSize: "0.7rem", fontWeight: 800 }}>GUESTS</div>
                                        <div style={{ fontSize: "0.85rem" }}>1 guest</div>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/pg/${id}/apply`}>
                                <Button size="lg" fullWidth shadow="lg" style={{ marginBottom: "16px", borderRadius: "12px" }}>
                                    ✨ Apply to Stay
                                </Button>
                            </Link>

                            <Button 
                                variant="outline" 
                                size="lg" 
                                fullWidth 
                                style={{ marginBottom: "16px", borderRadius: "12px" }}
                                onClick={() => setShowContactModal(true)}
                            >
                                📞 Contact Owner
                            </Button>

                            <Button 
                                variant="outline" 
                                size="lg" 
                                fullWidth 
                                style={{ marginBottom: "16px", borderRadius: "12px" }}
                                onClick={handleChatClick}
                            >
                                💬 Chat with Owner
                            </Button>
                            
                            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                No brokerage. Direct owner connect.
                            </p>

                            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border-light)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontWeight: 600 }}>
                                    <span>Monthly Rent</span>
                                    <span>₹{pg.Rent}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--text-secondary)" }}>
                                    <span>Service Fee</span>
                                    <span>₹0</span>
                                </div>
                                <Divider />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.125rem", fontWeight: 800 }}>
                                    <span>Total</span>
                                    <span>₹{pg.Rent}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </Container>

            {showContactModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(12px)",
                    zIndex: 3000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }} onClick={() => setShowContactModal(false)}>
                    <div style={{
                        background: "white",
                        width: "400px",
                        borderRadius: "24px",
                        padding: "32px",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        position: "relative"
                    }} onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setShowContactModal(false)}
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

                        <div style={{ textAlign: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "20px" }}>
                            <div style={{ 
                                width: "64px", 
                                height: "64px", 
                                borderRadius: "50%", 
                                background: "var(--bg-secondary)", 
                                color: "var(--primary)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                fontSize: "1.8rem", 
                                fontWeight: 800,
                                margin: "0 auto 12px"
                            }}>
                                👤
                            </div>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
                                Contact Property Owner
                            </h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "4px 0 0" }}>
                                Direct connection for verified residency inquiries.
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <div style={{ fontSize: "1.2rem", width: "24px" }}>👤</div>
                                <div>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>Owner Name</span>
                                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>{pg.Owner?.Name || "Property Owner"}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <div style={{ fontSize: "1.2rem", width: "24px" }}>📞</div>
                                <div>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>Phone Number</span>
                                    <a href={`tel:${pg.Owner?.Phone || "+919876543210"}`} style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
                                        {pg.Owner?.Phone || "+91 98765 43210"}
                                    </a>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <div style={{ fontSize: "1.2rem", width: "24px" }}>📧</div>
                                <div>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>Email Address</span>
                                    <a href={`mailto:${pg.Owner?.Email || "owner@pgconnect.com"}`} style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
                                        {pg.Owner?.Email || "owner@pgconnect.com"}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                            <Button 
                                variant="primary" 
                                fullWidth 
                                onClick={handleCopyPhone}
                                style={{
                                    transition: "all 0.3s ease",
                                    backgroundColor: copied ? "#10b981" : "var(--primary)",
                                    color: "#fff",
                                    border: `1px solid ${copied ? "#10b981" : "var(--primary)"}`
                                }}
                            >
                                {copied ? "✓ Copied!" : "📋 Copy Phone"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowContactModal(false)} style={{ flex: 1 }}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <ChatWidget 
                pgId={id as string} 
                ownerId={pg.OwnerId} 
                pgTitle={pg.Title} 
                isOpen={showChat} 
                onClose={() => setShowChat(false)} 
            />

            <Footer />
        </main>
    );
}

const Divider = () => <div style={{ height: "1px", background: "var(--border-light)", margin: "16px 0" }} />;
