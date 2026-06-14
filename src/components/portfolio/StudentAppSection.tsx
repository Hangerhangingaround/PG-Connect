"use client";

import React from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Smartphone, CheckCircle, Clock } from "lucide-react";

export const StudentAppSection: React.FC = () => {
  return (
    <section id="experience" style={{ padding: "100px 0", background: "white" }}>
      <Container size="xl">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          
          <div style={{ order: 2 }}>
            <SectionHeader 
              title="Everything You Need, Inside Your PG" 
              subtitle="The Student App Experience connects you to every service you need without leaving your room."
              align="left"
            />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "32px" }}>
              {[
                "Order food from nearby students",
                "Book laundry services instantly",
                "Access notes and peer tutoring",
                "Track all orders in real-time"
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "var(--bg-secondary)", borderRadius: "16px" }}>
                  <div style={{ color: "var(--primary)" }}>
                    <CheckCircle size={24} />
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ order: 1, position: "relative", height: "600px", display: "flex", justifyContent: "center" }}>
            {/* Phone Mockup */}
            <div style={{ 
              width: "300px", 
              height: "600px", 
              background: "white", 
              borderRadius: "40px", 
              boxShadow: "0 30px 60px rgba(0,0,0,0.12), inset 0 0 0 12px #111",
              position: "relative",
              overflow: "hidden",
              padding: "40px 20px 20px"
            }}>
              {/* Dynamic Notch */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "30px", background: "#111", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }} />
              
              <div style={{ marginTop: "20px", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Good morning, Aaryan!</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Your ecosystem is active.</p>
              </div>

              {/* Mock App Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 56, 92, 0.1)", border: "1px solid rgba(255, 56, 92, 0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--primary)" }}>Tiffin Delivery</span>
                    <Clock size={16} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Arriving in 15 mins</div>
                  <div style={{ height: "4px", background: "rgba(255,56,92,0.2)", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
                    <div style={{ width: "70%", height: "100%", background: "var(--primary)", borderRadius: "2px" }} />
                  </div>
                </div>

                <div style={{ padding: "16px", borderRadius: "16px", background: "var(--bg-secondary)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>Laundry Pickup</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Scheduled for 6:00 PM</div>
                </div>
                
                <div style={{ padding: "16px", borderRadius: "16px", background: "var(--bg-secondary)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>Math Notes (Unit 3)</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Purchased from Rahul</div>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <div style={{ 
              position: "absolute", 
              bottom: "80px", 
              right: "0", 
              background: "white", 
              padding: "16px 24px", 
              borderRadius: "20px", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "bounce 3s infinite ease-in-out"
            }}>
              <Smartphone size={24} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Live Tracking</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Powered by Ops</div>
              </div>
            </div>
            <style jsx>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              @media (max-width: 1024px) {
                div[style*="gridTemplateColumns: 1fr 1fr"] {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>
        </div>
      </Container>
    </section>
  );
};
