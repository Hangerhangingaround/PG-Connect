"use client";

import React from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Grid } from "./Grid";
import { Briefcase, Coffee, PenTool, Calendar } from "lucide-react";

export const CreatorEconomySection: React.FC = () => {
  const opportunities = [
    { icon: <Coffee size={32} />, title: "Start a Tiffin Service", desc: "Cook for your peers and earn directly." },
    { icon: <Briefcase size={32} />, title: "Offer Laundry", desc: "Use your spare time to wash and iron." },
    { icon: <PenTool size={32} />, title: "Sell Notes & Tutoring", desc: "Monetize your academic excellence." },
    { icon: <Calendar size={32} />, title: "Host Events", desc: "Organize campus meetups and activities." }
  ];

  return (
    <section id="creator" style={{ padding: "100px 0", background: "var(--bg-secondary)" }}>
      <Container size="xl">
        <SectionHeader 
          title="Don't Just Live—Earn" 
          subtitle="Turn your skills into services. Users become providers in our unique creator economy."
        />
        
        <Grid cols={4} tabletCols={2} mobileCols={1}>
          {opportunities.map((opp, i) => (
            <div key={i} style={{ 
              background: "white", 
              padding: "32px", 
              borderRadius: "24px", 
              boxShadow: "var(--shadow-sm)",
              transition: "transform 0.3s",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {opp.icon}
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{opp.title}</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{opp.desc}</p>
            </div>
          ))}
        </Grid>
        
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <div style={{ display: "inline-block", background: "rgba(255, 56, 92, 0.1)", color: "var(--primary)", padding: "12px 24px", borderRadius: "30px", fontWeight: 800, fontSize: "1.1rem" }}>
            User → Order → Creator → Income → Ecosystem
          </div>
        </div>
      </Container>
    </section>
  );
};
