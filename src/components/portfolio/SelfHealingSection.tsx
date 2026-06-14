"use client";

import React, { useEffect, useState } from "react";
import { Container } from "./Container";
import { RefreshCw, ArrowUp, ArrowDown } from "lucide-react";

export const SelfHealingSection: React.FC = () => {
  const [demand, setDemand] = useState(60);
  const [supply, setSupply] = useState(40);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate dynamic balancing
      setDemand(prev => {
        const next = prev > 80 ? 50 : prev + Math.floor(Math.random() * 10);
        return next;
      });
      setSupply(prev => {
        const next = prev < demand ? prev + Math.floor(Math.random() * 15) : prev - 5;
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [demand]);

  return (
    <section style={{ padding: "120px 0", background: "var(--text)", color: "white", position: "relative", overflow: "hidden" }}>
      {/* Background elements */}
      <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "200%", background: "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "50%", height: "200%", background: "radial-gradient(ellipse at center, rgba(56,189,248,0.15) 0%, transparent 70%)" }} />

      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", padding: "6px 16px", borderRadius: "20px", marginBottom: "24px" }}>
            <RefreshCw size={16} color="#38bdf8" />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px" }}>THE BIG IDEA</span>
          </div>
          <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "24px", letterSpacing: "-1px" }}>Self-Healing Ecosystem</h2>
          <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
            When demand increases, supply adapts automatically.<br/>
            More students become providers, balancing the system in real time.
          </p>
        </div>

        {/* Dynamic Visualization */}
        <div style={{ 
          background: "rgba(255,255,255,0.05)", 
          border: "1px solid rgba(255,255,255,0.1)", 
          borderRadius: "32px", 
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          backdropFilter: "blur(20px)"
        }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "120px", fontWeight: 700 }}>Demand (Orders)</div>
            <div style={{ flex: 1, height: "16px", background: "rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
              <div style={{ 
                width: `${demand}%`, 
                height: "100%", 
                background: "#f43f5e", 
                borderRadius: "8px",
                transition: "width 0.5s ease"
              }} />
            </div>
            <div style={{ width: "40px", textAlign: "right", color: "#f43f5e" }}><ArrowUp size={20} /></div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "120px", fontWeight: 700 }}>Supply (Creators)</div>
            <div style={{ flex: 1, height: "16px", background: "rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
              <div style={{ 
                width: `${supply}%`, 
                height: "100%", 
                background: "#10b981", 
                borderRadius: "8px",
                transition: "width 0.5s ease"
              }} />
            </div>
            <div style={{ width: "40px", textAlign: "right", color: "#10b981" }}><ArrowUp size={20} /></div>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Watch the system balance itself. As demand spikes, the app incentivizes more users to become creators.</p>
          </div>

        </div>
      </Container>
    </section>
  );
};
