import React from "react";
import { Card } from "@/components/ui/Card";

export default function GuestApplicationsPage() {
    return (
        <div>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>Applications</h1>
                <p style={{ color: "var(--text-secondary)" }}>View the status of your PG applications.</p>
            </div>
            <Card padding="32px">
                <p>No applications found.</p>
            </Card>
        </div>
    );
}
