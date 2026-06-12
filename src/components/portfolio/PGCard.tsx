"use client";

import React from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import { Badge } from "./Badge";

interface PGCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  price: number;
  tags: string[];
  rating?: number;
}

export const PGCard: React.FC<PGCardProps> = ({
  id,
  image,
  name,
  location,
  price,
  tags,
  rating = 4.5,
  ...styleProps
}) => {
  const style = (styleProps as any).style;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link href={`/pg/${id}`} style={{ textDecoration: "none" }}>
      <Card 
        padding="0" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          overflow: "hidden", 
          cursor: "pointer", 
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          border: isHovered ? "1px solid var(--primary-light)" : "1px solid var(--border-light)",
          transform: isHovered ? "translateY(-8px)" : "none",
          boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.12)" : "var(--shadow-md)",
          ...style
        }}
      >
        <div style={{ position: "relative", aspectRatio: "1.2", overflow: "hidden" }}>
          <img 
            src={image} 
            alt={name} 
            className="pg-card-img"
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              transition: "transform 0.6s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)"
            }} 
          />
          <div style={{ position: "absolute", top: "12px", right: "12px" }}>
            <Badge variant="success">Verified</Badge>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "8px" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text)" }}>{name}</h3>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
            📍 {location}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {tags.map((tag, i) => (
              <span key={i} style={{ fontSize: "0.75rem", padding: "4px 8px", background: "var(--bg-secondary)", borderRadius: "4px", color: "var(--text-secondary)" }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)" }}>₹{price}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>/month</span>
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}>View Details →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
