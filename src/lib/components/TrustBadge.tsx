import { Lock, Shield, KeyRound } from "lucide-react";

type TrustBadgeVariant = "lock" | "shield" | "key" | "zk";

interface TrustBadgeProps {
  variant?: TrustBadgeVariant;
  label?: string;
  size?: "sm" | "md";
}

export function TrustBadge({ variant = "lock", label, size = "sm" }: TrustBadgeProps) {
  const labels: Record<TrustBadgeVariant, string> = {
    lock: "End-to-end encrypted",
    shield: "Zero-knowledge architecture",
    key: "Only you hold the key",
    zk: "Zero-knowledge encryption",
  };

  const icons: Record<TrustBadgeVariant, React.ReactNode> = {
    lock: <Lock size={size === "sm" ? 11 : 13} strokeWidth={1.5} />,
    shield: <Shield size={size === "sm" ? 11 : 13} strokeWidth={1.5} />,
    key: <KeyRound size={size === "sm" ? 11 : 13} strokeWidth={1.5} />,
    zk: <Lock size={size === "sm" ? 11 : 13} strokeWidth={1.5} />,
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 5 : 6,
        padding: size === "sm" ? "3px 9px" : "5px 12px",
        fontSize: size === "sm" ? 11 : 12,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        color: "var(--green-deep)",
        background: "rgba(22, 60, 52, 0.06)",
        border: "1px solid rgba(22, 60, 52, 0.14)",
        borderRadius: "999px",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {icons[variant]}
      {label ?? labels[variant]}
    </span>
  );
}

export function TrustRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <TrustBadge variant="lock" />
      <TrustBadge variant="zk" label="Zero-knowledge" />
      <TrustBadge variant="key" label="Only you hold the key" />
    </div>
  );
}
