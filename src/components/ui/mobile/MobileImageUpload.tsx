"use client";

import React from "react";
import { Button } from "../Button";

interface MobileImageUploadProps {
  images: File[];
  previews: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (idx: number) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
}

export const MobileImageUpload: React.FC<MobileImageUploadProps> = ({
  images,
  previews,
  onUpload,
  onRemove,
  fileRef,
}) => {
  return (
    <div style={{ marginBottom: "32px" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: "12px",
        }}
      >
        Photos ({images.length}/50)
      </label>
      
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "40px 16px",
          textAlign: "center",
          background: "var(--bg-secondary)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <span style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}>📸</span>
        <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text)" }}>
          Upload photos
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          JPG, PNG or WEBP (Max 5MB)
        </p>
      </div>
      
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onUpload}
      />

      {previews.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          {previews.map((p, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: "1.3",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src={p}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  color: "#222",
                  border: "1px solid #ddd",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
