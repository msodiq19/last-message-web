import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "in case — For the things people should hear, even if you never get the chance to say them.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F6F1E8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Left — text content */}
        <div
          style={{
            width: "620px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 64px",
            background: "#F6F1E8",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#163C34",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              ✉
            </div>
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#163C34", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              in case
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 600,
              color: "#1F1F1C",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>For the things</span>
            <span>people should hear.</span>
          </div>

          {/* Subtext */}
          <div
            style={{
              fontSize: "20px",
              color: "#4A4843",
              lineHeight: 1.6,
              marginBottom: "40px",
              display: "flex",
            }}
          >
            Zero-knowledge encrypted messages,<br/>delivered only when it truly matters.
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["End-to-end encrypted", "Zero-knowledge", "Privacy-first"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  border: "1.5px solid rgba(22,60,52,0.2)",
                  fontSize: "13px",
                  color: "#163C34",
                  fontWeight: 500,
                  background: "rgba(22,60,52,0.06)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — green panel */}
        <div
          style={{
            flex: 1,
            background: "#163C34",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 48px",
          }}
        >
          {/* Envelope icon */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "rgba(246,241,232,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "36px",
              fontSize: "56px",
            }}
          >
            ✉
          </div>

          <div
            style={{
              fontSize: "22px",
              fontStyle: "italic",
              color: "#F6F1E8",
              textAlign: "center",
              lineHeight: 1.65,
              maxWidth: "340px",
              display: "flex",
            }}
          >
            &ldquo;A quiet kind of security. Knowing your words will reach the people you love.&rdquo;
          </div>

          <div style={{ marginTop: "20px", fontSize: "14px", color: "rgba(246,241,232,0.5)", display: "flex" }}>
            incase.dmsodiq.xyz
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
