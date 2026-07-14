import React from "react";
import { ChatDashboard } from "@/components/dashboard/ChatDashboard";

export default function OwnerChatPage() {
    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Inquiries & Messages</h1>
                <p style={{ color: "var(--text-secondary)" }}>Directly chat with prospective and active residents.</p>
            </div>
            <ChatDashboard role="PG_OWNER" />
        </div>
    );
}
