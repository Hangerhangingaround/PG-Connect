"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "./Container";
import { HeroStats } from "@/components/portfolio/HeroStats";
import { SearchBar } from "@/components/portfolio/SearchBar";

interface HeroProps {
  onSearch?: (city: string, minPrice: string, maxPrice: string, gender: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "white" }}>
      <Container size="xl">
        <div style={{ padding: "120px 0 100px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "8px 16px", 
            background: "var(--bg-secondary)", 
            borderRadius: "30px", 
            marginBottom: "24px" 
          }}>
            <span style={{ 
              background: "var(--primary)", 
              color: "white", 
              padding: "2px 8px", 
              borderRadius: "20px", 
              fontSize: "0.7rem", 
              fontWeight: 700 
            }}>NEW</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>
              Find verified PGs near your campus
            </span>
          </div>
          
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)", 
            fontWeight: 900, 
            letterSpacing: "-2px", 
            lineHeight: 1.05, 
            marginBottom: "24px", 
            color: "var(--text)",
            maxWidth: "900px"
          }}>
            Find Your Perfect PG, <br/>
            <span style={{ color: "var(--primary)" }}>Without the Hassle</span>
          </h1>
          
          <p style={{ 
            fontSize: "1.25rem", 
            color: "var(--text-secondary)", 
            maxWidth: "600px", 
            marginBottom: "40px", 
            lineHeight: 1.6 
          }}>
            Discover verified PGs, compare amenities, and connect directly with owners — all in one place. Your home away from home is just a click away.
          </p>
          
          <div style={{ width: "100%", marginBottom: "60px", zIndex: 10, position: "relative" }}>
            <SearchBar onSearch={onSearch} />
          </div>

          <HeroStats />
        </div>
      </Container>
      
      {/* Decorative Blur Elements */}
      <div style={{ 
        position: "absolute", 
        top: "-10%", 
        right: "-5%", 
        width: "400px", 
        height: "400px", 
        background: "rgba(255, 56, 92, 0.05)", 
        borderRadius: "50%", 
        filter: "blur(60px)", 
        zIndex: 0 
      }} />
      <div style={{ 
        position: "absolute", 
        bottom: "10%", 
        left: "-5%", 
        width: "300px", 
        height: "300px", 
        background: "rgba(0, 132, 137, 0.05)", 
        borderRadius: "50%", 
        filter: "blur(50px)", 
        zIndex: 0 
      }} />
    </div>
  );
};
