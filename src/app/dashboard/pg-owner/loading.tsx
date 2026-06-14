import React from "react";
import { Container } from "@/components/portfolio/Container";

export default function DashboardLoading() {
    return (
        <Container>
            <div style={{ marginBottom: "40px" }}>
                <div style={{ 
                    height: "40px", 
                    width: "200px", 
                    background: "var(--border-light)", 
                    borderRadius: "8px",
                    animation: "shimmer 1.5s infinite linear",
                    backgroundSize: "200% 100%",
                    backgroundImage: "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)"
                }} />
            </div>

            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
                gap: "24px" 
            }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ 
                        height: "300px", 
                        background: "var(--bg-card)", 
                        border: "1px solid var(--border-light)", 
                        borderRadius: "16px",
                        padding: "24px"
                    }}>
                        <div style={{ height: "40px", width: "60%", background: "var(--bg-secondary)", borderRadius: "4px", marginBottom: "16px", animation: "shimmer 1.5s infinite" }} />
                        <div style={{ height: "100px", width: "100%", background: "var(--bg-secondary)", borderRadius: "4px", marginBottom: "16px", animation: "shimmer 1.5s infinite" }} />
                        <div style={{ display: "flex", gap: "8px" }}>
                            <div style={{ height: "40px", flex: 1, background: "var(--bg-secondary)", borderRadius: "4px", animation: "shimmer 1.5s infinite" }} />
                            <div style={{ height: "40px", flex: 1, background: "var(--bg-secondary)", borderRadius: "4px", animation: "shimmer 1.5s infinite" }} />
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}
