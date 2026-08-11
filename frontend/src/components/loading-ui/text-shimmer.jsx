import React from "react";

export function TextShimmer({ children, className = "", ...props }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        color: "white",
        fontWeight: 600,
        position: "relative",
        overflow: "hidden",
        backgroundImage: "linear-gradient(90deg, #fff 0%, #cbd5e1 40%, #fff 80%)",
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        animation: "text-shimmer 1.4s linear infinite",
      }}
      {...props}
    >
      {children}
    </span>
  );
}
