import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'Inter', sans-serif" }}>
      {/* ── Nav ── */}
      <nav className="ic-landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--forest)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13 }}>✉</div>
          <span style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>in case</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, color: "var(--text-secondary)" }}>
          {["How it works", "Why it matters", "Security", "Stories", "FAQ"].map((item) => (
            <a key={item} href="#" style={{ textDecoration: "none", color: "inherit", transition: "color 0.15s" }}>{item}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Log in</Link>
          <Link href="/sign-up" className="ic-btn ic-btn-primary ic-btn-sm">Join the waitlist</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Background image side */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "48%", background: "linear-gradient(to left, var(--cream-warm), var(--cream))", backgroundImage: "url('/hero-envelope.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "48%", background: "linear-gradient(to right, var(--cream) 0%, transparent 30%)" }} />

        <div style={{ position: "relative", zIndex: 2, padding: "60px 48px", maxWidth: 600 }}>
          <h1 className="ic-display ic-animate-up" style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.025em" }}>
            For the things<br />people should hear,<br /><em style={{ fontStyle: "italic", color: "var(--forest)" }}>even if you never get<br />the chance</em> to say them.
          </h1>
          <p className="ic-animate-up-d1" style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
            Write a message. Choose your check-in period. If you stop checking in, we&apos;ll deliver it securely to the people you choose.
          </p>
          <div className="ic-animate-up-d2" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/sign-up" className="ic-btn ic-btn-primary ic-btn-lg">
              Write your message
            </Link>
            <button className="ic-btn ic-btn-secondary ic-btn-lg" style={{ gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
              See how it works
            </button>
          </div>
          <p className="ic-animate-up-d3" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            End-to-end encrypted. Only delivered after your selected period of inactivity.
          </p>
        </div>
      </div>

      {/* ── How it works ── */}
      <section style={{ padding: "80px 48px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8 }}>How it works</p>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Peace of mind in three simple steps.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 0, alignItems: "start", marginTop: 40 }}>
            {[
              { icon: "✏️", step: "1. Write & encrypt", desc: "Write your message and we encrypt it on your device." },
              { icon: "···", divider: true },
              { icon: "📅", step: "2. Set your check-in", desc: "Choose how often you'll check in. You decide what works for you." },
              { icon: "···", divider: true },
              { icon: "✈️", step: "3. We deliver if needed", desc: "If you don't check in, we'll deliver your message securely after the grace period." },
            ].map((item, i) => item.divider ? (
              <div key={i} style={{ display: "flex", justifyContent: "center", paddingTop: 28, color: "var(--border-strong)", fontSize: 20 }}>—</div>
            ) : (
              <div key={i} style={{ textAlign: "center", padding: "0 12px" }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{item.icon}</div>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{item.step}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "60px 48px", background: "var(--cream-warm)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, marginBottom: 36 }}>Built for life&apos;s uncertainties</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
            {[
              { icon: "🔒", title: "Private by design", desc: "End-to-end encrypted. We can't read your messages." },
              { icon: "🎛️", title: "You stay in control", desc: "Adjust, pause, or cancel anytime. You decide who receives what." },
              { icon: "👁️‍🗨️", title: "Zero-knowledge", desc: "We never have access to your messages or encryption keys." },
              { icon: "📡", title: "Reliable delivery", desc: "Redundant systems ensure your message is delivered when it matters most." },
              { icon: "👥", title: "Made for real life", desc: "For travelers, parents, professionals, and anyone planning for the unexpected." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ textAlign: "center" }}>
                <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>{icon}</span>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pull quote ── */}
      <section style={{ padding: "80px 48px", background: "var(--forest-deep)", color: "white", textAlign: "center" }}>
        <blockquote className="ic-display" style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontStyle: "italic", maxWidth: 600, margin: "0 auto", lineHeight: 1.5, fontWeight: 400 }}>
          &ldquo;It&apos;s a quiet kind of security.<br />Knowing that if I can&apos;t be there,<br />my words still can.&rdquo;
        </blockquote>
        <p style={{ marginTop: 16, fontSize: 13, opacity: 0.6 }}>— Verified user</p>
      </section>

      {/* ── Why people choose ── */}
      <section style={{ padding: "80px 48px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Why people choose in case</h2>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginBottom: 40 }}>Different lives. Different stories. Same peace of mind.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {[
              { icon: "✈️", title: "For travelers", desc: "Share what matters while you're away." },
              { icon: "👨‍👩‍👧", title: "For parents", desc: "A message of love, always within reach." },
              { icon: "💼", title: "For professionals", desc: "Protect access and important instructions." },
              { icon: "❤️", title: "For the ones we love", desc: "For the words that matter most." },
              { icon: "🛡️", title: "For the unexpected", desc: "Because life doesn't always go as planned." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="ic-card" style={{ padding: 16, textAlign: "center" }}>
                <span style={{ fontSize: 22, display: "block", marginBottom: 8 }}>{icon}</span>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist CTA ── */}
      <section style={{ padding: "80px 48px", background: "var(--cream-warm)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Be the first to protect what matters.</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Join the waitlist and get early access, product updates,<br />and helpful insights on protecting what matters.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
              <span>👤👤👤</span>
              <span>Join 12,554+ people on the waitlist</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="ic-input" type="email" placeholder="Enter your email address" style={{ width: 240 }} />
            <Link href="/sign-up" className="ic-btn ic-btn-primary">Join the waitlist</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "40px 48px", borderTop: "1px solid var(--border)", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--forest)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11 }}>✉</div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>in case</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Important words.<br />Protected by silence.<br />Delivered with care.
            </p>
          </div>
          {[
            { heading: "Product", links: ["How it works", "Security", "FAQ", "Stories"] },
            { heading: "Company", links: ["About us", "Blog", "Careers", "Contact"] },
            { heading: "Legal", links: ["Privacy", "Terms of Service", "Data Policy"] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{heading}</p>
              {links.map((l) => <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 6 }}>{l}</a>)}
            </div>
          ))}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <p style={{ fontWeight: 600, fontSize: 13 }}>Your privacy is everything.</p>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>We don&apos;t store your messages. They stay encrypted.</p>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 32 }}>
          © 2024 In Case, Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
