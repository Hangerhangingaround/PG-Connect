"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAddPgForm } from "@/hooks/useAddPgForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { MobileContainer } from "@/components/ui/mobile/MobileContainer";
import { MobileImageUpload } from "@/components/ui/mobile/MobileImageUpload";
import { MobileFormSection } from "@/components/ui/mobile/MobileFormSection";
import { DesktopFormLayout } from "@/components/ui/desktop/DesktopFormLayout";
function VideoUpload({ formState, handlers, refs }: any) {
    return (
        <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "12px" }}>
                Videos ({formState.videos.length}/10)
            </label>
            <div
                onClick={() => refs.videoFileRef.current?.click()}
                style={{
                    border: "1px dashed var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "40px 16px",
                    textAlign: "center",
                    background: "var(--bg-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                }}
            >
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}>🎥</span>
                <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text)" }}>Upload videos</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>MP4, WEBM (Max 20MB)</p>
            </div>
            <input
                ref={refs.videoFileRef}
                type="file"
                accept="video/*"
                multiple
                hidden
                onChange={handlers.handleVideoFiles}
            />
            {formState.videoPreviews.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginTop: "16px" }}>
                    {formState.videoPreviews.map((p: string, i: number) => (
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                aspectRatio: "1.3",
                                borderRadius: "var(--radius)",
                                overflow: "hidden",
                                border: "1px solid var(--border-light)",
                                boxShadow: "var(--shadow-sm)",
                                background: "black"
                            }}
                        >
                            <video src={p} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls />
                            <button
                                type="button"
                                onClick={() => handlers.removeVideo(i)}
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.9)",
                                    color: "#222",
                                    border: "1px solid #ddd",
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                    zIndex: 10
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function LocationSection({ formState, handlers }: any) {
    return (
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
                <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Exact Location (GPS / Google Maps)
                </label>
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <Button type="button" variant="outline" onClick={handlers.getCurrentLocation} style={{ width: "100%", justifyContent: "center" }}>
                        📍 Get Current GPS Location
                    </Button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <Input 
                        label="Latitude" 
                        placeholder="e.g. 30.6682" 
                        value={formState.latitude} 
                        onChange={(e: any) => formState.setLatitude(e.target.value)} 
                        style={{ marginBottom: 0 }}
                    />
                    <Input 
                        label="Longitude" 
                        placeholder="e.g. 76.7223" 
                        value={formState.longitude} 
                        onChange={(e: any) => formState.setLongitude(e.target.value)} 
                        style={{ marginBottom: 0 }}
                    />
                </div>
                <Input 
                    label="Google Maps Share Link (Optional)" 
                    placeholder="e.g. https://maps.app.goo.gl/..." 
                    value={formState.googleMapsUrl} 
                    onChange={(e: any) => formState.setGoogleMapsUrl(e.target.value)} 
                    style={{ marginBottom: 0 }}
                />
            </div>
        </div>
    );
}

