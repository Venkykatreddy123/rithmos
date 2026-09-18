"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveformDivider from "@/components/ui/WaveformDivider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const partnerTiers = [
  {
    tier: "Presenting Partner",
    color: "var(--gold)",
    borderColor: "rgba(201,146,42,0.4)",
    desc: "The headline partner — logo on all primary event collateral, stage branding, and RITHMOS digital channels.",
    spots: "1 spot available",
    partners: ["Your Brand Here"],
  },
  {
    tier: "Stage Partner",
    color: "var(--bone)",
    borderColor: "rgba(0,0,0,0.12)",
    desc: "Named partner for one stage — Club Stage or RITHMOS Stage. Full naming rights for that event.",
    spots: "2 spots available",
    partners: ["Stage Sponsor A", "Stage Sponsor B"],
  },
  {
    tier: "Event Partner",
    color: "var(--muted)",
    borderColor: "rgba(107,107,107,0.2)",
    desc: "Logo on event-specific collateral, social media mentions, and on-site branding at one event.",
    spots: "6 spots available",
    partners: ["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5", "Partner 6"],
  },
];

const benefits = [
  {
    icon: "◉",
    title: "Direct Reach",
    desc: "12,000+ live attendees across 4 events, plus a digital audience that grows with every season.",
  },
  {
    icon: "◉",
    title: "Youth Audience",
    desc: "RITHMOS reaches Hyderabad's 18–35 demographic — the most valuable and hardest to engage through traditional media.",
  },
  {
    icon: "◉",
    title: "Brand Association",
    desc: "Align your brand with creativity, aspiration, and the energy of India's next generation of musicians.",
  },
  {
    icon: "◉",
    title: "Content Library",
    desc: "Professionally produced photography and video content across every event, featuring your brand in context.",
  },
];

