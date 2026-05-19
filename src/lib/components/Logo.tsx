import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  /** "full" = circular mark + "in case" wordmark. "mark" = icon only. */
  variant?: "full" | "mark";
  /** For use on dark backgrounds (sidebar). Defaults to light (dark text). */
  inverse?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: { mark: 28, text: 16 },
  md: { mark: 34, text: 19 },
  lg: { mark: 42, text: 24 },
};

function Mark({ size, inverse }: { size: number; inverse: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <circle cx="32" cy="32" r="30" fill={inverse ? "#163C34" : "#163C34"} />
      <circle cx="32" cy="32" r="28" fill="none" stroke="#B79D72" strokeWidth="1.4" />
      {/* Center stem */}
      <path d="M32 46 L32 26" stroke="#B79D72" strokeWidth="1.6" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M32 38 C27 35 23 30 24 24 C25 24 30 25 32 32" fill="#B79D72" opacity="0.9" />
      {/* Right leaf */}
      <path d="M32 34 C37 31 41 26 40 20 C39 20 34 21 32 28" fill="#B79D72" opacity="0.9" />
      {/* Top leaf */}
      <path d="M32 30 C29 23 30 18 32 15 C34 18 35 23 32 30" fill="#B79D72" />
    </svg>
  );
}

export function Logo({ variant = "full", inverse = false, size = "md", href }: LogoProps) {
  const s = sizes[size];
  const textColor = inverse ? "var(--sidebar-text-active)" : "var(--text-primary)";

  const content = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 8 : 10,
        textDecoration: "none",
        color: textColor,
      }}
    >
      <Mark size={s.mark} inverse={inverse} />
      {variant === "full" && (
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: s.text,
            fontWeight: 400,
            letterSpacing: "0.025em",
            color: textColor,
            lineHeight: 1,
          }}
        >
          in case
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return content;
}