export default function AddPgPage() {
    const { formState, handlers, refs } = useAddPgForm();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const successOverlay = formState.success && (
        <div style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            background: "rgba(255, 255, 255, 0.7)", 
            backdropFilter: "blur(12px)", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 2000,
            textAlign: "center",
            padding: "24px",
            animation: "fadeIn 0.3s ease-out"
        }}>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
            <div style={{ 
                background: "white", 
                padding: "48px", 
                borderRadius: "32px", 
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "500px",
                width: "90%"
            }}>
                <div style={{ fontSize: "5rem", marginBottom: "24px" }}>🎉</div>
                <h3 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text)", marginBottom: "12px", letterSpacing: "-1px" }}>
                    PG Listed!
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", marginBottom: "40px", lineHeight: 1.6 }}>
                    Your property is now live and waiting for thousands of students to discover it.
                </p>
                <Link href="/">
                    <Button size="lg" shadow="lg" fullWidth>Go to Homepage</Button>
                </Link>
            </div>
        </div>
    );

    const formContent = (
        <form onSubmit={handlers.handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                
                {/* 1. Basics */}
                <MobileFormSection title="1. Basics">
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: "20px" }}>
                        <Input 
                            label="PG Name" 
                            placeholder="e.g. Green Valley PG" 
                            value={formState.title} 
                            onChange={(e) => formState.setTitle(e.target.value)} 
                            required 
                        />
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "8px" }}>
                                Preferred Tenant
                            </label>
                            <select 
                                value={formState.genderPreference} 
                                onChange={(e) => formState.setGenderPreference(e.target.value)}
                                style={{ 
                                    width: "100%", 
                                    padding: "12px 16px", 
                                    border: "1px solid var(--border)", 
                                    borderRadius: "var(--radius)", 
                                    outline: "none", 
                                    fontSize: "1rem", 
                                    background: "white",
                                    color: "var(--text)",
                                    height: "48px"
                                }}
                            >
                                <option value="ANY">Anyone (Unisex)</option>
                                <option value="MALE">Boys Only</option>
                                <option value="FEMALE">Girls Only</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>
                </MobileFormSection>

                {/* 2. Pricing */}
                <MobileFormSection title="2. Pricing">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Input 
                            label="Monthly Rent (₹)" 
                            type="number" 
                            placeholder="e.g. 8000"
                            value={formState.rent} 
                            onChange={(e) => formState.setRent(e.target.value)} 
                            required 
                        />
                        <Input 
                            label="Security Deposit (₹)" 
                            type="number" 
                            placeholder="e.g. 10000"
                            value={formState.deposit} 
                            onChange={(e) => formState.setDeposit(e.target.value)} 
                            required 
                        />
                    </div>
                </MobileFormSection>

                {/* 3. Location Details */}
                <MobileFormSection title="3. Location Details">
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
                        <Input 
                            label="City" 
                            placeholder="e.g. Mohali" 
                            value={formState.city} 
                            onChange={(e) => formState.setCity(e.target.value)} 
                            required 
                        />
                        <Input 
                            label="Area" 
                            placeholder="e.g. Sector 81" 
                            value={formState.area} 
                            onChange={(e) => formState.setArea(e.target.value)} 
                            required 
                        />
                    </div>
                    <Input 
                        label="Full Address" 
                        placeholder="Detailed address with block, street name..." 
                        value={formState.fullAddress} 
                        onChange={(e) => formState.setFullAddress(e.target.value)} 
                        required 
                    />
                    <LocationSection formState={formState} handlers={handlers} />
                </MobileFormSection>

                {/* 4. Property Structure */}
                <MobileFormSection title="4. Property Structure">
                    <div style={{ background: "var(--bg-secondary)", padding: isMobile ? "16px" : "24px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Floors & Rooms Configuration</h4>
                            <Button type="button" variant="outline" size="sm" onClick={handlers.addFloor}>+ Add Floor</Button>
                        </div>
     
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {formState.floors.map((floor: any) => (
                                <div key={floor.FloorNumber} style={{ padding: isMobile ? "16px" : "20px", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                        <h5 style={{ fontWeight: 700, fontSize: "0.95rem" }}>Floor {floor.FloorNumber}</h5>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => handlers.addRoom(floor.FloorNumber)}>+ Add Room</Button>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => handlers.removeFloor(floor.FloorNumber)} style={{ color: "var(--error)" }}>Remove Floor</Button>
                                        </div>
                                    </div>
     
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {floor.Rooms.map((room: any) => (
                                            <div 
                                                key={room.RoomId} 
                                                style={{ 
                                                    display: "grid", 
                                                    gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1.2fr 100px 40px", 
                                                    gap: "12px", 
                                                    alignItems: "end", 
                                                    background: "var(--bg-secondary)", 
                                                    padding: "16px", 
                                                    paddingRight: isMobile ? "40px" : "16px",
                                                    borderRadius: "8px", 
                                                    border: "1px solid var(--border-light)",
                                                    position: "relative"
                                                }}
                                            >
                                                <Input 
                                                    label="No." 
                                                    value={room.RoomNumber} 
                                                    onChange={(e: any) => handlers.updateRoom(floor.FloorNumber, room.RoomId, { RoomNumber: e.target.value })} 
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <div>
                                                    <label style={{ fontSize: "0.75rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>TYPE</label>
                                                    <select 
                                                        value={room.Type} 
                                                        onChange={(e: any) => handlers.updateRoom(floor.FloorNumber, room.RoomId, { Type: e.target.value as any })}
                                                        style={{ width: "100%", padding: "10px", background: "white", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.9rem", height: "40px" }}
                                                    >
                                                        <option value="Single">Single</option>
                                                        <option value="Double">Double</option>
                                                        <option value="Triple">Triple</option>
                                                        <option value="Quadruple">Quadruple</option>
                                                    </select>
                                                </div>
                                                <Input 
                                                    label="Price (₹)" 
                                                    type="number" 
                                                    value={room.Price || ""} 
                                                    onChange={(e: any) => handlers.updateRoom(floor.FloorNumber, room.RoomId, { Price: +e.target.value })} 
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <div>
                                                    <label style={{ fontSize: "0.75rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>STATUS</label>
                                                    <select 
                                                        value={room.Status} 
                                                        onChange={(e: any) => handlers.updateRoom(floor.FloorNumber, room.RoomId, { Status: e.target.value as any })}
                                                        style={{ width: "100%", padding: "10px", background: "white", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.9rem", height: "40px" }}
                                                    >
                                                        <option value="AVAILABLE">Available</option>
                                                        <option value="LOCKED">Locked</option>
                                                        <option value="FULL">Full</option>
                                                    </select>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handlers.removeRoom(floor.FloorNumber, room.RoomId)}
                                                    style={isMobile ? {
                                                        position: "absolute",
                                                        top: "8px",
                                                        right: "8px",
                                                        border: "none",
                                                        background: "none",
                                                        color: "var(--error)",
                                                        cursor: "pointer",
                                                        fontSize: "1.25rem",
                                                        zIndex: 10
                                                    } : {
                                                        height: "40px",
                                                        width: "40px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        border: "none",
                                                        background: "none",
                                                        color: "var(--error)",
                                                        cursor: "pointer",
                                                        fontSize: "1.25rem"
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        {floor.Rooms.length === 0 && (
                                            <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem", padding: "20px", border: "1px dashed var(--border)", borderRadius: "12px" }}>No rooms added to this floor.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {formState.floors.length === 0 && (
                                <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "1rem", padding: "40px", border: "2px dashed var(--border)", borderRadius: "16px" }}>Start by adding the first floor of your property.</p>
                            )}
                        </div>
                    </div>
                </MobileFormSection>

                {/* 5. Amenities & Highlights */}
                <MobileFormSection title="5. Amenities & Highlights">
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {/* Amenities */}
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "12px" }}>Amenities</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                                {formState.amenities.map((a: string, i: number) => (
                                    <div key={i} style={{ padding: "8px 16px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "20px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
                                        {a}
                                        <button type="button" onClick={() => formState.setAmenities(formState.amenities.filter((_: any, idx: number) => idx !== i))} style={{ border: "none", background: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center" }}>✕</button>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: "12px", maxWidth: "500px" }}>
                                <Input placeholder="e.g. WiFi, AC, Geyser" value={formState.newAmenity} onChange={(e: any) => formState.setNewAmenity(e.target.value)} style={{ marginBottom: 0 }} />
                                <Button type="button" variant="outline" onClick={() => { if (formState.newAmenity.trim()) { formState.setAmenities([...formState.amenities, formState.newAmenity.trim()]); formState.setNewAmenity(""); } }}>Add</Button>
                            </div>
                        </div>

                        {/* Landmarks */}
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "12px" }}>Nearby Landmarks</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                                {formState.landmarks.map((l: any, i: number) => (
                                    <div key={i} style={{ padding: "8px 16px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "20px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
                                        🚶 {l.distance} from {l.name}
                                        <button type="button" onClick={() => formState.setLandmarks(formState.landmarks.filter((_: any, idx: number) => idx !== i))} style={{ border: "none", background: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center" }}>✕</button>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: "12px", maxWidth: "600px" }}>
                                <Input placeholder="Name (e.g. Plaksha)" value={formState.newLandmark.name} onChange={(e: any) => formState.setNewLandmark({...formState.newLandmark, name: e.target.value})} style={{ marginBottom: 0 }} />
                                <Input placeholder="Distance" value={formState.newLandmark.distance} onChange={(e: any) => formState.setNewLandmark({...formState.newLandmark, distance: e.target.value})} style={{ marginBottom: 0 }} />
                                <Button type="button" variant="outline" onClick={() => { if (formState.newLandmark.name && formState.newLandmark.distance) { formState.setLandmarks([...formState.landmarks, formState.newLandmark]); formState.setNewLandmark({name: "", distance: ""}); } }}>Add</Button>
                            </div>
                        </div>

                        {/* Rent Agreement */}
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "12px" }}>Rent Agreement</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "600px" }}>
                                <Input label="Min duration (months)" type="number" value={formState.minMonths} onChange={(e: any) => formState.setMinMonths(e.target.value)} />
                                <Input label="Max duration (months)" type="number" value={formState.maxMonths} onChange={(e: any) => formState.setMaxMonths(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </MobileFormSection>

                {/* 6. Description */}
                <MobileFormSection title="6. Description">
                    <TextArea 
                        label="About the PG" 
                        placeholder="Detail rules, timings, food inclusion, security setup, target crowd..." 
                        value={formState.description} 
                        onChange={(e: any) => formState.setDescription(e.target.value)} 
                        required 
                    />
                </MobileFormSection>

                {/* 7. Media Uploads */}
                <MobileFormSection title="7. Media Uploads">
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "24px" }}>
                        <MobileImageUpload 
                            images={formState.images} 
                            previews={formState.previews} 
                            onUpload={handlers.handleFiles} 
                            onRemove={handlers.removeImage} 
                            fileRef={refs.fileRef} 
                        />
                        <VideoUpload 
                            formState={formState} 
                            handlers={handlers} 
                            refs={refs} 
                        />
                    </div>
                </MobileFormSection>

                {/* 8. Contact Details & Publish */}
                <MobileFormSection title="8. Contact Details & Publish">
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                        <Input 
                            label="Contact Phone" 
                            placeholder="e.g. 9876543210"
                            value={formState.contactPhone} 
                            onChange={(e: any) => formState.setContactPhone(e.target.value)} 
                            required 
                        />
                        <Input 
                            label="Contact Email" 
                            type="email" 
                            placeholder="e.g. manager@pg.com"
                            value={formState.contactEmail} 
                            onChange={(e: any) => formState.setContactEmail(e.target.value)} 
                        />
                    </div>
                    <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px", marginTop: "16px" }}>
                        <Button 
                            type="submit" 
                            fullWidth 
                            size="lg" 
                            disabled={formState.submitting}
                        >
                            {formState.submitting ? "Publishing..." : "🚀 Publish Listing"}
                        </Button>
                        
                        {formState.error && (
                            <p style={{ color: "var(--error)", fontSize: "0.95rem", textAlign: "center", marginTop: "16px", fontWeight: 500 }}>
                                {formState.error}
                            </p>
                        )}
                    </div>
                </MobileFormSection>

            </div>
        </form>
    );

    if (isMobile) {
        return (
            <>
                <nav className="navbar" style={{ padding: "12px 24px" }}>
                    <Link href="/" className="logo" style={{ fontSize: "1.25rem" }}>PGXplore</Link>
                </nav>
                <MobileContainer title="List your PG">
                    <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginBottom: "32px" }}>
                        It's easy to get started. Just fill out the details.
                    </p>
                    {formContent}
                    <div style={{ height: "60px" }} />
                </MobileContainer>
                {successOverlay}
            </>
        );
    }

    return (
        <>
            <nav className="navbar">
                <Link href="/" className="logo">PGXplore</Link>
                <Link href="/owner/add-pg">
                    <Button size="sm">List your PG</Button>
                </Link>
            </nav>
            <DesktopFormLayout 
                title="List your PG" 
                subtitle="Reach thousands of students searching for verified homes near campus."
            >
                {formContent}
            </DesktopFormLayout>
            {successOverlay}
        </>
    );
}


