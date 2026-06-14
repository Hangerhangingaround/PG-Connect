import React from "react";
import { Card } from "@/components/ui/Card";

export default function GuestSettingsPage() {
    return (
        <div>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>Settings</h1>
                <p style={{ color: "var(--text-secondary)" }}>Manage your account and preferences.</p>
            </div>
            <Card padding="32px">
                <p>Settings configuration coming soon.</p>
            </Card>
        </div>
    );
}
