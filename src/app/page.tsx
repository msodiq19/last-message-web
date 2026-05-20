"use client";
import Link from "next/link";
import Image from "next/image";
import {
  PenLine,
  CalendarClock,
  Send,
  Lock,
  SlidersHorizontal,
  EyeOff,
  Radio,
  Users,
  Plane,
  Briefcase,
  Heart,
  ShieldCheck,
  ArrowRight,
  Play,
} from "lucide-react";
import { Logo } from "@/lib/components/Logo";
import { TrustBadge, TrustRow } from "@/lib/components/TrustBadge";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Nav ── */}
      <nav className="ic-landing-nav">
        <Logo href="/" size="sm" />
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, color: "var(--text-secondary)" }}>
          {([
            ["How it works", "#how-it-works"],
            ["Security", "/security"],
          ] as [string, string][]).map(([item, href]) => (
            <a key={item} href={href} style={{ textDecoration: "none", color: "inherit", transition: "color 0.15s" }}>{item}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Log in</Link>
          <Link href="/sign-up" className="ic-btn ic-btn-primary ic-btn-sm">Get started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%" }}>
          <Image
            src="/hero-envelope.png"
            alt="A sealed envelope resting on a warm wooden desk"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--cream) 0%, rgba(246,241,232,0.6) 35%, transparent 65%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 2, padding: "80px 64px", maxWidth: 640 }}>
          <div className="ic-animate-up" style={{ marginBottom: 28 }}>
            <TrustRow />
          </div>

          <h1
            className="ic-display ic-animate-up"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 3.8rem)",
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.12,
              marginBottom: 24,
              letterSpacing: "-0.03em",
            }}
          >
            For the things<br />
            people should hear,<br />
            <em style={{ fontStyle: "italic", color: "var(--green-deep)" }}>
              even if you never get<br />the chance
            </em>{" "}
            to say them.
          </h1>

          <p
            className="ic-animate-up-d1"
            style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 40, maxWidth: 440 }}
          >
            Write a message. Choose your check-in period. If you stop checking in,
            we&apos;ll deliver it securely to the people you choose.
          </p>

          <div className="ic-animate-up-d2" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/sign-up" className="ic-btn ic-btn-primary ic-btn-lg" style={{ gap: 8 }}>
              <PenLine size={15} strokeWidth={1.75} />
              Write your message
            </Link>
            <button className="ic-btn ic-btn-secondary ic-btn-lg" style={{ gap: 8 }} onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
              <Play size={13} strokeWidth={2} />
              See how it works
            </button>
          </div>

          <p
            className="ic-animate-up-d3"
            style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 24, display: "flex", alignItems: "center", gap: 6 }}
          >
            <Lock size={12} strokeWidth={1.75} />
            End-to-end encrypted. Only delivered after your selected period of inactivity.
          </p>
        </div>
      </div>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: "96px 64px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 12 }}>
            How it works
          </p>
          <h2
            className="ic-display"
            style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 64, color: "var(--text-primary)" }}
          >
            Peace of mind in three simple steps.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 0, alignItems: "start" }}>
            {[
              {
                icon: <PenLine size={22} strokeWidth={1.25} color="var(--green-deep)" />,
                step: "Write & encrypt",
                desc: "Write your message privately. Everything is encrypted on your device before it ever leaves.",
              },
              { divider: true },
              {
                icon: <CalendarClock size={22} strokeWidth={1.25} color="var(--green-deep)" />,
                step: "Set your check-in",
                desc: "Choose a check-in interval that fits your life. Weekly, monthly — you decide.",
              },
              { divider: true },
              {
                icon: <Send size={22} strokeWidth={1.25} color="var(--green-deep)" />,
                step: "We deliver if needed",
                desc: "If you don't check in, we'll deliver your message securely after the grace period.",
              },
            ].map((item, i) =>
              "divider" in item ? (
                <div key={i} style={{ display: "flex", justifyContent: "center", paddingTop: 26, color: "var(--border-strong)" }}>
                  <ArrowRight size={16} strokeWidth={1.5} />
                </div>
              ) : (
                <div key={i} style={{ textAlign: "center", padding: "0 20px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: "50%", background: "rgba(22,60,52,0.07)", marginBottom: 20 }}>
                    {item.icon}
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: 18, marginBottom: 8, color: "var(--text-primary)" }}>{item.step}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "80px 64px", background: "var(--cream-warm)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 className="ic-display" style={{ textAlign: "center", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 500, marginBottom: 52, letterSpacing: "-0.02em" }}>
            Built for life&apos;s uncertainties
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
            {[
              { icon: <Lock size={18} strokeWidth={1.5} color="var(--green-deep)" />, title: "Private by design", desc: "End-to-end encrypted. We can't read your messages." },
              { icon: <SlidersHorizontal size={18} strokeWidth={1.5} color="var(--green-deep)" />, title: "You stay in control", desc: "Adjust, pause, or cancel anytime. You decide everything." },
              { icon: <EyeOff size={18} strokeWidth={1.5} color="var(--green-deep)" />, title: "Zero-knowledge", desc: "We never have access to your messages or encryption keys." },
              { icon: <Radio size={18} strokeWidth={1.5} color="var(--green-deep)" />, title: "Reliable delivery", desc: "Redundant systems ensure delivery when it matters most." },
              { icon: <Users size={18} strokeWidth={1.5} color="var(--green-deep)" />, title: "Made for real life", desc: "For travelers, parents, and anyone planning for the unexpected." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "rgba(22,60,52,0.07)", marginBottom: 14 }}>
                  {icon}
                </div>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 5, color: "var(--text-primary)" }}>{title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security trust band ── */}
      <section style={{ padding: "24px 64px", background: "rgba(22,60,52,0.03)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <TrustBadge variant="lock" size="md" />
          <TrustBadge variant="zk" size="md" />
          <TrustBadge variant="key" size="md" />
          <Link href="/security" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--green-deep)", textDecoration: "none", fontWeight: 500 }}>
            Read the security architecture <ArrowRight size={11} strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* ── Pull quote ── */}
      <section style={{ padding: "96px 64px", background: "var(--green-deep)", textAlign: "center" }}>
        <blockquote
          className="ic-display"
          style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontStyle: "italic", maxWidth: 560, margin: "0 auto", lineHeight: 1.6, fontWeight: 400, color: "var(--cream)" }}
        >
          &ldquo;It&apos;s a quiet kind of security.<br />
          Knowing that if I can&apos;t be there,<br />
          my words still can.&rdquo;
        </blockquote>
        <p style={{ marginTop: 20, fontSize: 13, opacity: 0.5, color: "var(--cream)" }}>— Verified user</p>
      </section>

      {/* ── Why people choose In Case ── */}
      <section style={{ padding: "96px 64px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 className="ic-display" style={{ textAlign: "center", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 500, marginBottom: 8, letterSpacing: "-0.02em" }}>
            Why people choose In Case
          </h2>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginBottom: 52 }}>Different lives. Different stories. Same peace of mind.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {[
              { icon: <Plane size={16} strokeWidth={1.5} color="var(--green-deep)" />, title: "For travelers", desc: "Share what matters while you're away." },
              { icon: <Users size={16} strokeWidth={1.5} color="var(--green-deep)" />, title: "For parents", desc: "A message of love, always within reach." },
              { icon: <Briefcase size={16} strokeWidth={1.5} color="var(--green-deep)" />, title: "For professionals", desc: "Protect access and important instructions." },
              { icon: <Heart size={16} strokeWidth={1.5} color="var(--green-deep)" />, title: "For the ones we love", desc: "For the words that matter most." },
              { icon: <ShieldCheck size={16} strokeWidth={1.5} color="var(--green-deep)" />, title: "For the unexpected", desc: "Because life doesn't always go as planned." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="ic-card" style={{ padding: "20px 16px", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "rgba(22,60,52,0.08)", marginBottom: 12 }}>
                  {icon}
                </div>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: "var(--text-primary)" }}>{title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 64px", background: "var(--cream-warm)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 className="ic-display" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Protect what matters, starting today.
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 28 }}>
            Create your first message in minutes. No credit card required.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Link href="/sign-up" className="ic-btn ic-btn-primary">Get started — it's free</Link>
            <Link href="/login" style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none" }}>Already have an account?</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "52px 64px 36px", borderTop: "1px solid var(--border)", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 24, marginBottom: 40 }}>
          <div>
            <Logo href="/" size="sm" />
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, marginTop: 14 }}>
              Important words.<br />Protected by silence.<br />Delivered with care.
            </p>
          </div>
          {[
            { heading: "Product", links: [["How it works", "#how-it-works"], ["Security", "/security"]] },
            { heading: "Company", links: [["Contact", "mailto:sodiqamuhammed@gmail.com"]] },
            { heading: "Legal", links: [["Privacy", "/privacy"], ["Terms of Service", "/terms"]] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ fontWeight: 600, fontSize: 11, marginBottom: 14, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{heading}</p>
              {(links as [string, string][]).map(([label, href]) => (
                <a key={label} href={href} style={{ display: "block", fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 8 }}>{label}</a>
              ))}
            </div>
          ))}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Lock size={12} strokeWidth={1.75} color="var(--green-deep)" />
              <p style={{ fontWeight: 600, fontSize: 12, color: "var(--text-primary)" }}>Your privacy is everything.</p>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65 }}>
              We don&apos;t store your messages.<br />They stay encrypted — always.
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>© 2026 In Case, Inc. All rights reserved.</p>
          <TrustBadge variant="lock" size="sm" />
        </div>
      </footer>

    </div>
  );
}
