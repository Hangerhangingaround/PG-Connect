import React from "react";
import { ChatDashboard } from "@/components/dashboard/ChatDashboard";

export default function GuestChatPage() {
    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>My Messages</h1>
                <p style={{ color: "var(--text-secondary)" }}>Communicate directly with the hosts of your stay inquiries.</p>
            </div>
            <ChatDashboard role="PAYING_GUEST" />
        </div>
    );
}
