export function TextDots({ children, className = "", ...props }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: "0.1rem" }} {...props}>
      <span>{children}</span>
      <span style={{ display: "inline-flex", gap: "0.1rem", alignItems: "flex-end", paddingBottom: "-1px" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "text-dots 1s infinite ease-in-out", transform: "translateY(2px)" }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "text-dots 1s infinite ease-in-out", animationDelay: "0.2s", transform: "translateY(2px)" }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "text-dots 1s infinite ease-in-out", animationDelay: "0.4s", transform: "translateY(2px)" }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "text-dots 1s infinite ease-in-out", animationDelay: "0.6s", transform: "translateY(2px)" }} />
      </span>
    </span>
  );
}
