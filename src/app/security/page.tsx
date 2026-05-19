import Link from "next/link";
import {
  Lock,
  KeyRound,
  EyeOff,
  Server,
  ShieldCheck,
  ArrowLeft,
  GitBranch,
  Inbox,
  HardDrive,
  RefreshCw,
} from "lucide-react";
import { Logo } from "@/lib/components/Logo";
import { TrustBadge } from "@/lib/components/TrustBadge";

export const metadata = {
  title: "Security Architecture | In Case",
  description:
    "How In Case uses zero-knowledge encryption to ensure only the intended recipient ever reads your message.",
};

const layer = (
  icon: React.ReactNode,
  title: string,
  body: string,
  badge?: React.ReactNode
) => (
  <div
    style={{
      display: "flex",
      gap: 24,
      padding: "32px 0",
      borderBottom: "1px solid var(--border)",
    }}
  >
    <div
      style={{
        flexShrink: 0,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(22,60,52,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 3,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 19,
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {title}
        </h3>
        {badge}
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>{body}</p>
    </div>
  </div>
);

export default function SecurityPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 64px",
          borderBottom: "1px solid var(--border)",
          background: "var(--cream)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Logo href="/" size="sm" />
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={13} strokeWidth={1.75} />
          Back to home
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ padding: "80px 64px 60px", maxWidth: 760, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            marginBottom: 16,
          }}
        >
          Security
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 500,
            color: "var(--text-primary)",
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            marginBottom: 20,
          }}
        >
          How In Case protects<br />what matters most.
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            maxWidth: 560,
            marginBottom: 32,
          }}
        >
          We built In Case on a simple premise: your words should be invisible to
          everyone — including us — until the moment they need to be delivered.
          Here is exactly how that works.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <TrustBadge variant="lock" size="md" />
          <TrustBadge variant="zk" size="md" />
          <TrustBadge variant="key" size="md" />
        </div>
      </div>

      {/* The one-sentence principle */}
      <div
        style={{
          padding: "28px 64px",
          background: "var(--green-deep)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            fontStyle: "italic",
            color: "var(--cream)",
            opacity: 0.9,
            margin: 0,
          }}
        >
          &ldquo;Only you hold the encryption key. Not us. Not ever.&rdquo;
        </p>
      </div>

      {/* Architecture layers */}
      <div style={{ padding: "40px 64px 80px", maxWidth: 760, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 8,
            letterSpacing: "-0.015em",
          }}
        >
          The architecture
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 0 }}>
          Seven layers — from the moment you write to the moment it&apos;s received.
        </p>

        {layer(
          <Lock size={18} strokeWidth={1.5} color="var(--green-deep)" />,
          "Client-side encryption",
          "Your message is encrypted in your browser before it leaves your device. We use AES-256-GCM with keys derived from a passphrase only you know. Plaintext never touches our servers.",
          <TrustBadge variant="lock" size="sm" />
        )}

        {layer(
          <KeyRound size={18} strokeWidth={1.5} color="var(--green-deep)" />,
          "Zero-knowledge key architecture",
          "Your encryption key is never transmitted to or stored on our servers. We cannot reconstruct it, subpoena it, or surrender it. The key material exists only in your browser at the moment of writing and in the possession of your recipient at the moment of delivery.",
          <TrustBadge variant="key" size="sm" />
        )}

        {layer(
          <EyeOff size={18} strokeWidth={1.5} color="var(--green-deep)" />,
          "Server-side blindness",
          "Our servers store only the ciphertext — an opaque blob of encrypted bytes that is meaningless without the key. Database administrators, engineers, and any legal process directed at In Case would receive only unreadable data.",
          <TrustBadge variant="zk" size="sm" />
        )}

        {layer(
          <Server size={18} strokeWidth={1.5} color="var(--green-deep)" />,
          "Encrypted at rest",
          "All storage volumes are encrypted at the infrastructure level using AES-256. This means even a physical breach of our hosting provider would not compromise the ciphertext stored there.",
          undefined
        )}

        {layer(
          <GitBranch size={18} strokeWidth={1.5} color="var(--green-deep)" />,
          "Inactivity detection — no false triggers",
          "The check-in system is designed with double-confirmation to prevent false delivery. Missed check-ins trigger a grace period and multiple notification attempts across channels before any delivery is initiated. You are always in control.",
          undefined
        )}

        {layer(
          <Inbox size={18} strokeWidth={1.5} color="var(--green-deep)" />,
          "Secure delivery handshake",
          "When delivery is triggered, recipients receive a unique single-use link. The decryption key is passed in the URL fragment — a portion of the URL that is never sent to our server by the browser. Only the recipient's device performs decryption.",
          undefined
        )}

        {layer(
          <HardDrive size={18} strokeWidth={1.5} color="var(--green-deep)" />,
          "Post-delivery deletion",
          "After a message is successfully read and confirmed by the recipient, the ciphertext is permanently deleted from our systems. We retain no copy. There is nothing left to compromise.",
          undefined
        )}
      </div>

      {/* What we cannot do */}
      <div style={{ padding: "0 64px 80px", maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            padding: "28px 32px",
            background: "var(--cream-warm)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 19,
              fontWeight: 500,
              marginBottom: 16,
              color: "var(--text-primary)",
            }}
          >
            What In Case cannot do
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Read your message content — ever",
              "Decrypt your messages on your behalf",
              "Provide message content in response to a legal request",
              "Recover your encryption key if it is lost",
              "Alter or prevent delivery once it has been triggered",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                <ShieldCheck size={14} strokeWidth={1.75} color="var(--green-deep)" style={{ marginTop: 3, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audits & updates */}
      <div style={{ padding: "0 64px 80px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <RefreshCw size={16} strokeWidth={1.5} color="var(--text-muted)" style={{ marginTop: 4, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
              Ongoing security review
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75 }}>
              This architecture is reviewed and updated regularly. We intend to publish an independent third-party security audit before general availability. If you are a security researcher and have found a concern, please contact{" "}
              <a href="mailto:security@incase.app" style={{ color: "var(--green-deep)", textDecoration: "none" }}>security@incase.app</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "48px 64px", background: "var(--cream-warm)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
            fontWeight: 500,
            marginBottom: 16,
            color: "var(--text-primary)",
          }}
        >
          Trust is earned through architecture, not promises.
        </p>
        <Link href="/sign-up" className="ic-btn ic-btn-primary ic-btn-lg">
          Start protecting your words
        </Link>
      </div>
    </div>
  );
}
