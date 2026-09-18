"use client";

import { useRef, useEffect, useLayoutEffect, Suspense, lazy } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveformDivider from "@/components/ui/WaveformDivider";
import JourneyHorizontalScroll from "@/components/ui/JourneyHorizontalScroll";
import BandShowcaseSection from "@/components/ui/BandShowcaseSection";
import VenueMatrixSection from "@/components/ui/VenueMatrixSection";
import PlaylistWidget from "@/components/ui/PlaylistWidget";
import HeroCinematicBackground from "@/components/ui/HeroCinematicBackground";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HeroCanvas = lazy(() => import("@/components/three/HeroCanvas"));

gsap.registerPlugin(ScrollTrigger);

const keyStats = [
  { num: "48+", label: "Bands Auditioned", detail: "Pan-India talent scouted across 12 cities" },
  { num: "12K+", label: "Live Arena Crowd", detail: "Gachibowli Stadium grand finale capacity" },
  { num: "₹25L", label: "Prize & Career Fund", detail: "₹10L cash + studio record deal + 5-city tour" },
  { num: "04", label: "Iconic Stages", detail: "From underground clubs to mega arenas" },
];

const rulesFAQ = [
  {
    q: "Who is eligible to register for Season 01?",
    a: "Any live band with 2 or more members based in India. All genres are welcomed (Rock, Metal, Fusion, Carnatic, Indie Pop, Jazz, Electronic/Hybrid). At least 60% of the audition set must be original compositions.",
  },
  {
    q: "What gear is provided at each stage?",
    a: "RITHMOS provides a full world-class backline: Marshall JCM800/JVM410 guitar stacks, Ampeg SVT-CL bass rigs, DW Collector's drum kits, and Shure/Sennheiser vocal microphones. Bands only bring guitars, cymbals, snare, pedals, and custom synths.",
  },
  {
    q: "Who owns the master recordings & broadcast rights?",
    a: "Artists retain 100% of their publishing and original copyright. RITHMOS receives non-exclusive promotional broadcast rights for the Season 1 docuseries and live concert streams.",
  },
  {
    q: "How does the voting & judging work?",
    a: "Auditions & Club rounds are scored by an expert panel of audio engineers, music directors, and rock veterans. The Arena Finale incorporates real-time crowd decibel meter response (40%) and jury scoring (60%).",
  },
];

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    // Scroll progress tracker for WebGL 3D sync
    const handleScroll = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      if (totalH > 0) {
        scrollProgressRef.current = window.scrollY / totalH;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!mainRef.current) return;
    // Scoped GSAP animations across home page
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(
        "#hero-hud-badge",
        { opacity: 0, y: -20, duration: 0.8, delay: 0.1 }
      )
        .from(
          headlineRef.current,
          { opacity: 0, y: 50, scale: 0.96, duration: 1.1 },
          "-=0.4"
        )
        .from(
          subRef.current,
          { opacity: 0, y: 25, duration: 0.9 },
          "-=0.6"
        )
        .from(
          "#hero-cta-group",
          { opacity: 0, y: 25, duration: 0.85 },
          "-=0.5"
        );

      // Parallax on stats cards
      gsap.from(".stat-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: "#stats-section",
          start: "top 85%",
        },
      });

      // Parallax on philosophy image
      gsap.to("#philosophy-img", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: "#philosophy-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, mainRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={mainRef} style={{ position: "relative", minHeight: "100vh" }}>
      {/* ─── FULL HOME PAGE PERSISTENT CINEMATIC VIDEO BACKGROUND ────────── */}
      <HeroCinematicBackground isFullPage={true} />

      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: "5.5rem",
          paddingBottom: "3rem",
        }}
      >
        {/* 3D WebGL Canvas Layer (Ambient Stage Beams & Particles) */}
        <Suspense fallback={null}>
          <HeroCanvas scrollProgress={scrollProgressRef} />
        </Suspense>

        {/* Hero Content Overlay */}
        <div
          className="hero-content-wrapper"
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 1.5rem",
            width: "100%",
          }}
        >
          {/* Season Badge */}
          <div
            id="hero-hud-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.1rem",
                background: "rgba(230, 20, 56, 0.15)",
                border: "1px solid rgba(230, 20, 56, 0.35)",
                borderRadius: "100px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#FFFFFF",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="live-indicator" /> SEASON ONE · HYDERABAD 2026
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1.1rem",
                background: "rgba(184, 134, 11, 0.12)",
                border: "1px solid rgba(184, 134, 11, 0.3)",
                borderRadius: "100px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(12px)",
              }}
            >
              🏆 ₹25,00,000 CAREER LAUNCHPAD
            </span>
          </div>

          {/* Main Display Headline — White on dark video for maximum clarity */}
          <h1
            ref={headlineRef}
            style={{
              fontSize: "clamp(3rem, 9vw, 8rem)",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontStyle: "italic",
              textTransform: "uppercase",
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              lineHeight: 0.92,
              textShadow: "0 4px 30px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3)",
              margin: 0,
            }}
          >
            Every Band<br />
            <span
              style={{
                color: "#FF2A55",
                textShadow: "0 0 40px rgba(230, 20, 56, 0.6), 0 4px 20px rgba(0, 0, 0, 0.4)",
                display: "inline-block",
              }}
            >
              Has a Story
            </span>
          </h1>

          <p
            ref={subRef}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1rem, 3vw, 2.2rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.85)",
              marginTop: "1.5rem",
              textShadow: "0 2px 15px rgba(0, 0, 0, 0.4)",
            }}
          >
            Every Story Needs a Stage
          </p>

          {/* CTAs */}
          <div
            id="hero-cta-group"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "2.8rem",
              marginBottom: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/contact"
              className="btn-primary"
              style={{
                padding: "1rem 2.6rem",
                borderRadius: "6px",
                fontSize: "1rem",
              }}
            >
              Register Your Band →
            </Link>
            <Link
              href="/competition"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem 2.6rem",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "#FFFFFF",
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(16px)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Explore The 4 Stages
            </Link>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            SCROLL TO EXPLORE
          </span>
          <div
            style={{
              width: "1px",
              height: "32px",
              background: "linear-gradient(to bottom, rgba(230, 20, 56, 0.7), transparent)",
              animation: "float 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ─── WAVEFORM DIVIDER ─────────────────────────────────────────────── */}
      <WaveformDivider />

      {/* ─── STATS & TELEMETRY BAR ────────────────────────────────────────── */}
      <section
        id="stats-section"
        style={{
          padding: "5rem 2.5rem",
          maxWidth: "1380px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
          className="stats-grid"
        >
          {keyStats.map((stat, i) => (
            <div
              key={i}
              className="card-stage stat-card"
              style={{
                padding: "2rem 1.75rem",
                textAlign: "left",
                background: "#FFFFFF",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderLeft: i === 2 ? "4px solid var(--gold)" : "4px solid var(--red)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span className="mono-telemetry" style={{ fontSize: "0.7rem", color: "#4B5563", fontWeight: 700 }}>
                  METRIC // 0{i + 1}
                </span>
                <span className="live-indicator" style={{ background: i === 2 ? "var(--gold)" : "var(--red)" }} />
              </div>

              <p className="stat-number" style={{ fontSize: "clamp(2.8rem, 4.5vw, 4.2rem)", margin: "0.25rem 0" }}>
                {stat.num}
              </p>

              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "#0F1115",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 0.4rem 0",
                }}
              >
                {stat.label}
              </h4>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#374151", margin: 0, lineHeight: 1.55 }}>
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NARRATIVE / PHILOSOPHY SECTION WITH HIGH CONTRAST IMAGERY ────── */}
      <section
        id="philosophy-section"
        style={{
          padding: "8rem 2.5rem",
          maxWidth: "1380px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Left: Manifesto Copy */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem" }}>
              <span className="hud-badge red">THE RITHMOS MANIFESTO</span>
              <span className="mono-telemetry" style={{ color: "#374151", fontWeight: 700 }}>WHY WE EXIST</span>
            </div>

            <h2
              className="display-section"
              style={{
                fontSize: "clamp(2.6rem, 5vw, 4.4rem)",
                color: "var(--bone)",
                marginBottom: "1.5rem",
              }}
            >
              Music is Alive.<br />
              <span style={{ color: "var(--red)" }}>Bands Make It Dangerous.</span>
            </h2>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "var(--bone)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
                lineHeight: 1.4,
              }}
            >
              In a world of pre-programmed tracks and solo streaming playlists, the raw thunder of four musicians locking into a relentless groove is the most powerful force in modern culture.
            </p>

            <p className="body-copy" style={{ marginBottom: "1.25rem" }}>
              Hyderabad has the hunger, the musicianship, and the legendary underground culture. But great bands have lacked a stadium-scale property to turn raw potential into national stardom. RITHMOS is that stage — an uncompromised live music competition built from the ground up to crown the next definitive rock and fusion heavyweights.
            </p>

            <p className="body-copy" style={{ marginBottom: "2.5rem" }}>
              From sweat-drenched jam pad auditions to the 12,000-capacity Gachibowli Live Arena with L-Acoustics stadium line arrays, RITHMOS gives artists the production, the mentorship, and the unbridled spotlight they deserve.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/about" className="btn-primary">
                Read The Full Story →
              </Link>
              <Link href="/partners" className="btn-outline">
                Sponsor The Movement
              </Link>
            </div>
          </div>

          {/* Right: Layered High-Res Image Composition with Parallax */}
          <div style={{ position: "relative" }}>
            <div
              className="card-stage philosophy-image-container"
              style={{
                position: "relative",
                height: "520px",
                borderRadius: "6px",
                border: "1px solid rgba(200, 16, 46, 0.4)",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(200, 16, 46, 0.25)",
              }}
            >
              <Image
                id="philosophy-img"
                src="/images/audience.jpg"
                alt="Concert Crowd Energy"
                fill
                sizes="(max-width: 900px) 100vw, 600px"
                style={{
                  objectFit: "cover",
                  filter: "contrast(1.2) brightness(0.85)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.1) 40%, rgba(230,20,56,0.15) 100%)",
                }}
              />

              {/* Float Card Info Badge */}
              <div
                className="philosophy-badge-float"
                style={{
                  position: "absolute",
                  bottom: "2rem",
                  left: "2rem",
                  right: "2rem",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderRadius: "6px",
                  padding: "1.25rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span className="mono-telemetry" style={{ color: "var(--red)" }}>
                    LIVE AUDIENCE ENGAGEMENT
                  </span>
                  <span className="hud-badge gold">100% UNEDITED</span>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--bone)", margin: 0 }}>
                  &ldquo;A stage big enough to match the ambition of our sound.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PINNED HORIZONTAL JOURNEY SECTION ────────────────────────────── */}
      <JourneyHorizontalScroll />

      {/* ─── BAND STORIES & DOSSIER SECTION ───────────────────────────────── */}
      <BandShowcaseSection />

      {/* ─── THE FOUR SACRED VENUES MATRIX ────────────────────────────────── */}
      <VenueMatrixSection />

      {/* ─── COMPETITION RULES & FAQ ──────────────────────────────────────── */}
      <section
        style={{
          padding: "8rem 2.5rem",
          maxWidth: "1380px",
          margin: "0 auto",
        }}
        id="rules-faq-section"
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.6rem" }}>
            <span className="hud-badge red">RULES & EVALUATION CRITERIA</span>
            <span className="mono-telemetry">SEASON 01 SPECIFICATIONS</span>
          </div>
          <h2
            className="display-section"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: "var(--bone)",
            }}
          >
            Everything You Need <span style={{ color: "var(--red)" }}>To Know</span>
          </h2>
          <p className="body-copy" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>
            Transparent rules, artist-first copyright protection, and professional touring backlines provided for every competitor.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
          className="faq-grid"
        >
          {rulesFAQ.map((faq, i) => (
            <div
              key={i}
              className="card-stage"
              style={{
                padding: "2.2rem",
                background: "#FFFFFF",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.8rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: "var(--red)",
                  }}
                >
                  0{i + 1} //
                </span>
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    color: "var(--bone)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    margin: 0,
                  }}
                >
                  {faq.q}
                </h4>
              </div>

              <p className="body-copy" style={{ fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CINEMATIC CALL TO ACTION ───────────────────────────────── */}
      <section
        className="final-cta-section"
        style={{
          position: "relative",
          padding: "10rem 2.5rem",
          overflow: "hidden",
          textAlign: "center",
          background: "#FFFFFF",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/trophy.jpg"
            alt="RITHMOS Grand Trophy"
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center 40%",
              filter: "brightness(0.95) contrast(1.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 50%, rgba(200, 16, 46, 0.1) 0%, rgba(255,255,255,0.85) 55%, #FFFFFF 95%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
            <span className="hud-badge gold">
              <span className="live-indicator" style={{ background: "var(--gold)" }} /> REGISTRATIONS CLOSING SOON
            </span>
          </div>

          <h2
            className="display-hero"
            style={{
              fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
              color: "var(--bone)",
              marginBottom: "1.5rem",
              lineHeight: 0.9,
            }}
          >
            Your Band&apos;s<br />
            <span style={{ color: "var(--red)" }}>Stage Awaits</span>
          </h2>

          <p
            className="body-copy"
            style={{
              maxWidth: "520px",
              margin: "0 auto 3rem",
              fontSize: "1.05rem",
            }}
          >
            Audition slots for Season One in Hyderabad are limited to 48 bands. The stage is set, the soundboards are calibrated, and the legacy is yours to claim.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/contact" className="btn-primary animate-red-pulse">
              Register Your Band Now (Free) →
            </Link>
            <Link href="/competition" className="btn-outline">
              Review Audition Guidelines
            </Link>
          </div>
        </div>
      </section>

      <PlaylistWidget />

      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .faq-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          #stats-section, #philosophy-section, #rules-faq-section {
            padding: 3.5rem 1.25rem !important;
          }
          .hero-content-wrapper {
            padding: 0 1rem !important;
          }
          #hero-cta-group {
            margin-top: 1.8rem !important;
            margin-bottom: 2rem !important;
            gap: 0.85rem !important;
          }
          #hero-cta-group a {
            width: 100% !important;
            max-width: 320px !important;
            padding: 0.85rem 1.5rem !important;
            text-align: center !important;
          }
          .philosophy-image-container {
            height: 360px !important;
          }
          .philosophy-badge-float {
            bottom: 1rem !important;
            left: 1rem !important;
            right: 1rem !important;
            padding: 0.85rem !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .final-cta-section {
            padding: 4.5rem 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
