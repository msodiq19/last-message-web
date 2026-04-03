"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconCheckCircle() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "#22c55e" }}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline
        points="20 6 9 17 4 12"
        style={{
          strokeDasharray: 100,
          strokeDashoffset: 0,
          animation: "checkDraw 0.5s ease 0.2s both",
        }}
      />
    </svg>
  );
}

function IconXCircle() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(247,246,251,0.4)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        border: "3px solid rgba(255,255,255,0.1)",
        borderTopColor: "var(--amber)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto",
      }}
    />
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

function CheckinContent() {
  const searchParams = useSearchParams();
  const ct = searchParams.get("ct");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "missing">(
    ct ? "loading" : "missing"
  );

  useEffect(() => {
    if (!ct) return;
    fetch(`/api/checkin?ct=${encodeURIComponent(ct)}`)
      .then((res) => {
        if (res.ok) setStatus("success");
        else setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, [ct]);

  const statusConfig = {
    loading: {
      icon: null,
      title: "Checking you in…",
      subtitle: "Hold on a moment.",
      color: "var(--text-on-dark-secondary)",
    },
    success: {
      icon: <IconCheckCircle />,
      title: "Check-in confirmed.",
      subtitle: "Your timer has been reset. See you in 14 days — or sooner.",
      color: "var(--green)",
    },
    error: {
      icon: <IconXCircle />,
      title: "Check-in failed.",
      subtitle:
        "This token is invalid, already used, or the message has been released. Make sure you're using the correct check-in URL.",
      color: "var(--red)",
    },
    missing: {
      icon: <IconInfo />,
      title: "No token found.",
      subtitle:
        "This link is missing a check-in token. Use the URL you received when you created your message.",
      color: "var(--text-on-dark-muted)",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow orb */}
      <div
        className="lm-glow"
        style={{
          width: 400,
          height: 400,
          background: "rgba(245,158,11,0.06)",
          top: -100,
          right: -100,
        }}
      />

      {/* Brand */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 40,
          fontWeight: 800,
          fontSize: "1rem",
          color: "var(--text-on-dark-secondary)",
          letterSpacing: "-0.01em",
        }}
      >
        Last Message
      </div>

      {/* Card */}
      <div
        className="lm-card-dark lm-animate-in"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "36px 32px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Icon / spinner */}
        <div style={{ marginBottom: 4 }}>
          {status === "loading" ? <Spinner /> : config.icon}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1
            style={{
              fontWeight: 800,
              fontSize: "1.5rem",
              color: status === "loading" ? "var(--text-on-dark)" : config.color,
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {config.title}
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-on-dark-secondary)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {config.subtitle}
          </p>
        </div>

        {status === "success" && (
          <div
            style={{
              marginTop: 8,
              padding: "12px 20px",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.18)",
              borderRadius: 12,
              fontSize: "0.8125rem",
              color: "var(--text-on-dark-secondary)",
              lineHeight: 1.5,
              width: "100%",
            }}
          >
            The clock resets each time you check in. Your next deadline is 14 days from now.
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: "var(--amber)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      }
    >
      <CheckinContent />
    </Suspense>
  );
}

