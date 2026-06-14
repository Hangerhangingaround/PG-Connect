"use client";

import React from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Settings, Package, Map, Zap } from "lucide-react";

export const VendorOpsSection: React.FC = () => {
  return (
    <section id="ops" style={{ padding: "100px 0", background: "white" }}>
      <Container size="xl">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          
          <div>
            {/* Vendor Ops Dashboard Mockup */}
            <div style={{ 
              background: "#1e293b", 
              borderRadius: "24px", 
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              color: "white",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Settings size={20} color="#38bdf8" />
                  <span style={{ fontWeight: 700 }}>Ops Hub Live</span>
                </div>
                <div style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>
                  SYSTEM ONLINE
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { id: "ORD-992", status: "In Kitchen", driver: "Assigning...", type: "Food" },
                  { id: "LND-104", status: "Picked Up", driver: "Rahul S.", type: "Laundry" },
                  { id: "DOC-022", status: "Delivered", driver: "Digital", type: "Notes" }
                ].map((order, i) => (
                  <div key={i} style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "16px", 
                    background: "rgba(255,255,255,0.05)", 
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{order.id}</div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{order.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: order.status === "Delivered" ? "#10b981" : "#f59e0b", fontSize: "0.9rem", fontWeight: 600 }}>{order.status}</div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{order.driver}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <SectionHeader 
              title="Powered by Real-Time Operations" 
              subtitle="Our robust Vendor & Delivery System keeps the ecosystem moving smoothly."
              align="left"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "40px" }}>
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Package size={24} color="var(--text)" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Vendors Manage Orders</h4>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Real-time dashboard to accept, process, and update the status of active requests.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Map size={24} color="var(--text)" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Smart Routing</h4>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Optimized paths ensure faster delivery and efficient batching for delivery partners.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Zap size={24} color="var(--text)" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Instant Execution</h4>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Delivery partners receive notifications instantly, minimizing wait times across the campus.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
