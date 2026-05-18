"use client";
import React from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Grid } from "./Grid";
import { Search, TrendingUp, Cpu, FastForward } from "lucide-react";

export const AIIntelligenceSection: React.FC = () => {
  const steps = [
    { icon: <Search size={24} />, title: "Detect", desc: "Monitors supply-demand imbalances across the campus in real-time." },
    { icon: <TrendingUp size={24} />, title: "Predict", desc: "Forecasts demand spikes before they happen using historical data." },
    { icon: <Cpu size={24} />, title: "Optimize", desc: "Recommends alternative providers when a service gets overloaded." },
    { icon: <FastForward size={24} />, title: "Execute", desc: "Prevents delays by rerouting orders seamlessly." }
  ];

  return (
    <section id="ai" style={{ padding: "100px 0", background: "var(--bg-secondary)" }}>
      <Container size="xl">
        <SectionHeader 
          title="A System That Thinks Ahead" 
          subtitle="Our AI Supply Chain Intelligence ensures the ecosystem never breaks."
        />
        
        <Grid cols={4} tabletCols={2} mobileCols={1} gap={24}>
          {steps.map((step, i) => (
            <div key={i} style={{ 
              background: "white", 
              padding: "32px", 
              borderRadius: "24px",
              boxShadow: "var(--shadow-sm)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: "-10px", right: "-10px", opacity: 0.05 }}>
                {React.cloneElement(step.icon as any, { size: 120 })}
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--text)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "12px" }}>{step.title}</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  );
};
