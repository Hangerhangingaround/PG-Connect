"use client";

import React from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Grid } from "./Grid";
import { Activity, BarChart2, DollarSign, Crosshair } from "lucide-react";

export const PlatformIntelligenceSection: React.FC = () => {
  return (
    <section style={{ padding: "100px 0", background: "var(--bg-secondary)" }}>
      <Container size="xl">
        <SectionHeader 
          title="Platform Intelligence & Dashboard" 
          subtitle="Real-Time Control & Insights for admins and network managers."
        />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          
          <div style={{ order: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ padding: "12px", background: "white", borderRadius: "16px", boxShadow: "var(--shadow-sm)" }}><Activity size={24} color="var(--primary)" /></div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "4px" }}>Monitor Demand Trends</h4>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Track what services are needed most and when.</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ padding: "12px", background: "white", borderRadius: "16px", boxShadow: "var(--shadow-sm)" }}><Crosshair size={24} color="var(--primary)" /></div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "4px" }}>Track Performance</h4>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Ensure all creators and vendors meet SLA requirements.</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ padding: "12px", background: "white", borderRadius: "16px", boxShadow: "var(--shadow-sm)" }}><DollarSign size={24} color="var(--primary)" /></div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "4px" }}>Analyze Revenue</h4>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Breakdown ecosystem GMV, creator earnings, and platform fees.</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ padding: "12px", background: "white", borderRadius: "16px", boxShadow: "var(--shadow-sm)" }}><BarChart2 size={24} color="var(--primary)" /></div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "4px" }}>Optimize Operations</h4>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Use historical data to restructure network nodes.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ order: 2 }}>
            <div style={{ background: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                <div style={{ fontWeight: 800 }}>Admin Analytics</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Last 30 Days</div>
              </div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
                <div style={{ flex: 1, padding: "16px", background: "var(--bg-secondary)", borderRadius: "16px" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px" }}>Active Creators</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>1,248</div>
                  <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "4px" }}>+12% this week</div>
                </div>
                <div style={{ flex: 1, padding: "16px", background: "var(--bg-secondary)", borderRadius: "16px" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px" }}>Network GMV</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>₹842k</div>
                  <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "4px" }}>+5% this week</div>
                </div>
              </div>
              
              {/* Mock Chart */}
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Ecosystem Growth</div>
                <div style={{ height: "120px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
                  {[30, 45, 25, 60, 80, 50, 95].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i === 6 ? "var(--primary)" : "var(--bg-secondary)", height: `${h}%`, borderRadius: "4px 4px 0 0" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
