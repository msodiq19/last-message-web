"use client";

import { useState, useEffect, use } from "react";
import { SecurityService } from "@/lib/SecurityService";

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconUpload() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--amber)" }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span
      className="lm-spinner"
      style={{ borderTopColor: "var(--navy)" }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [encryptedBlob, setEncryptedBlob] = useState<string | null>(null);
  const [encryptedFragmentA, setEncryptedFragmentA] = useState<string | null>(null);
  const [secretQuestion, setSecretQuestion] = useState<string>("");
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "decrypted" | "error" | "not-found">("loading");
  const [decrypting, setDecrypting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`/api/read/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not found");
      })
      .then((data) => {
        setEncryptedBlob(data.encrypted_blob);
        setEncryptedFragmentA(data.encrypted_fragment_a);
        setSecretQuestion(data.secret_question);
        setStatus("ready");
      })
      .catch(() => setStatus("not-found"));
  }, [id]);

  async function handleDecrypt() {
    if (!encryptedBlob || !encryptedFragmentA || !answerInput.trim()) return;
    setDecrypting(true);
    setErrorMessage("");
    try {
      const fragmentBHex = window.location.hash.slice(1);
      if (!fragmentBHex) {
        throw new Error("Missing URL fragment. Did you copy the full link?");
      }
      const fragmentA = await SecurityService.decryptFragmentA(encryptedFragmentA, answerInput.trim());
      const vk = SecurityService.reconstructVaultKey(fragmentA, fragmentBHex);
      const result = await SecurityService.decryptContent(encryptedBlob, vk);
      setDecryptedMessage(result);
      setStatus("decrypted");
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Incorrect answer or invalid link.");
    }
    setDecrypting(false);
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div style={pageStyle}>
      {/* Glow orb */}
      <div
        className="lm-glow"
        style={{ width: 500, height: 500, background: "rgba(245,158,11,0.05)", top: -150, right: -150 }}
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

      <div
        style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}
        className="lm-animate-in"
      >
        {/* ── Loading ──────────────────────────────── */}
        {status === "loading" && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid rgba(255,255,255,0.1)",
                borderTopColor: "var(--amber)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "var(--text-on-dark-muted)", fontSize: "0.9375rem" }}>Loading message…</p>
          </div>
        )}

        {/* ── Not Found ────────────────────────────── */}
        {status === "not-found" && (
          <div className="lm-card-dark" style={{ padding: "48px 40px", textAlign: "center" }}>
            <p style={{ fontSize: "2rem", marginBottom: 16 }}>🔒</p>
            <h1 style={{ fontWeight: 800, fontSize: "1.375rem", color: "var(--text-on-dark)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              Message not found.
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-on-dark-secondary)", margin: 0, lineHeight: 1.6 }}>
              This message doesn&apos;t exist yet, or hasn&apos;t been released. If you&apos;re the sender, make sure you&apos;re still checking in.
            </p>
          </div>
        )}

        {/* ── Ready — key entry ────────────────────── */}
        {status === "ready" && (
          <div>
            <div className="lm-card-dark" style={{ padding: "28px 28px", marginBottom: 12 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(245,158,11,0.10)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: "var(--radius-pill)",
                  padding: "5px 14px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--amber)",
                  marginBottom: 20,
                }}
              >
                <span>✦</span>
                <span>Someone left you a message</span>
              </div>

              <h1
                style={{
                  fontWeight: 900,
                  fontSize: "1.625rem",
                  color: "var(--text-on-dark)",
                  margin: "0 0 12px",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                }}
              >
                You have a final message waiting.
              </h1>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--text-on-dark-secondary)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                The person who wrote this set it to be released if they stopped checking in for 14 days. They didn&apos;t check in. This message is now yours to read — if you have their encryption key.
              </p>
            </div>

            {/* Key upload card */}
            <div className="lm-card-dark" style={{ padding: "24px 28px" }}>
              <div style={{ marginBottom: 20 }}>
                <label className="lm-label" style={{ color: "var(--amber)", fontSize: "0.875rem" }}>
                  The Memory Lock:
                </label>
                <p style={{ fontWeight: 600, fontSize: "1.125rem", color: "var(--text-on-dark)", marginTop: 4 }}>
                  {secretQuestion}
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="lm-label" style={{ color: "var(--text-on-dark-muted)" }}>
                  Your Answer
                </label>

                <input
                  type="text"
                  className="lm-input"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1.5px solid rgba(255,255,255,0.10)",
                    color: "var(--text-on-dark)",
                  }}
                  placeholder="Type the answer exactly..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleDecrypt(); }}
                />
              </div>

              {errorMessage && (
                <div style={{ color: "#f87171", fontSize: "0.875rem", marginBottom: 16, textAlign: "center" }}>
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleDecrypt}
                disabled={!answerInput.trim() || decrypting}
                className="lm-btn lm-btn-dark"
                style={{ width: "100%" }}
              >
                {decrypting ? (
                  <><Spinner /> Decrypting…</>
                ) : (
                  <><IconLock /> Read the message</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Decrypted ─────────────────────────────── */}
        {status === "decrypted" && decryptedMessage && (
          <div className="lm-animate-in">
            <div
              style={{
                marginBottom: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "var(--radius-pill)",
                padding: "5px 14px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#4ade80",
              }}
            >
              <span>✓</span>
              <span>Message decrypted</span>
            </div>

            {/* Letter pane */}
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
                padding: "40px 36px",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: 24,
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 16,
                }}
              >
                From the person who chose you
              </p>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "1.0625rem",
                  lineHeight: 1.8,
                  color: "var(--text-primary)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  letterSpacing: "0.01em",
                }}
              >
                {decryptedMessage}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

