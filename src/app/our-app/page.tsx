"use client";

import React from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Section } from "@/components/portfolio/Section";
import { Container } from "@/components/portfolio/Container";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { Grid } from "@/components/portfolio/Grid";
import { TestimonialCard } from "@/components/portfolio/TestimonialCard";
import { Footer } from "@/components/portfolio/Footer";

// Ecosystem Components
import { BeyondPGSection } from "@/components/portfolio/BeyondPGSection";
import { StudentAppSection } from "@/components/portfolio/StudentAppSection";
import { CreatorEconomySection } from "@/components/portfolio/CreatorEconomySection";
import { VendorOpsSection } from "@/components/portfolio/VendorOpsSection";
import { AIIntelligenceSection } from "@/components/portfolio/AIIntelligenceSection";
import { SelfHealingSection } from "@/components/portfolio/SelfHealingSection";
import { CampusExpansionSection } from "@/components/portfolio/CampusExpansionSection";
import { PlatformIntelligenceSection } from "@/components/portfolio/PlatformIntelligenceSection";

export default function OurAppPage() {
  return (
    <main style={{ background: "white" }}>
      <Navbar />

      {/* Hero / Positioning Banner */}
      <section style={{
        background: "linear-gradient(135deg, var(--text) 0%, #1a1a2e 100%)",
        color: "white",
        padding: "80px 0 60px",
        textAlign: "center",
        borderBottom: "4px solid var(--primary)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
          pointerEvents: "none"
        }} />
        <Container>
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(99, 102, 241, 0.2)",
              color: "var(--primary-light)",
              padding: "6px 20px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "24px",
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}>
              OUR APP
            </span>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: 800,
              marginBottom: "20px",
              letterSpacing: "-1px",
              lineHeight: 1.2
            }}>
              PG Connect
            </h1>
            <p style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "0.5px",
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6
            }}>
              Not just a platform—a{" "}
              <span style={{ color: "var(--primary-light)" }}>
                self-evolving student economy
              </span>{" "}
              powered by AI-driven supply chains.
            </p>
          </div>
        </Container>
      </section>

      {/* Beyond PG (Transition) */}
      <BeyondPGSection />

      {/* Student App Experience */}
      <StudentAppSection />

      {/* Creator Economy */}
      <CreatorEconomySection />

      {/* Vendor & Ops System */}
      <VendorOpsSection />

      {/* AI Intelligence */}
      <AIIntelligenceSection />

      {/* Self-Healing System */}
      <SelfHealingSection />

      {/* Campus Expansion */}
      <CampusExpansionSection />

      {/* Platform Intelligence / Analytics Dashboard */}
      <PlatformIntelligenceSection />

      {/* Ecosystem Testimonials */}
      <Section background="white">
        <Container size="xl">
          <SectionHeader 
            title="Ecosystem Stories" 
            subtitle="Hear from students earning, vendors growing, and owners scaling."
          />
          <Grid cols={2} mobileCols={1}>
            <TestimonialCard 
              quote="I started delivering notes in my PG. Now I provide tutoring services to 3 nearby PGs using the Connect App."
              author="Aaryan Sharma"
              role="Student & Creator"
              avatar="https://i.pravatar.cc/150?u=aaryan"
            />
            <TestimonialCard 
              quote="The vendor dashboard is incredible. The AI rerouted my food deliveries during peak hours, saving me from delays."
              author="Mrs. Gupta"
              role="Tiffin Service Partner"
              avatar="https://i.pravatar.cc/150?u=gupta"
            />
          </Grid>
        </Container>
      </Section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
