"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { Button } from "../ui/Button";
import { useSession, signOut } from "next-auth/react";

export const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileHovered, setIsMobileHovered] = useState(false);

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

  const handleLinkClick = () => {
    setTimeout(() => setIsOpen(false), 100);
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
          
          {/* Desktop Menu */}
          <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", gap: "32px" }}>
            {mounted && role === "PG_OWNER" && (
              <Link href="/dashboard/pg-owner" style={navLinkStyle}>Dashboard</Link>
            )}
            {mounted && role === "PAYING_GUEST" && (
              <Link href="/dashboard/paying-guest" style={navLinkStyle}>Dashboard</Link>
            )}
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
                <div 
                  onClick={() => setShowAccountModal(true)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    background: isHovered ? "var(--border-light)" : "var(--bg-secondary)", 
                    padding: "6px 14px", 
                    borderRadius: "20px",
                    border: "1px solid var(--border-light)",
                    cursor: "pointer",
                    transform: isHovered ? "translateY(-1px)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    background: "var(--primary)", 
                    color: "white", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "0.75rem", 
                    fontWeight: 800 
                  }}>
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span style={{ 
                    color: "var(--text)", 
                    fontWeight: 700, 
                    fontSize: "0.9rem" 
                  }}>
                    Hi, {session.user.name?.split(" ")[0]} 👋
                  </span>
                </div>
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

          {/* Hamburger Menu Trigger */}
          <Button 
            variant="ghost" 
            style={{ display: isMobile ? "block" : "none", fontSize: "1.5rem", padding: "4px 8px" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </Button>
        </div>
      </Container>

      {/* Mobile Drawer Overlay */}
      {isMobile && isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
          zIndex: 2000,
          display: "flex",
          justifyContent: "flex-end"
        }} onClick={() => setIsOpen(false)}>
          <div style={{
            width: "280px",
            height: "100%",
            background: "white",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
            position: "relative"
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button and Logo */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Logo />
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--text)",
                  padding: "4px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {mounted && role === "PG_OWNER" ? (
                <>
                  <Link href="/" style={navLinkStyle} onClick={handleLinkClick}>Dashboard</Link>
                  <Link href="/?tab=guide" style={navLinkStyle} onClick={handleLinkClick}>How it Works</Link>
                </>
              ) : (
                <>
                  <Link href="/" style={navLinkStyle} onClick={handleLinkClick}>Home</Link>
                  <Link href="/#explore" style={navLinkStyle} onClick={handleLinkClick}>Browse PGs</Link>
                  <Link href="/#how-it-works" style={navLinkStyle} onClick={handleLinkClick}>How it Works</Link>
                  <Link href="/#about" style={navLinkStyle} onClick={handleLinkClick}>About</Link>
                </>
              )}
            </div>

            {/* Mobile Auth and Action section */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              {mounted && status === "authenticated" && session?.user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div 
                    onClick={() => { setShowAccountModal(true); setIsOpen(false); }}
                    onMouseEnter={() => setIsMobileHovered(true)}
                    onMouseLeave={() => setIsMobileHovered(false)}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px", 
                      background: isMobileHovered ? "var(--border-light)" : "var(--bg-secondary)", 
                      padding: "8px 16px", 
                      borderRadius: "20px",
                      border: "1px solid var(--border-light)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ 
                      width: "24px", 
                      height: "24px", 
                      borderRadius: "50%", 
                      background: "var(--primary)", 
                      color: "white", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "0.75rem", 
                      fontWeight: 800 
                    }}>
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span style={{ 
                      color: "var(--text)", 
                      fontWeight: 700, 
                      fontSize: "0.9rem" 
                    }}>
                      Hi, {session.user.name?.split(" ")[0]} 👋
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { handleLogout(); setIsOpen(false); }}>Logout</Button>
                </div>
              ) : (
                <>
                  <Link href="/owner/add-pg" onClick={handleLinkClick}>
                    <Button size="sm" fullWidth>List your PG</Button>
                  </Link>
                  <Link href="/login" onClick={handleLinkClick}>
                    <Button variant="primary" size="sm" fullWidth>Login</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {showAccountModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(12px)",
          zIndex: 3000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }} onClick={() => setShowAccountModal(false)}>
          <div style={{
            background: "white",
            width: "400px",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "relative"
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowAccountModal(false)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "var(--text-secondary)"
              }}
            >
              ✕
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-light)", paddingBottom: "24px" }}>
              <div style={{ 
                width: "72px", 
                height: "72px", 
                borderRadius: "50%", 
                background: "var(--primary-light)", 
                color: "var(--primary)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "2rem", 
                fontWeight: 800 
              }}>
                {session?.user?.name?.charAt(0).toUpperCase() || "O"}
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
                  {session?.user?.name || "Owner Name"}
                </h3>
                <span style={{ 
                  fontSize: "0.75rem", 
                  color: "var(--primary)", 
                  fontWeight: 700, 
                  background: "var(--primary-light)", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  display: "inline-block",
                  marginTop: "6px"
                }}>
                  Verified PG Owner
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Email Address", value: session?.user?.email || "N/A", icon: "📧" },
                { label: "Account ID", value: (session?.user as any)?.id || "N/A", icon: "🔑" },
                { label: "Registered Status", value: "Verified Business Partner", icon: "🛡️" },
                { label: "Support Contact", value: "support@pgconnect.com", icon: "📞" }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ fontSize: "1.2rem", width: "24px" }}>{item.icon}</div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>{item.label}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <Link href={(session?.user as any)?.role === "PG_OWNER" ? "/dashboard/pg-owner" : "/dashboard/paying-guest"} style={{ flex: 1, textDecoration: "none" }} onClick={() => setShowAccountModal(false)}>
                <Button variant="primary" fullWidth>
                  Go to Dashboard
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setShowAccountModal(false)} style={{ flex: 1 }}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
