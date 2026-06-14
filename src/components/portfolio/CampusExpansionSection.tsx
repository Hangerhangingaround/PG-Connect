"use client";

import React from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { MapPin, Share2, Globe } from "lucide-react";

export const CampusExpansionSection: React.FC = () => {
  return (
    <section id="campus" style={{ padding: "100px 0", background: "white" }}>
      <Container size="xl">
        <SectionHeader 
          title="From One PG to Entire Cities" 
          subtitle="A scalable campus network expansion model designed for infinite growth."
        />
        
        <div style={{ display: "flex", justifyContent: "center", margin: "60px 0" }}>
          <div style={{ 
            position: "relative", 
            width: "100%", 
            maxWidth: "800px", 
            height: "400px", 
            background: "var(--bg-secondary)", 
            borderRadius: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}>
            {/* Mock Node Map */}
            <div style={{ position: "absolute", top: "20%", left: "20%", background: "var(--primary)", width: "20px", height: "20px", borderRadius: "50%", boxShadow: "0 0 0 10px rgba(255,56,92,0.2)" }} />
            <div style={{ position: "absolute", top: "50%", left: "40%", background: "var(--primary)", width: "30px", height: "30px", borderRadius: "50%", boxShadow: "0 0 0 15px rgba(255,56,92,0.2)" }} />
            <div style={{ position: "absolute", bottom: "30%", right: "25%", background: "var(--primary)", width: "24px", height: "24px", borderRadius: "50%", boxShadow: "0 0 0 12px rgba(255,56,92,0.2)" }} />
            <div style={{ position: "absolute", top: "30%", right: "15%", background: "var(--primary)", width: "16px", height: "16px", borderRadius: "50%", boxShadow: "0 0 0 8px rgba(255,56,92,0.2)" }} />
            
            {/* Connecting lines using SVG */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.2 }}>
              <path d="M 20% 20% L 40% 50% L 75% 70% L 85% 30% Z" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 20% 20% L 85% 30%" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            
            <div style={{ background: "white", padding: "16px 32px", borderRadius: "20px", fontWeight: 800, fontSize: "1.2rem", boxShadow: "var(--shadow-md)", zIndex: 10 }}>
              Connecting Nodes
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", textAlign: "center" }}>
          <div>
            <div style={{ width: "64px", height: "64px", margin: "0 auto 16px", borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "8px" }}>Expand Across Campuses</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Easily replicate the ecosystem in new university towns.</p>
          </div>
          <div>
            <div style={{ width: "64px", height: "64px", margin: "0 auto 16px", borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
              <Share2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "8px" }}>Connect Nearby PGs</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Create hyperlocal clusters where PGs share services.</p>
          </div>
          <div>
            <div style={{ width: "64px", height: "64px", margin: "0 auto 16px", borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
              <Globe size={24} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "8px" }}>Share Services</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>A creator in PG 'A' can deliver to PG 'B' within the node.</p>
          </div>
        </div>
      </Container>
    </section>
  );
};
