"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { Button } from "../ui/Button";
import { useSession, signOut } from "next-auth/react";

export const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const navLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "var(--text)",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "color 0.2s",
  };

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      width: "100%",
      background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border-light)" : "1px solid transparent",
      padding: scrolled ? "12px 0" : "20px 0",
      transition: "all 0.3s ease"
    }}>
      <Container size="xl">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          
          <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", gap: "32px" }}>
            <Link href="/" style={navLinkStyle}>Home</Link>
            
            {/* Explore More Dropdown */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", cursor: "pointer" }}
                 onMouseEnter={(e) => {
                   const dropdown = e.currentTarget.querySelector('.dropdown-menu');
                   if (dropdown) (dropdown as HTMLElement).style.display = 'block';
                   if (dropdown) (dropdown as HTMLElement).style.opacity = '1';
                   if (dropdown) (dropdown as HTMLElement).style.transform = 'translateY(0)';
                 }}
                 onMouseLeave={(e) => {
                   const dropdown = e.currentTarget.querySelector('.dropdown-menu');
                   if (dropdown) (dropdown as HTMLElement).style.display = 'none';
                   if (dropdown) (dropdown as HTMLElement).style.opacity = '0';
                   if (dropdown) (dropdown as HTMLElement).style.transform = 'translateY(10px)';
                 }}
            >
              <span style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: "4px" }}>
                Explore More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
              <div 
                className="dropdown-menu"
                style={{ 
                  position: "absolute", 
                  top: "100%", 
                  left: "-20px", 
                  background: "white", 
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)", 
                  borderRadius: "16px", 
                  padding: "16px",
                  width: "280px",
                  display: "none",
                  opacity: 0,
                  transform: "translateY(10px)",
                  transition: "all 0.2s ease",
                  border: "1px solid rgba(0,0,0,0.05)",
                  marginTop: "16px"
                }}
              >
                {[
                  { name: "Student Experience", id: "#experience" },
                  { name: "Creator Economy", id: "#creator" },
                  { name: "Vendor & Delivery System", id: "#ops" },
                  { name: "Smart Supply Chain (AI)", id: "#ai" },
                  { name: "Campus Ecosystem", id: "#campus" }
                ].map(item => (
                  <Link key={item.name} href={item.id} style={{ 
                    display: "block", 
                    padding: "12px 16px", 
                    textDecoration: "none", 
                    color: "var(--text)", 
                    fontWeight: 600, 
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            {mounted && status === "authenticated" && session?.user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Link href={(session.user as any).role === "PG_OWNER" ? "/dashboard/pg-owner" : "/dashboard/paying-guest"} style={{ textDecoration: "none", color: "var(--text)", fontWeight: 700 }}>
                  Hi, {session.user.name?.split(" ")[0]} 👋
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <>
                <Link href="/dashboard/pg-owner/add-pg">
                  <Button size="sm">List your PG</Button>
                </Link>
                <Link href="/login">
                  <Button variant="primary" size="sm">Login</Button>
                </Link>
              </>
            )}
          </div>

          <Button variant="ghost" style={{ display: isMobile ? "block" : "none" }}>
            ☰
          </Button>
        </div>
      </Container>
    </nav>
  );
};
