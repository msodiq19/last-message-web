"use client";

import { useState, useEffect, useCallback } from "react";
import {
  generateCheckinToken,
} from "@/lib/crypto";
import { SecurityService } from "@/lib/SecurityService";
import { sha256 } from "@/lib/hash";

type Step = "compose" | "lock" | "route" | "confirm" | "done";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconWarning() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F59E0B" }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconCheck({ size = 16, color = "#22c55e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconKey() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F59E0B" }}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="lm-toast" role="status" aria-live="polite">
      <span className="lm-toast-icon">
        <IconCheck size={12} color="#fff" />
      </span>
      {message}
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="lm-card lm-animate-in"
      style={{
        padding: "20px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        animationDelay: delay,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "rgba(30, 18, 70, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--navy-mid)",
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)", margin: 0 }}>{title}</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "2px 0 0", lineHeight: 1.5 }}>{description}</p>
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step, variant = "light" }: { step: Step; variant?: "light" | "dark" }) {
  const steps: { key: Step; label: string }[] = [
    { key: "compose", label: "Write" },
    { key: "lock", label: "Lock" },
    { key: "route", label: "Route" },
    { key: "confirm", label: "Review" },
    { key: "done", label: "Done" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);
  const dotBg = variant === "dark" ? "rgba(255,255,255,0.15)" : "var(--border)";
  const activeBg = variant === "dark" ? "var(--amber)" : "var(--navy)";
  const completedBg = "var(--green)";
  const labelColor = variant === "dark" ? "var(--text-on-dark-muted)" : "var(--text-muted)";
  const activeLabelColor = variant === "dark" ? "var(--text-on-dark)" : "var(--text-primary)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {steps.map((s, i) => {
        const isActive = s.key === step;
        const isCompleted = i < currentIndex;
        return (
          <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: isActive ? 24 : 8,
                height: 8,
                borderRadius: "var(--radius-pill)",
                background: isCompleted ? completedBg : isActive ? activeBg : dotBg,
                transition: "all 0.25s var(--ease)",
              }}
            />
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? activeLabelColor : labelColor,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "color 0.2s var(--ease)",
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hero / Landing ───────────────────────────────────────────────────────────

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 50%, var(--navy-mid) 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow orbs */}
      <div
        className="lm-glow"
        style={{ width: 500, height: 500, background: "rgba(245,158,11,0.08)", top: -100, right: -100 }}
      />
      <div
        className="lm-glow"
        style={{ width: 400, height: 400, background: "rgba(61,42,138,0.5)", bottom: 50, left: -80 }}
      />

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.125rem",
            color: "var(--text-on-dark)",
            letterSpacing: "-0.02em",
          }}
        >
          Last Message
        </span>
        <button
          onClick={onStart}
          className="lm-btn lm-btn-primary"
          style={{ padding: "10px 22px", fontSize: "0.875rem" }}
        >
          Write a message
        </button>
      </nav>

      {/* Hero content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px 48px",
          position: "relative",
          zIndex: 1,
          gap: 28,
        }}
      >
        {/* Badge */}
        <div
          className="lm-animate-in"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: "var(--radius-pill)",
            padding: "6px 16px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--amber)",
            letterSpacing: "0.02em",
          }}
        >
          <span>✦</span>
          <span>End-to-end encrypted · No accounts · No servers see your words</span>
        </div>

        {/* Headline */}
        <div className="lm-animate-in-delay-1" style={{ maxWidth: 640 }}>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
              fontWeight: 900,
              color: "var(--text-on-dark)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Some words are
            <br />
            <span style={{ color: "var(--amber)" }}>worth saving</span>
            <br />
            for when you can&apos;t say them.
          </h1>
        </div>

        {/* Sub-headline */}
        <p
          className="lm-animate-in-delay-2"
          style={{
            fontSize: "1.0625rem",
            color: "var(--text-on-dark-secondary)",
            maxWidth: 480,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          Write a message. Encrypt it. If you stop checking in for 14 days, it&apos;s automatically delivered to whoever needs to read it.
        </p>

        {/* CTA */}
        <div className="lm-animate-in-delay-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <button
            onClick={onStart}
            className="lm-btn lm-btn-primary"
            style={{ fontSize: "1.0625rem", padding: "16px 40px" }}
          >
            Write your message
            <IconArrow />
          </button>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-on-dark-muted)", margin: 0 }}>
            Free. No sign-up required.
          </p>
        </div>
      </div>

      {/* Feature cards — below the fold */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 24px 60px",
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          <FeatureCard
            icon={<IconLock />}
            title="Client-side encryption"
            description="Your message is encrypted in your browser before anything leaves your device. We never see it."
            delay="0.4s"
          />
          <FeatureCard
            icon={<IconClock />}
            title="14-day dead switch"
            description="If you stop checking in, your message is released to your recipient. On schedule. No exceptions."
            delay="0.5s"
          />
          <FeatureCard
            icon={<IconMail />}
            title="Reminder emails"
            description="We'll ping you at 12 and 13 days. But the timer only stops when you click your check-in link."
            delay="0.6s"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Compose Form ─────────────────────────────────────────────────────────────

function FormCard({ children, onBack }: { children: React.ReactNode; onBack?: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {onBack && (
            <button
              onClick={onBack}
              className="lm-btn lm-btn-ghost-dark"
              style={{
                padding: "8px",
                borderRadius: 10,
                minWidth: "auto",
              }}
              aria-label="Go back"
            >
              <IconBack />
            </button>
          )}
          <span
            style={{
              fontWeight: 800,
              fontSize: "1rem",
              color: "var(--text-on-dark-secondary)",
              letterSpacing: "-0.01em",
            }}
          >
            Last Message
          </span>
        </div>
        <div className="lm-card" style={{ padding: "28px 28px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [view, setView] = useState<"landing" | "form">("landing");
  const [step, setStep] = useState<Step>("compose");
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [checkinUrl, setCheckinUrl] = useState("");
  const [handoverUrl, setHandoverUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lm_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.message) setMessage(parsed.message);
        if (parsed.senderEmail) setSenderEmail(parsed.senderEmail);
        if (parsed.recipientEmail) setRecipientEmail(parsed.recipientEmail);
        if (parsed.secretQuestion) setSecretQuestion(parsed.secretQuestion);
        if (parsed.secretAnswer) setSecretAnswer(parsed.secretAnswer);
        if (parsed.step && parsed.step !== "done") setStep(parsed.step);
        if (parsed.view) setView(parsed.view);
      } catch { }
    }
  }, []);

  useEffect(() => {
    if (mounted && step !== "done") {
      const data = { view, step, message, senderEmail, recipientEmail, secretQuestion, secretAnswer };
      localStorage.setItem("lm_draft", JSON.stringify(data));
    }
  }, [mounted, view, step, message, senderEmail, recipientEmail, secretQuestion, secretAnswer]);

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2500);
  }, []);

  async function handleSubmit() {
    if (!message.trim() || !senderEmail.trim() || !recipientEmail.trim() || !secretQuestion.trim() || !secretAnswer.trim()) {
      setError("All fields across all steps are required.");
      return;
    }
    if (senderEmail.trim().toLowerCase() === recipientEmail.trim().toLowerCase()) {
      setError("Sender and recipient email can't be the same.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const vk = SecurityService.generateVaultKey();
      const { fragmentA, fragmentBHex } = SecurityService.splitVaultKey(vk);
      const encryptedFragmentA = await SecurityService.encryptFragmentA(fragmentA, secretAnswer.trim());
      const encryptedBlob = await SecurityService.encryptContent(message, vk);

      const ct = generateCheckinToken();
      const ctHash = await sha256(ct);

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encrypted_blob: encryptedBlob,
          ct_hash: ctHash,
          sender_email: senderEmail,
          recipient_email: recipientEmail,
          secret_question: secretQuestion.trim(),
          encrypted_fragment_a: encryptedFragmentA,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create message");
      }

      const data = await res.json();
      const baseUrl = window.location.origin;
      setCheckinUrl(`${baseUrl}/checkin?ct=${ct}`);
      setHandoverUrl(`${baseUrl}/read/${data.id}#${fragmentBHex}`);
      localStorage.removeItem("lm_draft");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(checkinUrl);
    showToast("Check-in link copied to clipboard");
  }

  function handleBookmark() {
    // Open the check-in URL in a new tab so the user can bookmark it there
    window.open(checkinUrl, "_blank", "noopener");
    showToast("Opened in new tab — bookmark it from there");
  }

  if (view === "landing") {
    return <HeroSection onStart={() => setView("form")} />;
  }

  // ── Compose Step ──────────────────────────────────────────────────────────
  if (step === "compose") {
    const charCount = message.length;
    const charColor = charCount > 5000 ? "var(--red)" : charCount > 3000 ? "var(--amber)" : "var(--text-muted)";

    return (
      <FormCard onBack={() => setView("landing")}>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              Write your final words
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "2px 0 0" }}>
              Encrypted before it leaves your browser.
            </p>
          </div>
          <StepIndicator step={step} variant="light" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <textarea
              id="message"
              rows={8}
              className="lm-input"
              style={{ resize: "vertical", lineHeight: 1.6 }}
              placeholder="Write the words you want to be delivered…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p style={{ fontSize: "0.75rem", color: charColor, marginTop: 4, textAlign: "right", transition: "color 0.2s ease" }}>
              {charCount.toLocaleString()} characters
            </p>
          </div>

          <button
            onClick={() => setStep("lock")}
            disabled={!message.trim()}
            className="lm-btn lm-btn-primary"
            style={{ width: "100%", marginTop: 4 }}
          >
            Next: Set the Lock
            <IconArrow />
          </button>
        </div>
      </FormCard>
    );
  }

  // ── Lock Step ─────────────────────────────────────────────────────────────
  if (step === "lock") {
    return (
      <FormCard onBack={() => setStep("compose")}>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              The Memory Lock
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "2px 0 0" }}>
              A question only they would know.
            </p>
          </div>
          <StepIndicator step={step} variant="light" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label htmlFor="secretQuestion" className="lm-label">The Challenge</label>
            <input
              id="secretQuestion"
              type="text"
              className="lm-input"
              placeholder="e.g. What did we name the stray cat in Paris?"
              value={secretQuestion}
              onChange={(e) => setSecretQuestion(e.target.value)}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>
              Your recipient will be prompted with this question to open the vault.
            </p>
          </div>

          <div>
            <label htmlFor="secretAnswer" className="lm-label">The Exact Answer</label>
            <input
              id="secretAnswer"
              type="text"
              className="lm-input"
              placeholder="e.g. Barnaby"
              value={secretAnswer}
              onChange={(e) => setSecretAnswer(e.target.value)}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>
              The cryptographic key is securely derived directly from this answer.
            </p>
          </div>

          <button
            onClick={() => setStep("route")}
            disabled={!secretQuestion.trim() || !secretAnswer.trim()}
            className="lm-btn lm-btn-primary"
            style={{ width: "100%", marginTop: 4 }}
          >
            Next: Routing Details
            <IconArrow />
          </button>
        </div>
      </FormCard>
    );
  }

  // ── Route Step ────────────────────────────────────────────────────────────
  if (step === "route") {
    return (
      <FormCard onBack={() => setStep("lock")}>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              Routing Details
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "2px 0 0" }}>
              Where should we send the reminders?
            </p>
          </div>
          <StepIndicator step={step} variant="light" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label htmlFor="senderEmail" className="lm-label">Your email</label>
            <input
              id="senderEmail"
              type="email"
              className="lm-input"
              placeholder="you@example.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>
              We'll send you check-in reminders here.
            </p>
          </div>

          <div>
            <label htmlFor="recipientEmail" className="lm-label">Recipient's email</label>
            <input
              id="recipientEmail"
              type="email"
              className="lm-input"
              placeholder="who@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>
              For internal routing records only. You must securely share the Handover URL yourself.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: "var(--red-soft)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                color: "var(--red)",
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠</span>
              {error}
            </div>
          )}

          <button
            onClick={() => {
              if (senderEmail.trim().toLowerCase() === recipientEmail.trim().toLowerCase()) {
                setError("Sender and recipient email can't be the same.");
                return;
              }
              setError("");
              setStep("confirm");
            }}
            disabled={!senderEmail.trim() || !recipientEmail.trim()}
            className="lm-btn lm-btn-primary"
            style={{ width: "100%", marginTop: 4 }}
          >
            Review & Continue
            <IconArrow />
          </button>
        </div>
      </FormCard>
    );
  }

  // ── Confirm Step ──────────────────────────────────────────────────────────
  if (step === "confirm") {
    const warnings = [
      "Your message is encrypted client-side with AES-256-GCM. We never see it.",
      "The vault is cryptographically locked by your Secret Answer. If you forget it, the message is permanently lost.",
      "You'll receive a check-in URL. Bookmark it. Visit it at least once every 14 days.",
      "If you stop checking in, the message is released. You must securely share the Handover URL with your recipient.",
      "Anyone with the Handover URL and your Secret Answer can decrypt the message.",
    ];

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }} className="lm-animate-in">
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-on-dark-secondary)" }}>
              Last Message
            </span>
          </div>

          <div className="lm-card-dark" style={{ padding: "28px 28px" }}>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-on-dark)", margin: 0, letterSpacing: "-0.02em" }}>
                  Before you lock it in
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-on-dark-muted)", margin: "2px 0 0" }}>
                  Not reversible. Read carefully.
                </p>
              </div>
              <StepIndicator step={step} variant="dark" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {warnings.map((w, i) => (
                <div key={i} className="lm-warning-chip">
                  <span className="icon"><IconWarning /></span>
                  <span>{w}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: 14,
                marginBottom: 18,
                fontSize: "0.75rem",
                color: "var(--text-on-dark-muted)",
                lineHeight: 1.5,
              }}
            >
              Email reminders are best-effort. Failure to receive reminders does not pause release. We rely on your check-ins, not email delivery.
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  color: "#f87171",
                  marginBottom: 16,
                }}
              >
                <span style={{ flexShrink: 0 }}>⚠</span>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep("route")}
                className="lm-btn lm-btn-ghost-dark"
                style={{ flex: 1 }}
              >
                Go back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="lm-btn lm-btn-dark"
                style={{ flex: 1 }}
              >
                {loading ? (
                  <>
                    <span className="lm-spinner" style={{ width: 16, height: 16 }} />
                    Encrypting…
                  </>
                ) : (
                  <>
                    <IconLock />
                    Encrypt & store
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Done Step ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />

      <div style={{ width: "100%", maxWidth: 520 }} className="lm-animate-in">
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-on-dark-secondary)" }}>
            Last Message
          </span>
        </div>

        <div className="lm-card-dark" style={{ padding: "28px 28px" }}>
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div
                  className="lm-success-pop"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconCheck size={14} />
                </div>
                <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-on-dark)", margin: 0, letterSpacing: "-0.02em" }}>
                  Message stored
                </h2>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-on-dark-muted)", margin: 0 }}>
                Your links are ready. Please save them securely.
              </p>
            </div>
            <StepIndicator step={step} variant="dark" />
          </div>

          {/* Key warning replaced with Handover info */}
          <div style={{ marginBottom: 16 }}>
            <label className="lm-label" style={{ color: "var(--amber)" }}>
              Share this Handover URL Secretly
            </label>
            <div className="lm-copy-box" style={{ borderColor: 'rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.05)' }}>
              <input type="text" readOnly value={handoverUrl} aria-label="Handover URL" />
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-on-dark-secondary)", marginTop: 6, lineHeight: 1.4 }}>
              Give this to your trusted recipient. They will need it, along with your Secret Answer, to unlock the vault.
            </p>
          </div>

          {/* Check-in URL */}
          <div style={{ marginBottom: 14 }}>
            <label className="lm-label" style={{ color: "var(--text-on-dark-muted)" }}>
              Your check-in URL (Keep this private)
            </label>
            <div className="lm-copy-box">
              <input type="text" readOnly value={checkinUrl} aria-label="Check-in URL" />
            </div>
          </div>

          {/* Action buttons — Copy + Bookmark */}
          <div className="lm-action-row" style={{ marginBottom: 12 }}>
            <button
              onClick={handleCopy}
              className="lm-btn lm-btn-dark"
              style={{ padding: "12px 20px", fontSize: "0.875rem" }}
            >
              <IconCopy />
              Copy link
            </button>
            <button
              onClick={handleBookmark}
              className="lm-btn lm-btn-ghost-dark"
              style={{ padding: "12px 20px", fontSize: "0.875rem" }}
            >
              <IconBookmark />
              Bookmark
            </button>
          </div>

          {/* Bookmark keyboard hint */}
          <div className="lm-bookmark-hint" style={{ marginBottom: 16 }}>
            <IconKey />
            <span>
              Opens your check-in page — hit <kbd>Ctrl+D</kbd> / <kbd>⌘+D</kbd> there to bookmark it
            </span>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-on-dark-muted)", marginTop: 0, marginBottom: 16, lineHeight: 1.4 }}>
            Visit this link at least once every 14 days. The timer resets each time.
          </p>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 14,
              fontSize: "0.75rem",
              color: "var(--text-on-dark-muted)",
              lineHeight: 1.5,
            }}
          >
            We rely on your check-ins, not email delivery. If reminders don&apos;t arrive and you don&apos;t check in, your message will be released.
          </div>
        </div>
      </div>
    </div>
  );
}
