"use client";

import React from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { ArrowRight, Home, Pizza, Shirt, BookOpen, Users } from "lucide-react";

export const BeyondPGSection: React.FC = () => {
  const steps = [
    { icon: <Home size={32} />, label: "PG" },
    { icon: <Pizza size={32} />, label: "Food" },
    { icon: <Shirt size={32} />, label: "Laundry" },
    { icon: <BookOpen size={32} />, label: "Notes" },
    { icon: <Users size={32} />, label: "Community" }
  ];

  return (
    <section style={{ padding: "100px 0", background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 100%)", position: "relative", overflow: "hidden" }}>
      <Container size="xl">
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "20px", letterSpacing: "-1px" }}>Your PG is just the beginning.</h2>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Inside PG Connect, you don’t just find a place to stay—<br/>
            <strong style={{ color: "var(--primary)" }}>you unlock a complete student ecosystem.</strong>
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginTop: "40px" }}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: "16px",
                flex: 1,
                minWidth: "120px"
              }}>
                <div style={{ 
                  width: "80px", 
                  height: "80px", 
                  borderRadius: "24px", 
                  background: idx === 0 ? "var(--primary)" : "white",
                  color: idx === 0 ? "white" : "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "default"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {step.icon}
                </div>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>{step.label}</span>
              </div>
              
              {idx < steps.length - 1 && (
                <div style={{ color: "var(--border)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowRight size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};
