"use client";

import React from "react";
import { useAddPgForm } from "@/hooks/useAddPgForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { 
    Trash2, 
    Plus, 
    Building2, 
    Sparkles, 
    Upload, 
    X, 
    MapPin, 
    DollarSign, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    Percent,
    ShieldCheck
} from "lucide-react";

export const AddPgForm: React.FC = () => {
    const { formState, handlers, refs } = useAddPgForm();
    const {
        title, setTitle,
        description, setDescription,
        fullAddress, setFullAddress,
        city, setCity,
        area, setArea,
        rent, setRent,
        deposit, setDeposit,
        contactPhone, setContactPhone,
        contactEmail, setContactEmail,
        floors,
        amenities, setAmenities,
        newAmenity, setNewAmenity,
        landmarks, setLandmarks,
        newLandmark, setNewLandmark,
        minMonths, setMinMonths,
        maxMonths, setMaxMonths,
        conditions, setConditions,
        previews,
        submitting, error, success,
        genderPreference, setGenderPreference,
        videos, setVideos,
        videoPreviews, setVideoPreviews,
        latitude, setLatitude,
        longitude, setLongitude,
        googleMapsUrl, setGoogleMapsUrl
    } = formState;

    const {
        handleFiles,
        removeImage,
        handleSubmit,
        addFloor,
        removeFloor,
        addRoom,
        updateRoom,
        removeRoom,
        handleVideoFiles,
        removeVideo,
        getCurrentLocation
    } = handlers;

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: "1.25rem",
        fontWeight: 800,
        color: "var(--text)",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderBottom: "1px solid var(--border-light)",
        paddingBottom: "10px"
    };

    const flexGridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "10px"
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "900px", margin: "0 auto" }}>
            {success && (
                <div style={{
                    background: "#10b9811a",
                    border: "1px solid #10b98133",
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.05)"
                }}>
                    <CheckCircle size={48} color="#10b981" />
                    <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981", marginBottom: "4px" }}>Listing Created Successfully!</h3>
                        <p style={{ color: "var(--text-secondary)" }}>Your property is now listed. Redirecting to home page...</p>
                    </div>
                </div>
            )}

            {error && (
                <div style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "var(--error)"
                }}>
                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{error}</p>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* 1. Basic Information */}
                <Card padding="32px">
                    <h3 style={sectionTitleStyle}>
                        <Building2 size={20} color="var(--primary)" /> Basic Information
                    </h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        <Input 
                            label="Listing Title" 
                            placeholder="e.g. Zenith Premium Boys PG near Plaksha" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            style={{ marginBottom: 0 }}
                        />
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "8px" }}>
                                Preferred Tenant
                            </label>
                            <select 
                                value={genderPreference} 
                                onChange={(e) => setGenderPreference(e.target.value)}
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
                    
                    <TextArea 
                        label="Description" 
                        placeholder="Provide an extensive description of your property, atmosphere, hygiene standards, and surrounding highlights..." 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </Card>

                {/* 2. Contact Details */}
                <Card padding="32px">
                    <h3 style={sectionTitleStyle}>
                        <ShieldCheck size={20} color="var(--primary)" /> Owner Contact Information
                    </h3>
                    <div style={flexGridStyle}>
                        <Input 
                            label="Contact Phone" 
                            type="tel"
                            placeholder="e.g. +91 98765 43210" 
                            value={contactPhone} 
                            onChange={(e) => setContactPhone(e.target.value)} 
                            required 
                        />
                        <Input 
                            label="Contact Email" 
                            type="email"
                            placeholder="e.g. owner@pgconnect.com" 
                            value={contactEmail} 
                            onChange={(e) => setContactEmail(e.target.value)} 
                            required 
                        />
                    </div>
                </Card>

                {/* 3. Location Details */}
                <Card padding="32px">
                    <h3 style={sectionTitleStyle}>
                        <MapPin size={20} color="var(--primary)" /> Location Details
                    </h3>
                    
                    <Input 
                        label="Full Street Address" 
                        placeholder="e.g. House No. 24, Sector 62..." 
                        value={fullAddress} 
                        onChange={(e) => setFullAddress(e.target.value)} 
                        required 
                    />

                    <div style={flexGridStyle}>
                        <Input 
                            label="City" 
                            placeholder="e.g. Mohali" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            required 
                        />
                        <Input 
                            label="Area / Locality" 
                            placeholder="e.g. IT City" 
                            value={area} 
                            onChange={(e) => setArea(e.target.value)} 
                            required 
                        />
                    </div>

                    <div style={{ borderTop: "1px dashed var(--border-light)", paddingTop: "20px", marginTop: "10px" }}>
                        <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                            Exact Location (GPS / Google Maps)
                        </label>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                            <Button type="button" variant="outline" onClick={getCurrentLocation} style={{ width: "100%", justifyContent: "center" }}>
                                📍 Get Current GPS Location
                            </Button>
                        </div>
                        <div style={flexGridStyle}>
                            <Input 
                                label="Latitude" 
                                placeholder="e.g. 30.6682" 
                                value={latitude} 
                                onChange={(e) => setLatitude(e.target.value)} 
                                style={{ marginBottom: 0 }}
                            />
                            <Input 
                                label="Longitude" 
                                placeholder="e.g. 76.7223" 
                                value={longitude} 
                                onChange={(e) => setLongitude(e.target.value)} 
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                        <Input 
                            label="Google Maps Share Link (Optional)" 
                            placeholder="e.g. https://maps.app.goo.gl/..." 
                            value={googleMapsUrl} 
                            onChange={(e) => setGoogleMapsUrl(e.target.value)} 
                        />
                    </div>
                </Card>

                {/* 4. Pricing & Agreements */}
                <Card padding="32px">
                    <h3 style={sectionTitleStyle}>
                        <DollarSign size={20} color="var(--primary)" /> Financials & Agreement
                    </h3>

                    <div style={flexGridStyle}>
                        <Input 
                            label="Base Rent (₹ / month)" 
                            type="number" 
                            placeholder="e.g. 12000" 
                            value={rent} 
                            onChange={(e) => setRent(e.target.value)} 
                            required 
                        />
                        <Input 
                            label="Security Deposit (₹)" 
                            type="number" 
                            placeholder="e.g. 24000" 
                            value={deposit} 
                            onChange={(e) => setDeposit(e.target.value)} 
                            required 
                        />
                    </div>

                    <div style={flexGridStyle}>
                        <Input 
                            label="Min Agreement duration (Months)" 
                            type="number" 
                            value={minMonths} 
                            onChange={(e) => setMinMonths(e.target.value)} 
                            required 
                        />
                        <Input 
                            label="Max Agreement duration (Months)" 
                            type="number" 
                            value={maxMonths} 
                            onChange={(e) => setMaxMonths(e.target.value)} 
                            required 
                        />
                    </div>

                    <TextArea 
                        label="Rent Agreement Conditions (Optional)" 
                        placeholder="e.g. Security deposit fully refundable upon exit with 1 month prior notice. Electricity charged separately..." 
                        value={conditions} 
                        onChange={(e) => setConditions(e.target.value)} 
                    />
                </Card>

                {/* 5. Amenities & Landmarks */}
                <Card padding="32px">
                    <h3 style={sectionTitleStyle}>
                        <Sparkles size={20} color="var(--primary)" /> Highlights & Amenities
                    </h3>

                    {/* Amenities Add */}
                    <div style={{ marginBottom: "28px" }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
                            Amenities
                        </label>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ flex: 1 }}>
                                <input 
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        background: "var(--bg)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius)",
                                        color: "var(--text)",
                                        fontSize: "1rem",
                                        outline: "none"
                                    }}
                                    placeholder="e.g. Free Wi-Fi, AC, 3-Tier Security, Daily Cleaning..."
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            if (newAmenity.trim()) {
                                                setAmenities([...amenities, newAmenity.trim()]);
                                                setNewAmenity("");
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => {
                                    if (newAmenity.trim()) {
                                        setAmenities([...amenities, newAmenity.trim()]);
                                        setNewAmenity("");
                                    }
                                }}
                            >
                                <Plus size={18} /> Add
                            </Button>
                        </div>

                        {/* Amenities List */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {amenities.map((item, idx) => (
                                <div 
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "6px 14px",
                                        background: "var(--primary-light)",
                                        color: "var(--primary)",
                                        borderRadius: "20px",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setAmenities(amenities.filter((_, i) => i !== idx))}
                                >
                                    {item} <X size={12} />
                                </div>
                            ))}
                            {amenities.length === 0 && (
                                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>No amenities added yet. Press Enter or click Add to listing.</p>
                            )}
                        </div>
                    </div>

                    {/* Landmarks Add */}
                    <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
                            Nearby Landmarks
                        </label>
                        
                        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                            <input 
                                style={{
                                    flex: 2,
                                    padding: "12px 16px",
                                    background: "var(--bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "var(--radius)",
                                    color: "var(--text)",
                                    fontSize: "1rem",
                                    outline: "none"
                                }}
                                placeholder="Landmark e.g. Plaksha University"
                                value={newLandmark.name}
                                onChange={(e) => setNewLandmark({ ...newLandmark, name: e.target.value })}
                            />
                            <input 
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    background: "var(--bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "var(--radius)",
                                    color: "var(--text)",
                                    fontSize: "1rem",
                                    outline: "none"
                                }}
                                placeholder="e.g. 5 min walk"
                                value={newLandmark.distance}
                                onChange={(e) => setNewLandmark({ ...newLandmark, distance: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (newLandmark.name.trim() && newLandmark.distance.trim()) {
                                            setLandmarks([...landmarks, { name: newLandmark.name.trim(), distance: newLandmark.distance.trim() }]);
                                            setNewLandmark({ name: "", distance: "" });
                                        }
                                    }
                                }}
                            />
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => {
                                    if (newLandmark.name.trim() && newLandmark.distance.trim()) {
                                        setLandmarks([...landmarks, { name: newLandmark.name.trim(), distance: newLandmark.distance.trim() }]);
                                        setNewLandmark({ name: "", distance: "" });
                                    }
                                }}
                            >
                                <Plus size={18} /> Add
                            </Button>
                        </div>

                        {/* Landmarks List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {landmarks.map((landmark, idx) => (
                                <div 
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 16px",
                                        background: "var(--bg-secondary)",
                                        border: "1px solid var(--border-light)",
                                        borderRadius: "12px",
                                        fontSize: "0.9rem"
                                    }}
                                >
                                    <div>
                                        <span style={{ fontWeight: 700, color: "var(--text)" }}>🚶 {landmark.distance}</span>
                                        <span style={{ color: "var(--text-secondary)" }}> from {landmark.name}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer" }}
                                        onClick={() => setLandmarks(landmarks.filter((_, i) => i !== idx))}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {landmarks.length === 0 && (
                                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>No nearby landmarks listed.</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* 6. Dynamic Floors & Rooms Layout */}
                <Card padding="32px">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
                            <Building2 size={20} color="var(--primary)" /> Floor & Room Configurator
                        </h3>
                        <Button type="button" size="sm" onClick={addFloor}>
                            <Plus size={16} /> Add Floor
                        </Button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {floors.map((floor) => (
                            <div 
                                key={floor.FloorNumber}
                                style={{
                                    border: "1px solid var(--border)",
                                    borderRadius: "16px",
                                    padding: "20px",
                                    background: "var(--bg-secondary)"
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h4 style={{ fontWeight: 800, fontSize: "1.1rem", margin: 0, color: "var(--text)" }}>
                                        Floor {floor.FloorNumber}
                                    </h4>
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <Button type="button" size="sm" variant="outline" onClick={() => addRoom(floor.FloorNumber)}>
                                            <Plus size={14} /> Add Room
                                        </Button>
                                        <button 
                                            type="button" 
                                            style={{
                                                background: "rgba(193, 53, 17, 0.08)",
                                                border: "none",
                                                color: "var(--error)",
                                                padding: "6px 12px",
                                                borderRadius: "8px",
                                                fontWeight: 700,
                                                fontSize: "0.8rem",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px"
                                            }}
                                            onClick={() => removeFloor(floor.FloorNumber)}
                                        >
                                            <Trash2 size={14} /> Remove Floor
                                        </button>
                                    </div>
                                </div>

                                {/* Rooms list inside this floor */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {floor.Rooms.map((room) => (
                                        <div 
                                            key={room.RoomId}
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1.2fr 1.2fr 1fr auto",
                                                gap: "12px",
                                                alignItems: "end",
                                                background: "var(--bg-card)",
                                                padding: "16px",
                                                borderRadius: "12px",
                                                border: "1px solid var(--border-light)"
                                            }}
                                        >
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "6px" }}>Room #</label>
                                                <input 
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        background: "var(--bg)",
                                                        border: "1px solid var(--border)",
                                                        borderRadius: "8px",
                                                        color: "var(--text)",
                                                        fontSize: "0.9rem",
                                                        outline: "none"
                                                    }}
                                                    value={room.RoomNumber}
                                                    onChange={(e) => updateRoom(floor.FloorNumber, room.RoomId, { RoomNumber: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "6px" }}>Room Type</label>
                                                <select 
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        background: "var(--bg)",
                                                        border: "1px solid var(--border)",
                                                        borderRadius: "8px",
                                                        color: "var(--text)",
                                                        fontSize: "0.9rem",
                                                        outline: "none"
                                                    }}
                                                    value={room.Type}
                                                    onChange={(e) => updateRoom(floor.FloorNumber, room.RoomId, { Type: e.target.value as any })}
                                                >
                                                    <option value="Single">Single Sharing</option>
                                                    <option value="Double">Double Sharing</option>
                                                    <option value="Triple">Triple Sharing</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "6px" }}>Room Rent (₹)</label>
                                                <input 
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        background: "var(--bg)",
                                                        border: "1px solid var(--border)",
                                                        borderRadius: "8px",
                                                        color: "var(--text)",
                                                        fontSize: "0.9rem",
                                                        outline: "none"
                                                    }}
                                                    type="number"
                                                    value={room.Price || ""}
                                                    placeholder="Price"
                                                    onChange={(e) => updateRoom(floor.FloorNumber, room.RoomId, { Price: parseFloat(e.target.value) || 0 })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "6px" }}>Max Guest Capacity</label>
                                                <input 
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        background: "var(--bg)",
                                                        border: "1px solid var(--border)",
                                                        borderRadius: "8px",
                                                        color: "var(--text)",
                                                        fontSize: "0.9rem",
                                                        outline: "none"
                                                    }}
                                                    type="number"
                                                    value={room.MaxCapacity || ""}
                                                    placeholder="Max capacity"
                                                    onChange={(e) => updateRoom(floor.FloorNumber, room.RoomId, { MaxCapacity: parseInt(e.target.value) || 1 })}
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "var(--error)",
                                                    cursor: "pointer",
                                                    padding: "8px",
                                                    marginBottom: "4px"
                                                }}
                                                onClick={() => removeRoom(floor.FloorNumber, room.RoomId)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {floor.Rooms.length === 0 && (
                                        <p style={{ textAlign: "center", padding: "16px 0", color: "var(--text-secondary)", fontSize: "0.85rem", border: "1px dashed var(--border-light)", borderRadius: "8px", background: "var(--bg-card)" }}>
                                            No rooms added on this floor yet. Click "Add Room" to begin.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {floors.length === 0 && (
                            <div style={{ textAlign: "center", padding: "40px", border: "2px dashed var(--border-light)", borderRadius: "20px" }}>
                                <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>Configure your property layouts to receive guest stays room-wise.</p>
                                <Button type="button" variant="outline" onClick={addFloor}>
                                    <Plus size={16} /> Configure First Floor
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* 7. Image Upload */}
                <Card padding="32px">
                    <h3 style={sectionTitleStyle}>
                        <Upload size={20} color="var(--primary)" /> Media Gallery
                    </h3>

                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        ref={refs.fileRef} 
                        onChange={handleFiles} 
                        style={{ display: "none" }} 
                    />

                    {/* Upload Dropzone */}
                    <div 
                        onClick={() => refs.fileRef.current?.click()}
                        style={{
                            border: "2px dashed var(--primary)",
                            background: "var(--primary-light)",
                            borderRadius: "16px",
                            padding: "40px 20px",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            marginBottom: "24px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(193, 53, 17, 0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary-light)"}
                    >
                        <Upload size={32} color="var(--primary)" style={{ margin: "0 auto 12px auto" }} />
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>Click to upload photos</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Supports JPG, PNG (Max 10 images)</p>
                    </div>

                    {/* Gallery Previews */}
                    {previews.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
                            {previews.map((url, idx) => (
                                <div 
                                    key={idx}
                                    style={{
                                        position: "relative",
                                        paddingTop: "100%",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        border: "1px solid var(--border-light)"
                                    }}
                                >
                                    <img 
                                        src={url} 
                                        alt="Preview" 
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(idx)}
                                        style={{
                                            position: "absolute",
                                            top: "6px",
                                            right: "6px",
                                            background: "rgba(193, 53, 17, 0.9)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "22px",
                                            height: "22px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                        }}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Video Gallery */}
                    <div style={{ borderTop: "1px dashed var(--border-light)", paddingTop: "24px", marginTop: "24px" }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "12px" }}>
                            Videos ({videos?.length || 0}/10)
                        </label>
                        <input
                            ref={refs.videoFileRef}
                            type="file"
                            accept="video/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleVideoFiles}
                        />
                        <div 
                            onClick={() => refs.videoFileRef.current?.click()}
                            style={{
                                border: "2px dashed var(--primary)",
                                background: "var(--primary-light)",
                                borderRadius: "16px",
                                padding: "40px 20px",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                marginBottom: "24px"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(193, 53, 17, 0.08)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary-light)"}
                        >
                            <span style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}>🎥</span>
                            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>Click to upload videos</h4>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Supports MP4, WEBM (Max 10 videos, max 20MB each)</p>
                        </div>

                        {videoPreviews?.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                                {videoPreviews.map((url, idx) => (
                                    <div 
                                        key={idx}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "1.3",
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            border: "1px solid var(--border-light)",
                                            background: "black"
                                        }}
                                    >
                                        <video src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls />
                                        <button 
                                            type="button" 
                                            onClick={() => removeVideo(idx)}
                                            style={{
                                                position: "absolute",
                                                top: "6px",
                                                right: "6px",
                                                background: "rgba(193, 53, 17, 0.9)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "22px",
                                                height: "22px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                zIndex: 10
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Submit Action */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "16px" }}>
                    <Button 
                        type="submit" 
                        size="lg" 
                        shadow="lg"
                        disabled={submitting || success}
                        style={{ minWidth: "180px", borderRadius: "12px" }}
                    >
                        {submitting ? (
                            <>
                                <Clock size={18} style={{ animation: "spin 1s linear infinite" }} /> Listing PG...
                            </>
                        ) : "✨ Publish Listing"}
                    </Button>
                </div>
            </div>
        </form>
    );
};
