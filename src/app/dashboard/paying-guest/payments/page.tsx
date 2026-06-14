import React from "react";
import { Card } from "@/components/ui/Card";

export default function GuestPaymentsPage() {
    return (
        <div>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>Payments</h1>
                <p style={{ color: "var(--text-secondary)" }}>Manage your rent and deposit payments.</p>
            </div>
            <Card padding="32px">
                <p>Payment history coming soon.</p>
            </Card>
        </div>
    );
}
