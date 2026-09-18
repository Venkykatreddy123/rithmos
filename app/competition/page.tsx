"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveformDivider from "@/components/ui/WaveformDivider";
import TournamentBracket from "@/components/ui/TournamentBracket";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    num: "01",
    title: "The Rehearsal Room",
    subtitle: "Preliminary Digital Auditions",
    desc: "Submit your raw multitrack or live studio take. Real-time PCM waveform analysis checks dynamic range, pitch fidelity, and arrangement.",
    details: [
      "Open auditions via direct audio/video dropzone",
      "Judged on originality, rhythmic tightness & vocal delivery",
      "32 bands selected for Stage 2 (Club Heats)",
      "Detailed sonic feedback given to every applicant",
    ],
    img: "/images/rehearsal.jpg",
    color: "var(--muted)",
    accentColor: "#6B6B6B",
  },
  {
    num: "02",
    title: "The Club Stage",
    subtitle: "Intimate Venue Heats",
    desc: "Four high-energy showcase gigs at EXT / The Moonshine Project, Jubilee Hills. 250 true music fanatics per night. No backing tracks.",
    details: [
      "4 showcase nights across Jubilee Hills & Secunderabad",
      "Professional FOH engineer & backline provided",
      "Live crowd voting + weighted jury scorecards",
      "16 bands advance to the Hyderabad Knockout Bracket",
    ],
    img: "/images/club.jpg",
    color: "var(--red)",
    accentColor: "#C8102E",
  },
  {
    num: "03",
    title: "The Arena Stage",
    subtitle: "Hitex Amphitheater Semifinals",
    desc: "Open-air festival production with 2,500+ attendees. High-power line arrays, custom stage lighting, and multitrack broadcast streaming.",
    details: [
      "2-Day Open Air Festival at Hitex Arena, Madhapur",
      "Full digital soundboard recording & 4K broadcast",
      "Head-to-head live knockout battle format",
      "4 finalists advance to the Grand Finale",
    ],
    img: "/images/hero.jpg",
    color: "var(--bone)",
    accentColor: "#E61438",
  },
  {
    num: "04",
    title: "The Grand Finale",
    subtitle: "Shilpakala Vedika / Gachibowli",
    desc: "The ultimate showdown in front of 5,000 fans, label A&Rs, and national music critics for the championship trophy and ₹5,00,000 prize pool.",
    details: [
      "Headline 30-minute original set per finalist",
      "National record label A&R scouts present",
      "Awarding of the RITHMOS Champion Trophy",
      "Roland/Boss endorsement deals & studio EP contract",
    ],
    img: "/images/trophy.jpg",
    color: "var(--gold)",
    accentColor: "#C9922A",
  },
];

const scoringRubric = [
  {
    category: "Musicianship & Tightness",
    weight: "30%",
    color: "var(--red)",
    desc: "Rhythm section pocket, tempo consistency, guitar/keyboard execution, and pitch precision on lead & backing harmonies.",
  },
  {
    category: "Originality & Songwriting",
    weight: "30%",
    color: "var(--gold)",
    desc: "Chord progression freshness, structural dynamics, hook strength, lyrical depth, and authentic musical identity.",
  },
  {
    category: "Stage Presence & Synergy",
    weight: "25%",
    color: "#38BDF8",
    desc: "Band chemistry, commanding crowd engagement, live energy projection, and visual aesthetic on stage.",
  },
  {
    category: "Sonic Mix & Tone Quality",
    weight: "15%",
    color: "#A855F7",
    desc: "Amplifier tone dialing, dynamic range control, instrument separation, and master FOH sound balance.",
  },
];

const venues = [
  {
    name: "EXT @ The Moonshine Project",
    area: "Jubilee Hills, Road No. 36",
    phase: "Stage 02 • Club Heats",
    capacity: "250 Capacity",
    acoustics: "Intimate acoustic treated room, punchy low-end club PA, zero latency stage monitors.",
  },
  {
    name: "Hitex Open-Air Amphitheater",
    area: "HITEC City / Madhapur",
    phase: "Stage 03 • Semifinals",
    capacity: "2,500 Capacity",
    acoustics: "High-throw line array dispersion, natural reverberant outdoor soundstage.",
  },
  {
    name: "Shilpakala Vedika Auditorium",
    area: "Hitech City Main Rd",
    phase: "Stage 04 • Grand Finale",
    capacity: "5,000+ Capacity",
    acoustics: "State-of-the-art concert hall acoustics with 48-channel digital mixing consoles.",
  },
];

