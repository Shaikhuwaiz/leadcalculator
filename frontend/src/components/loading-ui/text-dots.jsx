import React from "react";

export function TextDots({ children, className = "", ...props }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }} {...props}>
      <span>{children}</span>
      <span style={{ display: "inline-flex", gap: "0.2rem", alignItems: "center" }}>
        <span className="text-dots-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "text-dots 1s infinite ease-in-out" }} />
        <span className="text-dots-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "text-dots 1s infinite ease-in-out", animationDelay: "0.2s" }} />
        <span className="text-dots-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "text-dots 1s infinite ease-in-out", animationDelay: "0.4s" }} />
      </span>
    </span>
  );
}
