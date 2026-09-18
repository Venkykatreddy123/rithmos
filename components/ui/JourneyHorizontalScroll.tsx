"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

interface StageData {
  id: string;
  number: string;
  title: string;
  tagline: string;
  venue: string;
  dates: string;
  image: string;
  accentColor: string;
  metrics: {
    bands: string;
    crowd: string;
    soundPressure: string;
    broadcast: string;
  };
  details: string[];
  techSpec: string;
  evaluation: { label: string; pct: number }[];
  prizesOrPerks: string[];
  cta: string;
  ctaLink: string;
}

const stages: StageData[] = [
  {
    id: "stage-1",
    number: "01",
    title: "The Rehearsal Underground",
    tagline: "Where Raw Passion Meets Relentless Discipline",
    venue: "Acoustic Vaults & Sonic Lab Studios, Jubilee Hills",
    dates: "October 12 – October 24, 2026",
    image: "/images/rehearsal.jpg",
    accentColor: "#E61438",
    metrics: {
      bands: "48 Selected Bands",
      crowd: "Jury & Sound Engineers",
      soundPressure: "95 dB(A) Target",
      broadcast: "Multi-Track Studio Stems",
    },
    details: [
      "Every great anthem starts in a sweat-drenched rehearsal studio with tube amplifiers pushed to saturation.",
      "48 shortlisted bands from across India undergo intensive 45-minute multi-track auditions.",
      "Evaluated by veteran FOH audio engineers on harmonic separation, dynamic control, and vocal pitch precision.",
      "Tracked live directly through 24-channel analog preamps with 100% uncompressed zero-tuning policy.",
    ],
    techSpec: "Shure Beta 58A Vocal Array · Marshall JCM800 & JVM410 Half-Stacks · Ampeg SVT-CL Bass Rigs · Yamaha Recording Custom Drumkit",
    evaluation: [
      { label: "Originality & Songwriting", pct: 30 },
      { label: "Rhythm Section Tightness", pct: 25 },
      { label: "Stage Charisma & Dynamic Energy", pct: 25 },
      { label: "Technical Execution & Tone", pct: 20 },
    ],
    prizesOrPerks: [
      "Full multitrack studio stems delivered to every participating band",
      "One-on-one tone feedback session with FOH master engineer",
      "Official RITHMOS Season 01 Competitor Accreditation",
    ],
    cta: "Audition Guidelines",
    ctaLink: "/competition",
  },
  {
    id: "stage-2",
    number: "02",
    title: "The Club Circuit Battle",
    tagline: "The Unforgiving Test of Intimate Live Energy",
    venue: "Heart Cup Coffee (Jubilee Hills) & EXT (Moonshine Project)",
    dates: "November 06 – November 18, 2026",
    image: "/images/club.jpg",
    accentColor: "#E61438",
    metrics: {
      bands: "16 Semi-Finalists",
      crowd: "450+ Live Fans / Night",
      soundPressure: "106 dB(A) Peak",
      broadcast: "4K 60FPS Multi-Cam Live",
    },
    details: [
      "No studio safety nets. Just 450 screaming music fans inches from your stage monitor wedges.",
      "16 qualified bands battle head-to-head across 4 high-octane weekend club nights in Hyderabad.",
      "Each band performs a 35-minute live set featuring at least 2 original anthems and 1 signature reimagining.",
      "Live crowd decibel meter response and real-time QR voting count for 40% of the progression score.",
    ],
    techSpec: "d&b audiotechnik V-Series Line Array · Allen & Heath SQ-7 Digital Console · Sennheiser G4 Wireless IEMs · DMX Strobes & Haze",
    evaluation: [
      { label: "Live Crowd Decibel & Energy Response", pct: 40 },
      { label: "Stage Presence & Audience Command", pct: 30 },
      { label: "Arrangement & Dynamic Flow", pct: 20 },
      { label: "Improvisation & Solo Mastery", pct: 10 },
    ],
    prizesOrPerks: [
      "₹50,000 performance stipend per semi-finalist band",
      "4K professionally color-graded live concert video of your performance",
      "National media feature on Rolling Stone India Indie Radar",
    ],
    cta: "Book Club Passes",
    ctaLink: "/experience",
  },
  {
    id: "stage-3",
    number: "03",
    title: "The Arena Main Stage",
    tagline: "12,000 Screaming Voices. One Unforgettable Night.",
    venue: "Gachibowli Live Music Arena, Hyderabad",
    dates: "December 19, 2026 · 6:00 PM IST",
    image: "/images/hero.jpg",
    accentColor: "#FF3355",
    metrics: {
      bands: "Final 4 Heavyweights",
      crowd: "12,000+ Stadium Scale",
      soundPressure: "118 dB(A) Concert Array",
      broadcast: "Global Streaming Broadcast",
    },
    details: [
      "The massive stadium stage where raw talent turns into national rock folklore.",
      "Top 4 finalist bands perform 45-minute festival headline sets with full concert pyro and lighting rigs.",
      "100ft LED video walls with real-time reactive motion graphics synced to live guitar pickups and drum triggers.",
      "Judged live by 3 iconic Indian rock and metal legends alongside an international record label A&R director.",
    ],
    techSpec: "L-Acoustics K2 Stadium Line Array · DiGiCo SD12 FOH Console · 180kW Subwoofer Array · Robe MegaPointe Light Rig · Pyro CO2 Jets",
    evaluation: [
      { label: "Stadium Command & Crowd Control", pct: 35 },
      { label: "Mastery of Sound & Sonic Impact", pct: 30 },
      { label: "Hit Potential & Songwriting", pct: 25 },
      { label: "Original Identity & X-Factor", pct: 10 },
    ],
    prizesOrPerks: [
      "Live performance before 12,000 screaming concertgoers",
      "Full live multi-track mixed and mastered by Grammy-nominated engineer",
      "National TV and global streaming broadcast reach",
    ],
    cta: "Register Your Band",
    ctaLink: "/contact",
  },
  {
    id: "stage-4",
    number: "04",
    title: "The Champion's Ascent",
    tagline: "One Crown. National Tour. A Career Defined.",
    venue: "Pan-India National Tour & Studio Record Launch",
    dates: "December 20, 2026 – Beyond",
    image: "/images/trophy.jpg",
    accentColor: "#D4A038",
    metrics: {
      bands: "01 Crowned Champion",
      crowd: "Pan-India Reach",
      soundPressure: "₹10L Direct Cash Award",
      broadcast: "3-Track Studio EP",
    },
    details: [
      "Victory at RITHMOS is not just a trophy — it is a permanent launchpad into the national music mainstream.",
      "₹10,00,000 direct cash prize with zero agency commission deductions.",
      "Fully funded 3-track EP recorded and mastered at India's top analog tracking facility.",
      "5-City Pan-India Headline Tour across Bengaluru, Mumbai, Delhi, Pune, and Hyderabad with travel and tech rider covered.",
    ],
    techSpec: "Universal Audio Apollo Studio Rig · Neumann Vintage Mic Locker · Fender Custom Endorsements · Warner/Sony A&R Showcase",
    evaluation: [
      { label: "Cash Grant (₹10,00,000 Direct)", pct: 100 },
      { label: "5-City National Tour Headline", pct: 100 },
      { label: "3-Track Studio Master EP", pct: 100 },
      { label: "Cinematic 4K Music Video", pct: 100 },
    ],
    prizesOrPerks: [
      "₹10,00,000 Direct Cash Prize to the band",
      "5-City Headline Tour with travel & 5-star lodging funded",
      "Full artist management representation & brand endorsement deals",
    ],
    cta: "View Champion Perks",
    ctaLink: "/competition",
  },
];