const prizes = [
  {
    tier: "🏆 GRAND CHAMPION",
    amount: "₹3,00,000",
    color: "var(--gold)",
    perks: [
      "Full 5-Track EP Production & Mastering at top Mumbai/Hyderabad Studio",
      "Roland & Boss Official Gear Endorsement Package",
      "Headline Slot at Next Season Festival Tour",
      "Global Distribution deal via partner indie label",
    ],
  },
  {
    tier: "🥈 RUNNER-UP",
    amount: "₹1,50,000",
    color: "var(--bone)",
    perks: [
      "Professional 2-Track Single Recording & Mixing session",
      "Custom Pedalboard / Audio Interface voucher pack",
      "Featured slot on the RITHMOS Season 01 Official Vinyl & Compilation",
    ],
  },
  {
    tier: "🎖️ BEST INDIVIDUAL PLAYERS",
    amount: "₹50,000 each",
    color: "var(--red)",
    perks: [
      "Best Shredder (Lead Guitarist of the Tournament)",
      "Pocket Master (Best Bassist / Drummer combo)",
      "Best Frontperson (Vocalist & Lyricist of the Year)",
    ],
  },
];

const judges = [
  { name: "Arjun Nair", role: "Music Director & Producer", genre: "Prog Rock / Metal", badge: "A&R Head" },
  { name: "Priya Venkat", role: "Artist Manager, SoundWave", genre: "Indie / Alternative", badge: "Label Scout" },
  { name: "Rahul Krishnamurthy", role: "Founder, NAYA Records", genre: "Fusion / Indie", badge: "Studio Engineer" },
  { name: "Deepa Srinivas", role: "Senior Music Critic & Journalist", genre: "Cross-Genre", badge: "Festival Curator" },
];

