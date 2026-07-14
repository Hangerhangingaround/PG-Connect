"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Lock, 
    LogOut, 
    Bell, 
    Save, 
    Check, 
    AlertCircle,
    UserCheck
} from "lucide-react";

export const SettingsPanel: React.FC = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Profile state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("OTHER");
    const [permanentAddress, setPermanentAddress] = useState("");

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Notification states (simulated / stored in local storage per user for visual representation)
    const [emailNotif, setEmailNotif] = useState(true);
    const [whatsappNotif, setWhatsappNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/user/settings");
                if (res.ok) {
                    const data = await res.json();
                    setName(data.Name || "");
                    setEmail(data.Email || "");
                    setPhone(data.Phone || "");
                    setGender(data.Gender || "OTHER");
                    setPermanentAddress(data.PermanentAddress || "");

                    // Retrieve local storage notifications if available
                    if (data.Email) {
                        const savedPrefs = localStorage.getItem(`notif_prefs_${data.Email}`);
                        if (savedPrefs) {
                            const parsed = JSON.parse(savedPrefs);
                            setEmailNotif(parsed.email ?? true);
                            setWhatsappNotif(parsed.whatsapp ?? true);
                            setPushNotif(parsed.push ?? false);
                        }
                    }
                } else {
                    setErrorMsg("Failed to load user settings.");
                }
            } catch (err) {
                console.error("Error loading settings:", err);
                setErrorMsg("An error occurred loading settings.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg("");
        setErrorMsg("");

        // Validation for password change
        if (newPassword || confirmPassword) {
            if (!currentPassword) {
                setErrorMsg("Please enter your current password to set a new password.");
                setSaving(false);
                return;
            }
            if (newPassword !== confirmPassword) {
                setErrorMsg("New password and confirm password do not match.");
                setSaving(false);
                return;
            }
            if (newPassword.length < 6) {
                setErrorMsg("New password must be at least 6 characters long.");
                setSaving(false);
                return;
            }
        }

        try {
            const updateBody: any = {
                name,
                phone,
                permanentAddress,
                gender,
            };

            if (newPassword) {
                updateBody.password = currentPassword;
                updateBody.newPassword = newPassword;
            }

            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateBody)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccessMsg("Settings updated successfully!");
                // Clear password fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                // Save notification preferences
                if (email) {
                    localStorage.setItem(
                        `notif_prefs_${email}`,
                        JSON.stringify({ email: emailNotif, whatsapp: whatsappNotif, push: pushNotif })
                    );
                }
            } else {
                setErrorMsg(data.error || "Failed to save settings.");
            }
        } catch (err) {
            console.error("Error saving settings:", err);
            setErrorMsg("An error occurred while saving settings.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                <div style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Loading settings...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Status Banners */}
                {successMsg && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: "rgba(16, 185, 129, 0.1)",
                        color: "#10b981",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        border: "1px solid rgba(16, 185, 129, 0.2)"
                    }}>
                        <Check size={20} />
                        <span>{successMsg}</span>
                    </div>
                )}

                {errorMsg && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        border: "1px solid rgba(239, 68, 68, 0.2)"
                    }}>
                        <AlertCircle size={20} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Profile Information Card */}
                <Card padding="32px">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "rgba(255, 56, 92, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)"
                        }}>
                            <User size={20} />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>Profile Information</h3>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        {/* Full Name */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                                Full Name
                            </label>
                            <div style={{ position: "relative" }}>
                                <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px 12px 40px",
                                        borderRadius: "10px",
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg-secondary)",
                                        color: "var(--text)",
                                        outline: "none",
                                        fontSize: "0.95rem"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                                Email Address
                            </label>
                            <div style={{ position: "relative" }}>
                                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    placeholder="your-email@example.com"
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px 12px 40px",
                                        borderRadius: "10px",
                                        border: "1px solid var(--border-light)",
                                        background: "rgba(226, 232, 240, 0.5)",
                                        color: "var(--text-secondary)",
                                        cursor: "not-allowed",
                                        fontSize: "0.95rem"
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        {/* Phone Number */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                                Phone Number
                            </label>
                            <div style={{ position: "relative" }}>
                                <Phone size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter 10-digit number"
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px 12px 40px",
                                        borderRadius: "10px",
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg-secondary)",
                                        color: "var(--text)",
                                        outline: "none",
                                        fontSize: "0.95rem"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                                Gender
                            </label>
                            <div style={{ position: "relative" }}>
                                <UserCheck size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px 12px 40px",
                                        borderRadius: "10px",
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg-secondary)",
                                        color: "var(--text)",
                                        outline: "none",
                                        fontSize: "0.95rem",
                                        appearance: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Permanent Address */}
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                            Permanent Address
                        </label>
                        <div style={{ position: "relative" }}>
                            <MapPin size={16} style={{ position: "absolute", left: "14px", top: "16px", color: "var(--text-secondary)" }} />
                            <textarea
                                value={permanentAddress}
                                onChange={(e) => setPermanentAddress(e.target.value)}
                                placeholder="Enter permanent home address"
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: "12px 14px 12px 40px",
                                    borderRadius: "10px",
                                    border: "1px solid var(--border-light)",
                                    background: "var(--bg-secondary)",
                                    color: "var(--text)",
                                    outline: "none",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    resize: "none"
                                }}
                            />
                        </div>
                    </div>
                </Card>

                {/* Change Password Card */}
                <Card padding="32px">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "rgba(16, 185, 129, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#10b981"
                        }}>
                            <Lock size={20} />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>Security / Change Password</h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* Current Password */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                                Current Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px 12px 40px",
                                        borderRadius: "10px",
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg-secondary)",
                                        color: "var(--text)",
                                        outline: "none",
                                        fontSize: "0.95rem"
                                    }}
                                />
                            </div>
                        </div>

                        {/* New Password & Confirm Password */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                                    New Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px 12px 40px",
                                            borderRadius: "10px",
                                            border: "1px solid var(--border-light)",
                                            background: "var(--bg-secondary)",
                                            color: "var(--text)",
                                            outline: "none",
                                            fontSize: "0.95rem"
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>
                                    Confirm New Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat new password"
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px 12px 40px",
                                            borderRadius: "10px",
                                            border: "1px solid var(--border-light)",
                                            background: "var(--bg-secondary)",
                                            color: "var(--text)",
                                            outline: "none",
                                            fontSize: "0.95rem"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Notifications & Preferences Card */}
                <Card padding="32px">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "rgba(245, 158, 11, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#f59e0b"
                        }}>
                            <Bell size={20} />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>Notification Preferences</h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Email Alert Toggle */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "var(--bg-secondary)", borderRadius: "10px" }}>
                            <div>
                                <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 700 }}>Email Notifications</h4>
                                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>Receive status updates, booking logs, and inquiries via email.</p>
                            </div>
                            <input 
                                type="checkbox"
                                checked={emailNotif}
                                onChange={(e) => setEmailNotif(e.target.checked)}
                                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--primary)" }}
                            />
                        </div>

                        {/* WhatsApp Toggles */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "var(--bg-secondary)", borderRadius: "10px" }}>
                            <div>
                                <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 700 }}>WhatsApp Chat Alerts</h4>
                                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>Get high-priority immediate chat alerts on WhatsApp.</p>
                            </div>
                            <input 
                                type="checkbox"
                                checked={whatsappNotif}
                                onChange={(e) => setWhatsappNotif(e.target.checked)}
                                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--primary)" }}
                            />
                        </div>

                        {/* Push Notifications Toggle */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "var(--bg-secondary)", borderRadius: "10px" }}>
                            <div>
                                <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 700 }}>Desktop Push Messages</h4>
                                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>Display real-time desktop banners when user triggers a chat message.</p>
                            </div>
                            <input 
                                type="checkbox"
                                checked={pushNotif}
                                onChange={(e) => setPushNotif(e.target.checked)}
                                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--primary)" }}
                            />
                        </div>
                    </div>
                </Card>

                {/* Form Actions Section */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginTop: "12px" }}>
                    
                    {/* Logout Button */}
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleLogout}
                        style={{ 
                            borderColor: "var(--error)", 
                            color: "var(--error)", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px",
                            background: "transparent"
                        }}
                    >
                        <LogOut size={16} />
                        Logout Session
                    </Button>

                    {/* Save Button */}
                    <Button 
                        type="submit" 
                        disabled={saving}
                        style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "150px", justifyContent: "center" }}
                    >
                        <Save size={16} />
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