export default function JourneyHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [cardTab, setCardTab] = useState<Record<number, "details" | "evaluation" | "perks">>({
    0: "details",
    1: "details",
    2: "details",
    3: "details",
  });

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${(track.scrollWidth - window.innerWidth) * 1.25}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              stages.length - 1,
              Math.floor(self.progress * stages.length)
            );
            setActiveIdx(index);
          },
        },
      });

      const cards = track.querySelectorAll(".journey-slide-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.9, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: "left center",
              end: "right center",
              scrub: true,
            },
          }
        );
      });
    });

    mm.add("(max-width: 1023px)", () => {
      const cards = track.querySelectorAll(".journey-slide-card");
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIdx(i),
          onEnterBack: () => setActiveIdx(i),
        });
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  const jumpToStage = (idx: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const card = document.getElementById(`stage-card-${idx}`);
      if (card) {
        const topOffset = card.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
        setActiveIdx(idx);
      }
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const offsetTop = container.offsetTop;
    const totalDist = (trackRef.current?.scrollWidth || 3000) * 1.25;
    const targetY = offsetTop + (idx / (stages.length - 1)) * totalDist;
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, opts?: { duration?: number }) => void } }).lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetY, { duration: 1.0 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="journey-scroll-outer-wrapper" style={{ position: "relative", width: "100%" }}>
      <section
        ref={containerRef}
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "#F8F9FA",
        }}
        id="journey-scroll-section"
      >
      {/* HUD Header Bar */}
      <div
        className="journey-hud-bar"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          padding: "1.25rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 100%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <p className="label-caps" style={{ margin: 0, fontSize: "0.9rem" }}>
            The 4 Stages of Glory
          </p>
          <span className="hud-badge red">
            <span className="live-indicator" /> PINNED SCROLL JOURNEY
          </span>
        </div>

        {/* Interactive Step Jump Buttons */}
        <div className="journey-step-btn-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {stages.map((stage, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={stage.id}
                onClick={() => jumpToStage(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.9rem",
                  background: isActive ? "rgba(230, 20, 56, 0.12)" : "#FFFFFF",
                  border: `1px solid ${isActive ? stage.accentColor : "rgba(0, 0, 0, 0.14)"}`,
                  borderRadius: "4px",
                  color: isActive ? "#E61438" : "var(--muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: isActive ? "0 2px 10px rgba(230,20,56,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: isActive ? stage.accentColor : "var(--muted)" }}>
                  {stage.number}
                </span>
                <span style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {stage.title.split(" ")[1] || stage.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        className="journey-track-container"
        style={{
          display: "flex",
          height: "100%",
          width: "max-content",
          paddingTop: "5.5rem",
          paddingBottom: "2rem",
          paddingLeft: "3rem",
          paddingRight: "6rem",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {stages.map((stage, i) => {
          const currentTab = cardTab[i] || "details";
          const isSelected = i === activeIdx;

          return (
            <div
              key={stage.id}
              id={`stage-card-${i}`}
              className="journey-slide-card"
              style={{
                width: "calc(90vw - 3rem)",
                maxWidth: "1220px",
                minWidth: "820px",
                height: "calc(100vh - 8.5rem)",
                maxHeight: "740px",
                background: "#FFFFFF",
                border: `1px solid ${isSelected ? stage.accentColor : "rgba(0, 0, 0, 0.12)"}`,
                borderRadius: "8px",
                position: "relative",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "1.1fr 1.3fr",
                boxShadow: isSelected
                  ? `0 20px 50px -10px rgba(230, 20, 56, 0.15), 0 10px 25px rgba(0,0,0,0.06)`
                  : "0 12px 35px rgba(0,0,0,0.07)",
                transition: "border-color 0.35s ease, box-shadow 0.35s ease",
              }}
            >
              {/* Left Column: High-Impact Concert Imagery */}
              <div
                className="journey-card-image-col"
                style={{
                  position: "relative",
                  height: "100%",
                  overflow: "hidden",
                  borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <Image
                  src={stage.image}
                  alt={stage.title}
                  fill
                  sizes="(max-width: 1200px) 50vw, 650px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    filter: "contrast(1.18) brightness(0.88)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.6) 100%)",
                  }}
                />

                {/* Big Watermark Number */}
                <p
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1.5rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "7.5rem",
                    lineHeight: 0.8,
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${stage.accentColor}`,
                    opacity: 0.45,
                    userSelect: "none",
                  }}
                >
                  {stage.number}
                </p>

                {/* Overlaid Telemetry Grid */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.5rem",
                    background: "linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.7) 100%)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                      background: "#FFFFFF",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: "6px",
                      padding: "1rem",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div>
                      <span className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                        QUALIFIED COHORT
                      </span>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", margin: "0.15rem 0 0" }}>
                        {stage.metrics.bands}
                      </p>
                    </div>

                    <div>
                      <span className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                        CROWD PRESSURE
                      </span>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: stage.accentColor, margin: "0.15rem 0 0" }}>
                        {stage.metrics.crowd}
                      </p>
                    </div>

                    <div>
                      <span className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                        DECIBEL RATING
                      </span>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", margin: "0.15rem 0 0" }}>
                        {stage.metrics.soundPressure}
                      </p>
                    </div>

                    <div>
                      <span className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                        PRODUCTION LEVEL
                      </span>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "var(--gold)", margin: "0.15rem 0 0" }}>
                        {stage.metrics.broadcast}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Information Data & Breakdown */}
              <div
                className="journey-card-content-col"
                style={{
                  padding: "2.2rem 2.5rem",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#FFFFFF",
                }}
              >
                <div>
                  {/* Top Phase Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        color: stage.accentColor,
                        textTransform: "uppercase",
                      }}
                    >
                      STAGE {stage.number} // {stage.dates}
                    </span>
                    <span className="hud-badge">
                      📍 {stage.venue.split(",")[0]}
                    </span>
                  </div>

                  <h3
                    className="display-section"
                    style={{
                      fontSize: "clamp(2rem, 3.4vw, 3rem)",
                      color: "#0F1115",
                      marginBottom: "0.3rem",
                      lineHeight: 0.95,
                    }}
                  >
                    {stage.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: stage.accentColor,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "1.25rem",
                    }}
                  >
                    &ldquo;{stage.tagline}&rdquo;
                  </p>

                  {/* Sub-Tabs: Details / Evaluation / Perks */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                      paddingBottom: "0.6rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {(["details", "evaluation", "perks"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCardTab((prev) => ({ ...prev, [i]: tab }))}
                        style={{
                          padding: "0.4rem 0.85rem",
                          background: currentTab === tab ? "rgba(230, 20, 56, 0.12)" : "#F8F9FA",
                          border: `1px solid ${currentTab === tab ? "var(--red)" : "rgba(0,0,0,0.08)"}`,
                          color: currentTab === tab ? "var(--red)" : "var(--muted)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {tab === "details" ? "Overview" : tab === "evaluation" ? "Scoring Criteria" : "Perks & Prizes"}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Overview */}
                  {currentTab === "details" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.25rem" }}>
                      {stage.details.map((detail, dIdx) => (
                        <div key={dIdx} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                          <span style={{ color: stage.accentColor, fontSize: "0.9rem", lineHeight: "1.6" }}>
                            ◆
                          </span>
                          <p className="body-copy" style={{ fontSize: "0.92rem", lineHeight: 1.6, margin: 0, color: "#2D3139" }}>
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 2: Scoring Criteria */}
                  {currentTab === "evaluation" && (
                    <div
                      style={{
                        background: "#F8F9FA",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: "6px",
                        padding: "1.1rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <p className="mono-telemetry" style={{ fontSize: "0.68rem", color: stage.accentColor, marginBottom: "0.75rem" }}>
                        OFFICIAL JURY SCORING BREAKDOWN
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                        {stage.evaluation.map((crit, cIdx) => (
                          <div key={cIdx}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                              <span style={{ fontSize: "0.76rem", color: "#0F1115", fontFamily: "var(--font-body)", fontWeight: 500 }}>
                                {crit.label}
                              </span>
                              <span style={{ fontSize: "0.76rem", color: stage.accentColor, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                                {crit.pct}%
                              </span>
                            </div>
                            <div style={{ height: "5px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                              <div
                                style={{
                                  height: "100%",
                                  width: `${crit.pct}%`,
                                  background: stage.accentColor,
                                  borderRadius: "3px",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Perks */}
                  {currentTab === "perks" && (
                    <div
                      style={{
                        background: "#F8F9FA",
                        border: "1px solid rgba(184, 134, 11, 0.25)",
                        borderRadius: "6px",
                        padding: "1.1rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <p className="mono-telemetry" style={{ fontSize: "0.68rem", color: "var(--gold)", marginBottom: "0.6rem" }}>
                        STAGE ACCREDITATIONS & ADVANCEMENT PACKAGE
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {stage.prizesOrPerks.map((perk, pIdx) => (
                          <p key={pIdx} style={{ fontSize: "0.85rem", color: "#0F1115", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ color: "var(--gold)" }}>★</span> {perk}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Backline Spec Bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      background: "rgba(230, 20, 56, 0.06)",
                      border: "1px solid rgba(230, 20, 56, 0.2)",
                      borderRadius: "4px",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>🎛️</span>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#0F1115", margin: 0 }}>
                      <strong style={{ color: "var(--red)" }}>STAGE BACKLINE RIDER:</strong> {stage.techSpec}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.85rem", borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}>
                  <span className="mono-telemetry" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                    HYDERABAD · 2026
                  </span>
                  <Link
                    href={stage.ctaLink}
                    className="btn-primary"
                    style={{
                      padding: "0.75rem 1.6rem",
                      fontSize: "0.95rem",
                      background: i === 3 ? "linear-gradient(135deg, var(--gold) 0%, #8A6216 100%)" : undefined,
                    }}
                  >
                    {stage.cta} →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>

    <style>{`
      @media (max-width: 1023px) {
        #journey-scroll-section {
          height: auto !important;
          overflow: visible !important;
          padding-top: 5rem !important;
          padding-bottom: 3.5rem !important;
        }
        .journey-hud-bar {
          position: sticky !important;
          top: 56px !important;
          padding: 0.75rem 1rem !important;
          z-index: 40 !important;
        }
        .journey-step-btn-group {
          overflow-x: auto !important;
          width: 100% !important;
          padding-bottom: 4px !important;
          -webkit-overflow-scrolling: touch;
        }
        .journey-track-container {
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          padding: 1.5rem 1rem !important;
          gap: 2.5rem !important;
          transform: none !important;
        }
        .journey-slide-card {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          height: auto !important;
          max-height: none !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .journey-card-image-col {
          height: 250px !important;
          min-height: 250px !important;
          width: 100% !important;
          border-right: none !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        }
        .journey-card-content-col {
          padding: 1.25rem !important;
        }
      }
    `}</style>
  </div>
  );
}
