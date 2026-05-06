import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Last Message — Encrypted Dead Man's Switch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Lock icon */}
        <div
          style={{
            display: "flex",
            marginBottom: "32px",
            fontSize: "64px",
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a0a0a0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          Last Message
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "#a0a0a0",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          A dead man's switch for the words that matter
        </div>

        {/* Features line */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            fontSize: "18px",
            color: "#666666",
          }}
        >
          <span>Zero-Knowledge Encryption</span>
          <span style={{ color: "#333" }}>•</span>
          <span>No Accounts</span>
          <span style={{ color: "#333" }}>•</span>
          <span>Open Source</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
