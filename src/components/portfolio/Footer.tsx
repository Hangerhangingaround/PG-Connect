"use client";

import React from "react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { FooterColumn } from "@/components/portfolio/FooterColumn";
import { SocialIcon } from "@/components/portfolio/SocialIcon";

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: "white", borderTop: "1px solid var(--border-light)", padding: "80px 0 40px" }}>
      <Container size="xl">
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "40px", marginBottom: "60px" }}>
           <style jsx>{`
            @media (max-width: 1024px) {
              .footer-grid {
                grid-template-columns: 1fr 1fr 1fr !important;
                gap: 32px !important;
              }
              .footer-logo-section {
                grid-column: span 3 !important;
                margin-bottom: 24px !important;
              }
            }
            @media (max-width: 640px) {
              .footer-grid {
                grid-template-columns: 1fr 1fr !important;
              }
              .footer-logo-section {
                grid-column: span 2 !important;
              }
            }
          `}</style>
          <div className="footer-logo-section" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Logo />
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "260px" }}>
              Simplifying the search for a perfect home near campus. Trust, transparency, and technology.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <SocialIcon platform="linkedin" />
              <SocialIcon platform="instagram" />
              <SocialIcon platform="twitter" />
            </div>
          </div>
          
          <FooterColumn title="Product" links={[
            { label: "Browse PGs", href: "/#explore" },
            { label: "List Property", href: "/owner/add-pg" },
            { label: "Top Rated", href: "#" },
            { label: "New Launches", href: "#" }
          ]} />
          
          <FooterColumn title="Company" links={[
            { label: "About Us", href: "/#about" },
            { label: "Contact", href: "/#contact" },
            { label: "Careers", href: "#" },
            { label: "Press", href: "#" }
          ]} />

          <FooterColumn title="Support" links={[
            { label: "Help Center", href: "#" },
            { label: "Safety", href: "#" },
            { label: "Terms", href: "#" },
            { label: "Privacy", href: "#" }
          ]} />

          <FooterColumn title="Legal" links={[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Use", href: "#" },
            { label: "Cookie Policy", href: "#" }
          ]} />
        </div>
        
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            © 2026 PGXplore. All rights reserved. Built with ❤️ for students.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
             <select style={{ border: "none", background: "none", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>
               <option>English (IN)</option>
               <option>Hindi</option>
             </select>
             <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>INR (₹)</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
