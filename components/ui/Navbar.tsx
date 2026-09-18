"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/competition", label: "Competition" },
  { href: "/experience", label: "Experience" },
  { href: "/watch", label: "Watch" },
  { href: "/partners", label: "Partners" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="navbar-main"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled
            ? "rgba(255,255,255,0.96)"
            : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.05)" : "none",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rithmos-logo.png"
            alt="RITHMOS — Where Bands Rise"
            className="navbar-logo-img"
            style={{
              height: "44px",
              width: "auto",
              display: "block",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))",
            }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button & Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <Link
            href="/contact"
            className="btn-primary nav-desktop-cta"
            style={{ fontSize: "0.82rem", padding: "0.55rem 1.3rem" }}
          >
            Register Your Band
          </Link>

          {/* Compact Mobile CTA Pill */}
          <Link
            href="/contact"
            className="nav-mobile-cta"
            style={{
              display: "none",
              background: "var(--red)",
              color: "#FFFFFF",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "0.45rem 0.85rem",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Register
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              width: "42px",
              height: "42px",
              padding: "8px",
              borderRadius: "6px",
            }}
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "#0F1115",
                borderRadius: "2px",
                transition: "transform 0.3s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "#0F1115",
                borderRadius: "2px",
                transition: "opacity 0.3s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "#0F1115",
                borderRadius: "2px",
                transition: "transform 0.3s ease",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Solid Opaque High-Z Mobile Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: "#FFFFFF",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "1.5rem 1.5rem 2.5rem",
            animation: "fadeIn 0.25s ease-out forwards",
            overflowY: "auto",
          }}
        >
          {/* Top Bar inside Menu: Logo + Close Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "1rem",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/rithmos-logo.png"
              alt="RITHMOS"
              style={{ height: "38px", width: "auto" }}
            />
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                background: "#F4F4F6",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0F1115",
                fontSize: "1.4rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Nav Links Stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              margin: "2rem 0",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "var(--red)",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              NAVIGATION // DIRECTORY
            </span>
            {navLinks.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 7vw, 2.8rem)",
                  textTransform: "uppercase",
                  color: "#0F1115",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.3rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ fontSize: "0.9rem", color: "var(--red)", fontFamily: "var(--font-mono)" }}>
                  0{idx + 1}
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom Drawer CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
              style={{
                textAlign: "center",
                padding: "1rem 1.5rem",
                fontSize: "1.05rem",
                width: "100%",
                boxShadow: "0 8px 25px rgba(230, 20, 56, 0.3)",
              }}
            >
              Register Your Band (Free) →
            </Link>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#6B7280" }}>
                SEASON 01 · HYDERABAD
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--red)", fontWeight: 700 }}>
                100% LIVE MUSIC
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-main {
          padding: 1rem 2.5rem;
        }
        @media (max-width: 768px) {
          .navbar-main {
            padding: 0.75rem 1.25rem !important;
          }
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .nav-desktop-cta { display: none !important; }
          .nav-mobile-cta { display: inline-block !important; }
          .navbar-logo-img { height: 36px !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
