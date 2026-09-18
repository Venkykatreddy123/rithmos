"use client";

import { useState } from "react";
import Link from "next/link";
import WaveformDivider from "./WaveformDivider";

const footerLinks = {
  Navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About RITHMOS" },
    { href: "/competition", label: "The Competition" },
    { href: "/experience", label: "Stages & Venues" },
    { href: "/watch", label: "Watch & Live Sets" },
    { href: "/partners", label: "Sponsors & Partners" },
    { href: "/contact", label: "Contact & Auditions" },
  ],
  "For Musicians": [
    { href: "/contact", label: "Band Registration (Free)" },
    { href: "/competition", label: "Audio Tech Rider Specs" },
    { href: "/competition", label: "Scoring Matrix & Rubric" },
    { href: "/about", label: "Prize Fund Breakdown" },
    { href: "/watch", label: "Past Winner Sets" },
  ],
  "Live Property": [
    { href: "/partners", label: "Brand Partnerships" },
    { href: "/experience", label: "Gachibowli Arena Access" },
    { href: "/contact", label: "Press & Media Passes" },
    { href: "/contact", label: "Crew & Audio Volunteers" },
  ],
};

const socials = [
  { name: "Instagram", href: "https://instagram.com", icon: "📸" },
  { name: "YouTube", href: "https://youtube.com", icon: "🎥" },
  { name: "Spotify", href: "https://spotify.com", icon: "🎧" },
  { name: "Soundcloud", href: "https://soundcloud.com", icon: "☁️" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 6000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        background: "#F8F9FA",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        position: "relative",
        zIndex: 20,
      }}
    >
      <WaveformDivider inverted />

      {/* Main Container */}
      <div
        className="footer-main-container"
        style={{
          maxWidth: "1380px",
          margin: "0 auto",
          padding: "5rem 2.5rem 3rem",
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: "3.5rem",
            marginBottom: "4rem",
          }}
          className="footer-grid"
        >
          {/* Brand & Newsletter Column */}
          <div>
            {/* Logo Brand Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  background: "var(--red)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.6rem",
                  color: "#FFFFFF",
                  boxShadow: "0 0 15px var(--red)",
                }}
              >
                R
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "1.8rem",
                    letterSpacing: "0.08em",
                    color: "#0F1115",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  RITHMOS
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    color: "var(--red)",
                    textTransform: "uppercase",
                  }}
                >
                  Where Bands Rise
                </span>
              </div>
            </div>

            <p className="body-copy" style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#4B5563", marginBottom: "1.5rem" }}>
              Hyderabad&apos;s premier live music property and stadium rock championship. From underground rehearsal vaults to the 12,000-capacity Gachibowli Live Arena.
            </p>

            {/* Newsletter Subscription */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "6px",
                padding: "1.25rem",
                marginBottom: "1.5rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  color: "#0F1115",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  margin: "0 0 0.5rem 0",
                }}
              >
                ⚡ Get Audition & Ticket Drop Alerts
              </p>
              {subscribed ? (
                <div style={{ color: "#00AA44", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                  ✓ You are on the VIP Soundcheck Dispatch list!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-newsletter-form" style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.6rem 0.85rem",
                      background: "#F8F9FA",
                      border: "1px solid rgba(0, 0, 0, 0.14)",
                      borderRadius: "4px",
                      color: "#0F1115",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
                  >
                    Join
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-pill"
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p
                className="label-caps"
                style={{
                  marginBottom: "1.5rem",
                  fontSize: "0.85rem",
                }}
              >
                {heading}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Telemetry Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem",
            background: "#FFFFFF",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "6px",
            marginBottom: "2rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="hud-badge red">
              <span className="live-indicator" /> SEASON 01 ACTIVE
            </span>
            <span className="mono-telemetry" style={{ color: "#0F1115" }}>
              📍 17.3850° N, 78.4867° E · HYDERABAD
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="mono-telemetry" style={{ color: "var(--gold)" }}>
              ₹25,00,000 PRIZE POOL ALLOCATED
            </span>
            <button
              onClick={scrollToTop}
              style={{
                padding: "0.4rem 0.9rem",
                background: "#F8F9FA",
                border: "1px solid rgba(0, 0, 0, 0.14)",
                borderRadius: "4px",
                color: "#0F1115",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                cursor: "pointer",
              }}
            >
              ↑ Top
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
          className="footer-bottom"
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>
            © 2026 RITHMOS LIVE PROPERTY. All rights reserved. Registered trademark.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--muted)", margin: 0 }}>
            Designed for the Indian Live Music Renaissance
          </p>
        </div>
      </div>

      <style>{`
        .footer-nav-link {
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: #4B5563;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .footer-nav-link:hover {
          color: var(--red);
          transform: translateX(4px);
        }
        .footer-social-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          color: #0F1115;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
          transition: all 0.25s ease;
        }
        .footer-social-pill:hover {
          background: rgba(230, 20, 56, 0.08);
          border-color: var(--red);
          color: var(--red);
          box-shadow: 0 0 12px rgba(230, 20, 56, 0.2);
          transform: translateY(-2px);
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .footer-bottom { flex-direction: column !important; text-align: center !important; }
          .footer-newsletter-form { flex-direction: column !important; }
          .footer-main-container { padding: 3.5rem 1.25rem 5.5rem !important; }
        }
      `}</style>
    </footer>
  );
}