export default function PartnersPage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tier-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.2, ease: "power2.out",
          scrollTrigger: { trigger: ".tiers-section", start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".benefit-card",
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: ".benefits-section", start: "top 75%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── HERO — GOLD TREATMENT ────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          paddingTop: "160px",
          paddingBottom: "8rem",
          background: "var(--bg)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Gold light beams */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "30%",
            width: "800px",
            height: "100%",
            background:
              "radial-gradient(ellipse 400px 600px at 50% 0%, rgba(201,146,42,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "-100px",
            width: "600px",
            height: "80%",
            background:
              "radial-gradient(ellipse 300px 400px at 50% 0%, rgba(200,16,46,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, padding: "0 2.5rem" }}>
          <p
            className="label-caps"
            style={{
              marginBottom: "2rem",
              animation: "fade-in 0.8s ease forwards",
              color: "var(--gold)",
            }}
          >
            ⸺ Partnership Opportunities ⸺
          </p>
          <h1
            className="display-hero"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              color: "var(--bone)",
              animation: "slide-up 1s ease 0.3s forwards",
              opacity: 0,
            }}
          >
            Build Something<br />
            <span style={{ color: "var(--gold)" }}>Legendary</span>
          </h1>
          <p
            className="body-copy"
            style={{
              maxWidth: "560px",
              margin: "2rem auto",
              fontSize: "1.05rem",
              animation: "slide-up 1s ease 0.6s forwards",
              opacity: 0,
            }}
          >
            RITHMOS partners aren&apos;t sponsors who get a logo on a banner.
            They&apos;re brands that become part of the story — woven into the
            experience, the content, and the memory of the night.
          </p>
          <div
            style={{
              animation: "slide-up 1s ease 0.9s forwards",
              opacity: 0,
            }}
          >
            <Link href="/contact" className="btn-primary" style={{ background: "var(--gold)" }}>
              Partner With RITHMOS →
            </Link>
          </div>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── WHY PARTNER ─────────────────────────────────────────────────── */}
      <section
        className="benefits-section"
        style={{ padding: "8rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}
      >
        <p className="label-caps" style={{ marginBottom: "1rem", color: "var(--gold)" }}>
          Why Partner
        </p>
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--bone)", marginBottom: "4rem" }}
        >
          The RITHMOS <span style={{ color: "var(--gold)" }}>Advantage</span>
        </h2>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}
          className="benefits-grid"
        >
          {benefits.map((b) => (
            <div
              key={b.title}
              className="card-stage benefit-card"
              style={{
                padding: "2.5rem",
                borderColor: "rgba(201,146,42,0.1)",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(201,146,42,0.4)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(201,146,42,0.1)")}
            >
              <p style={{ fontSize: "1.5rem", color: "var(--gold)", marginBottom: "1rem" }}>{b.icon}</p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  color: "var(--bone)",
                  marginBottom: "0.75rem",
                }}
              >
                {b.title}
              </h3>
              <p className="body-copy" style={{ fontSize: "0.95rem" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── PARTNERSHIP TIERS ────────────────────────────────────────────── */}
      <section
        className="tiers-section"
        style={{
          padding: "8rem 2.5rem",
          background: "#F8F9FA",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p className="label-caps" style={{ marginBottom: "1rem", color: "var(--gold)" }}>
            Packages
          </p>
          <h2
            className="display-section"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--bone)", marginBottom: "4rem" }}
          >
            Partnership <span style={{ color: "var(--gold)" }}>Tiers</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {partnerTiers.map((tier, i) => (
              <div
                key={tier.tier}
                className="tier-card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr auto",
                  gap: "3rem",
                  padding: "2.5rem",
                  background: "#FFFFFF",
                  border: `1px solid ${tier.borderColor}`,
                  borderRadius: "10px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  alignItems: "start",
                }}
              >
                {/* Left: tier info */}
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: "0.7rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: tier.color,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Tier {i + 1}
                  </p>
                  <h3
                    className="display-section"
                    style={{ fontSize: "1.5rem", color: tier.color }}
                  >
                    {tier.tier}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginTop: "0.5rem",
                    }}
                  >
                    {tier.spots}
                  </p>
                </div>

                {/* Middle: description + logo wall */}
                <div>
                  <p className="body-copy" style={{ marginBottom: "1.5rem" }}>{tier.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    {tier.partners.map((p) => (
                      <div
                        key={p}
                        style={{
                          padding: "0.6rem 1.2rem",
                          background: "#F8F9FA",
                          border: `1px solid var(--border)`,
                          borderRadius: "4px",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          opacity: p.startsWith("Your") || p.startsWith("Stage") || p.startsWith("Partner")
                            ? 0.4
                            : 1,
                        }}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: CTA */}
                <div>
                  <Link
                    href="/contact"
                    style={{
                      display: "inline-block",
                      padding: "0.75rem 1.5rem",
                      border: `1px solid ${tier.color}`,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: tier.color,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "background 0.3s ease, color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = tier.color;
                      (e.currentTarget as HTMLElement).style.color = "var(--bg)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = tier.color;
                    }}
                  >
                    Enquire →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 2.5rem",
          textAlign: "center",
          background: "var(--bg)",
          borderTop: "1px solid rgba(201,146,42,0.15)",
        }}
      >
        <p className="label-caps" style={{ marginBottom: "1.5rem", color: "var(--gold)" }}>
          Let&apos;s Talk
        </p>
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--bone)", marginBottom: "1.5rem" }}
        >
          Ready to be Part of <span style={{ color: "var(--gold)" }}>the Night?</span>
        </h2>
        <p className="body-copy" style={{ maxWidth: "440px", margin: "0 auto 2.5rem" }}>
          Send us a message and we&apos;ll share the full RITHMOS Season One
          Partnership Deck within 24 hours.
        </p>
        <Link href="/contact" className="btn-primary" style={{ background: "var(--gold)" }}>
          Get the Partnership Deck →
        </Link>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .tier-card { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .benefits-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .tier-card { padding: 1.25rem !important; }
          .tiers-section { padding: 3.5rem 1.25rem !important; }
        }
      `}</style>
    </>
  );
}
