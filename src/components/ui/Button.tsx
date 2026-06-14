"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  shadow?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  shadow,
  className = "",
  style,
  ...props
}) => {
  const shadows = {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
  };

  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
    border: "none",
    outline: "none",
    gap: "8px",
    width: fullWidth ? "100%" : "auto",
    fontFamily: "inherit",
    boxShadow: shadow ? shadows[shadow] : "none",
  };

  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#fff",
    },
    secondary: {
      background: "var(--bg-secondary)",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    outline: {
      background: "transparent",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
    },
  };

  const sizes = {
    sm: { padding: "8px 16px", fontSize: "0.875rem" },
    md: { padding: "12px 24px", fontSize: "0.95rem" },
    lg: { padding: "14px 32px", fontSize: "1rem" },
  };

  const combinedStyle = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    opacity: props.disabled ? 0.5 : 1,
    cursor: props.disabled ? "not-allowed" : "pointer",
    pointerEvents: props.disabled ? "none" : "auto" as any,
    ...style,
  };

  return (
    <button
      style={combinedStyle}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
