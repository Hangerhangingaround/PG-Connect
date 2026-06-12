"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import * as Slider from "@radix-ui/react-slider";

interface SearchBarProps {
  onSearch?: (city: string, minPrice: string, maxPrice: string, gender: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState([0, 20000]);
  const [gender, setGender] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(city, budget[0].toString(), budget[1].toString(), gender);
      
      // Also scroll to explore section
      document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "900px", 
      margin: "0 auto",
      padding: "8px",
      background: "white",
      borderRadius: "40px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: "1px solid var(--border-light)"
    }}>
      <div style={{ flex: 1.5, paddingLeft: "24px", display: "flex", flexDirection: "column", textAlign: "left" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text)" }}>CITY</span>
        <input 
          placeholder="e.g. Mohali" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ border: "none", outline: "none", fontSize: "0.95rem", color: "var(--text)", width: "100%", padding: "4px 0", background: "transparent" }}
        />
      </div>
      <div className="search-bar-divider" />
      
      {/* RANGE SLIDER INTEGRATION */}
      <div style={{ flex: 2, paddingLeft: "16px", paddingRight: "16px", display: "flex", flexDirection: "column", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
           <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text)" }}>RENT RANGE</span>
           <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>₹{budget[0]} - ₹{budget[1]}</span>
        </div>
        
        <Slider.Root
          style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", height: "20px", userSelect: "none", touchAction: "none" }}
          min={0}
          max={40000}
          step={500}
          value={budget}
          onValueChange={setBudget}
        >
          <Slider.Track style={{ backgroundColor: "var(--border-light)", position: "relative", flexGrow: 1, borderRadius: "9999px", height: "4px" }}>
            <Slider.Range style={{ position: "absolute", backgroundColor: "var(--primary)", borderRadius: "9999px", height: "100%" }} />
          </Slider.Track>
          <Slider.Thumb style={{ display: "block", width: "16px", height: "16px", backgroundColor: "white", border: "2px solid var(--primary)", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", borderRadius: "50%", cursor: "pointer", outline: "none" }} />
          <Slider.Thumb style={{ display: "block", width: "16px", height: "16px", backgroundColor: "white", border: "2px solid var(--primary)", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", borderRadius: "50%", cursor: "pointer", outline: "none" }} />
        </Slider.Root>
      </div>

      <div className="search-bar-divider" />
      <div style={{ flex: 1.5, paddingLeft: "16px", display: "flex", flexDirection: "column", textAlign: "left" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text)" }}>GENDER</span>
        <select 
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ border: "none", outline: "none", fontSize: "0.95rem", color: "var(--text)", width: "100%", padding: "4px 0", background: "transparent", cursor: "pointer", appearance: "none" }}
        >
          <option value="">Any (Unisex)</option>
          <option value="MALE">Boys PG</option>
          <option value="FEMALE">Girls PG</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <Button onClick={handleSearch} style={{ borderRadius: "30px", width: "48px", height: "48px", padding: 0 }}>
        🔍
      </Button>
    </div>
  );
};
