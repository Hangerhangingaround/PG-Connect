import React from "react";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";

export default function OwnerSettingsPage() {
    return (
        <div>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>Settings</h1>
                <p style={{ color: "var(--text-secondary)" }}>Manage your account and notification preferences.</p>
            </div>
            <SettingsPanel />
        </div>
    );
}