export default function CompetitionPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stage cards scroll reveal
      gsap.fromTo(
        ".stage-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: ".stages-section", start: "top 75%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          padding: "10rem 2.5rem 6rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <p className="label-caps" style={{ marginBottom: "1.5rem" }}>
          Tournament Structure & Rulebook • Hyderabad 2026
        </p>
        <h1
          className="display-hero"
          style={{
            fontSize: "clamp(3rem, 7vw, 6.5rem)",
            lineHeight: 0.95,
            color: "var(--bone)",
            marginBottom: "2rem",
          }}
        >
          Four Stages.
          <br />
          One <span style={{ color: "var(--red)" }}>Champion.</span>
        </h1>
        <p
          className="body-copy"
          style={{
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            maxWidth: "680px",
            marginBottom: "3rem",
          }}
        >
          From garage rehearsal rooms to Shilpakala Vedika, RITHMOS tests Hyderabad&apos;s best bands across four intense rounds of raw live musicianship.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn-primary">
            Submit Audition Demo →
          </Link>
          <a href="#rubric" className="btn-outline">
            100-Pt Scoring Rubric ↓
          </a>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── 4 COMPETITION STAGES ─────────────────────────────────────────── */}
      <section className="stages-section" style={{ padding: "6rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <p className="label-caps" style={{ marginBottom: "1rem" }}>The Journey</p>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--bone)",
            marginBottom: "4rem",
          }}
        >
          How It <span style={{ color: "var(--red)" }}>Works</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {stages.map((stage, i) => (
            <div
              key={stage.num}
              className="stage-card"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "1px solid var(--border)",
                background: "#FFFFFF",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              }}
            >
              {i % 2 !== 0 && (
                <div style={{ position: "relative", minHeight: "340px" }}>
                  <Image
                    src={stage.img}
                    alt={stage.title}
                    fill
                    style={{ objectFit: "cover", filter: "saturate(0.8)" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 100%)`,
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  padding: "2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  background: "#FFFFFF",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.75rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: "3.5rem",
                      color: "transparent",
                      WebkitTextStroke: `1px ${stage.accentColor}`,
                      opacity: 0.4,
                      lineHeight: 1,
                      margin: 0,
                    }}
                  >
                    {stage.num}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: stage.accentColor,
                      margin: 0,
                    }}
                  >
                    {stage.subtitle}
                  </p>
                </div>

                <h3
                  className="display-section"
                  style={{
                    fontSize: "1.8rem",
                    color: stage.color,
                    marginBottom: "0.75rem",
                  }}
                >
                  {stage.title}
                </h3>
                <p className="body-copy" style={{ marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  {stage.desc}
                </p>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", padding: 0, margin: 0 }}>
                  {stage.details.map((d) => (
                    <li
                      key={d}
                      className="pick-bullet"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        color: "var(--bone-sub)",
                      }}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {i % 2 === 0 && (
                <div style={{ position: "relative", minHeight: "340px" }}>
                  <Image
                    src={stage.img}
                    alt={stage.title}
                    fill
                    style={{ objectFit: "cover", filter: "saturate(0.8)" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to left, transparent 0%, rgba(255,255,255,0.4) 100%)`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── LIVE TOURNAMENT BRACKET ──────────────────────────────────────── */}
      <section style={{ padding: "4rem 2.5rem 6rem", maxWidth: "1280px", margin: "0 auto", overflow: "hidden" }}>
        <TournamentBracket />
      </section>

      <WaveformDivider />

      {/* ─── 100-POINT WEIGHTED SCORING RUBRIC ─────────────────────────────── */}
      <section id="rubric" style={{ padding: "6rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <p className="label-caps" style={{ marginBottom: "1rem" }}>Evaluation Standard</p>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--bone)",
            marginBottom: "1rem",
          }}
        >
          The 100-Point <span style={{ color: "var(--red)" }}>Scorecard</span>
        </h2>
        <p className="body-copy" style={{ maxWidth: "680px", marginBottom: "3rem" }}>
          Every performance is rigorously scored by our industry panel and calibrated with real-time crowd decibel meters.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {scoringRubric.map((item) => (
            <div
              key={item.category}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "1.8rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.8rem", fontWeight: 800, color: item.color }}>
                    {item.weight}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", textTransform: "uppercase" }}>
                    Weight
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, color: "var(--bone)", marginBottom: "0.75rem" }}>
                  {item.category}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--bone-sub)", lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── HYDERABAD ACOUSTIC VENUES ────────────────────────────────────── */}
      <section style={{ padding: "6rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <p className="label-caps" style={{ marginBottom: "1rem" }}>Tour Map</p>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--bone)",
            marginBottom: "3rem",
          }}
        >
          Hyderabad <span style={{ color: "var(--red)" }}>Acoustic Venues</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {venues.map((v) => (
            <div
              key={v.name}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--red)", background: "rgba(230,20,56,0.08)", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                {v.phase}
              </span>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--bone)", margin: "1rem 0 0.25rem" }}>
                {v.name}
              </h3>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--gold)", margin: "0 0 1rem" }}>
                📍 {v.area} • {v.capacity}
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--bone-sub)", lineHeight: 1.5, margin: 0 }}>
                {v.acoustics}
              </p>
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── PRIZE BREAKDOWN & ENDORSEMENTS ───────────────────────────────── */}
      <section style={{ padding: "6rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <p className="label-caps" style={{ marginBottom: "1rem" }}>Prize Pool</p>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--bone)",
            marginBottom: "3rem",
          }}
        >
          ₹5,00,000 <span style={{ color: "var(--gold)" }}>Prize Breakdown</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {prizes.map((p) => (
            <div
              key={p.tier}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${p.color === "var(--gold)" ? "rgba(184,134,11,0.4)" : "var(--border)"}`,
                borderRadius: "10px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: p.color === "var(--gold)" ? "0 10px 30px rgba(184,134,11,0.12)" : "0 8px 24px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: p.color, fontWeight: 800 }}>
                  {p.tier}
                </span>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "2.2rem", fontWeight: 900, color: p.color, margin: "0.5rem 0 1.5rem" }}>
                  {p.amount}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {p.perks.map((perk) => (
                    <li key={perk} className="pick-bullet" style={{ fontSize: "0.85rem", color: "var(--bone-sub)" }}>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── JUDGES PANEL ─────────────────────────────────────────────────── */}
      <section className="judges-section" style={{ padding: "6rem 2.5rem", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p className="label-caps" style={{ marginBottom: "1rem" }}>The Panel</p>
          <h2
            className="display-section"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "var(--bone)",
              marginBottom: "3rem",
            }}
          >
            Judged by <span style={{ color: "var(--red)" }}>Industry Heavyweights</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {judges.map((judge) => (
              <div key={judge.name} className="card-stage judge-card" style={{ padding: "2rem" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "var(--red)",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 900,
                    fontSize: "1.3rem",
                    color: "#FFFFFF",
                  }}
                >
                  {judge.name[0]}
                </div>
                <span style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: "var(--gold)", background: "rgba(212,160,56,0.15)", padding: "2px 6px", borderRadius: "3px", display: "inline-block", marginBottom: "0.5rem" }}>
                  {judge.badge}
                </span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.1rem", textTransform: "uppercase", color: "var(--bone)", marginBottom: "0.3rem" }}>
                  {judge.name}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--red)", marginBottom: "0.3rem" }}>
                  {judge.role}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", margin: 0 }}>
                  {judge.genre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 2.5rem", textAlign: "center", background: "#F8F9FA", borderTop: "1px solid var(--border)" }}>
        <h2 className="display-section" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", color: "var(--bone)", marginBottom: "1.5rem" }}>
          Ready for the <span style={{ color: "var(--red)" }}>Main Stage?</span>
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn-primary animate-red-pulse">
            Submit Your Band Audition →
          </Link>
          <Link href="/about" className="btn-outline">
            About RITHMOS Lore
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .stage-card { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stages-section { padding: 3.5rem 1.25rem !important; }
        }
      `}</style>
    </>
  );
}
