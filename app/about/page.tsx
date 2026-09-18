"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveformDivider from "@/components/ui/WaveformDivider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    year: "The Vision",
    title: "Born from Frustration",
    body: "Hyderabad's music scene had the talent. What it lacked was a platform that treated bands — and audiences — with the seriousness live music deserves. RITHMOS was built to fix that.",
  },
  {
    year: "The Beginning",
    title: "One Stage. One Night.",
    body: "Season Zero was proof of concept. A single venue, 8 bands, 600 people. The energy in that room told us everything we needed to know. This wasn't a competition — it was a movement.",
  },
  {
    year: "The Ambition",
    title: "Four Stages Across a City",
    body: "Season One scales the vision: a multi-venue, multi-stage journey that takes bands from intimate rehearsal rooms to the biggest stage Hyderabad's independent music scene has seen.",
  },
];

const values = [
  {
    icon: "♦",
    title: "Bands First",
    desc: "Every decision — production, lighting, sound, scheduling — is made with the performing band in mind. Not the sponsor. Not the venue. The band.",
  },
  {
    icon: "♦",
    title: "Real Audiences",
    desc: "We curate audiences who actually want to be there. No forced attendance, no reluctant crowd. Just people who love live music and want to discover new bands.",
  },
  {
    icon: "♦",
    title: "Cinematic Production",
    desc: "Every stage is lit, mixed and documented to a standard the bands can be proud of. The highlight reel from RITHMOS should look like a music video, not a phone recording.",
  },
  {
    icon: "♦",
    title: "A Story to Tell",
    desc: "We document the journey — rehearsals, soundchecks, backstage, the set. Bands leave RITHMOS with content, a story, and an audience they didn't have before.",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered timeline reveals
      gsap.fromTo(
        ".timeline-item",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: { trigger: ".timeline-section", start: "top 70%" },
        }
      );

      // Values reveal
      gsap.fromTo(
        ".value-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: ".values-section", start: "top 70%" },
        }
      );

      // Hyderabad reveal
      gsap.fromTo(
        ".hyderabad-reveal",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hyderabad-section", start: "top 60%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── PAGE HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          paddingTop: "140px",
          paddingBottom: "8rem",
          overflow: "hidden",
          background: "var(--bg)",
        }}
      >
        {/* Background guitar image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/guitar.jpg"
            alt=""
            fill
            style={{ objectFit: "cover", opacity: 0.12, filter: "saturate(0.4)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, var(--bg) 0%, transparent 40%, var(--bg) 90%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 2.5rem",
            textAlign: "center",
          }}
        >
          <p
            className="label-caps"
            style={{ marginBottom: "2rem", animation: "fade-in 0.8s ease forwards" }}
          >
            ⸺ About RITHMOS ⸺
          </p>
          <h1
            className="display-hero"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              color: "var(--bone)",
              animation: "slide-up 1s ease 0.2s forwards",
              opacity: 0,
            }}
          >
            We Give Bands a<br />
            <span style={{ color: "var(--red)" }}>Stage They Deserve</span>
          </h1>
          <p
            className="body-copy"
            style={{
              maxWidth: "560px",
              margin: "2.5rem auto 0",
              fontSize: "1.1rem",
              animation: "slide-up 1s ease 0.5s forwards",
              opacity: 0,
            }}
          >
            RITHMOS is a live music property — not an event, not a platform, not a
            competition in the usual sense. It&apos;s a stage built with intention, for
            bands who are ready to be heard.
          </p>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── ORIGIN TIMELINE ─────────────────────────────────────────────── */}
      <section
        className="timeline-section"
        style={{
          padding: "8rem 2.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <p className="label-caps" style={{ marginBottom: "1rem" }}>The Origin Story</p>
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--bone)", marginBottom: "5rem" }}
        >
          How <span style={{ color: "var(--red)" }}>RITHMOS</span> Was Built
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {timeline.map((item, i) => (
            <div
              key={item.year}
              className="timeline-item"
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "3rem",
                paddingBottom: "4rem",
                paddingTop: "4rem",
                borderBottom: i < timeline.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "start",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--red)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.year}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: "5rem",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(0,0,0,0.12)",
                    lineHeight: 1,
                  }}
                >
                  0{i + 1}
                </p>
              </div>
              <div>
                <h3
                  className="display-section"
                  style={{ fontSize: "2.2rem", color: "var(--bone)", marginBottom: "1.25rem" }}
                >
                  {item.title}
                </h3>
                <p className="body-copy" style={{ fontSize: "1.05rem", maxWidth: "560px" }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HYDERABAD SECTION ───────────────────────────────────────────── */}
      <section
        className="hyderabad-section"
        style={{
          position: "relative",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/hyderabad.jpg"
          alt="Hyderabad at night"
          fill
          style={{ objectFit: "cover", opacity: 0.35, filter: "saturate(0.6)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0.6) 100%)",
          }}
        />
        <div
          className="hyderabad-reveal"
          style={{
            position: "relative",
            zIndex: 2,
            padding: "4rem 2.5rem",
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <p className="label-caps" style={{ marginBottom: "1.5rem" }}>The City</p>
          <h2
            className="display-hero"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "var(--bone)", maxWidth: "600px" }}
          >
            Born in <span style={{ color: "var(--red)" }}>Hyderabad</span>
          </h2>
          <p className="body-copy" style={{ maxWidth: "440px", marginTop: "1.5rem", fontSize: "1.05rem" }}>
            Hyderabad has always had a music scene. RITHMOS gives it a stage
            worthy of the talent this city has been quietly producing for years.
          </p>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── VALUES ─────────────────────────────────────────────────────── */}
      <section
        className="values-section"
        style={{
          padding: "8rem 2.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <p className="label-caps" style={{ marginBottom: "1rem" }}>What We Stand For</p>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--bone)",
            marginBottom: "4rem",
          }}
        >
          Our <span style={{ color: "var(--red)" }}>Principles</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
          }}
          className="values-grid"
        >
          {values.map((v) => (
            <div
              key={v.title}
              className="card-stage value-card"
              style={{ padding: "2.5rem" }}
            >
              <p style={{ fontSize: "1.5rem", color: "var(--red)", marginBottom: "1rem" }}>{v.icon}</p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  color: "var(--bone)",
                  marginBottom: "1rem",
                }}
              >
                {v.title}
              </h3>
              <p className="body-copy" style={{ fontSize: "0.95rem" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 2.5rem",
          textAlign: "center",
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p className="label-caps" style={{ marginBottom: "1.5rem" }}>Ready to Rise?</p>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "var(--bone)",
            marginBottom: "2rem",
          }}
        >
          Your Band&apos;s Story Starts <span style={{ color: "var(--red)" }}>Here</span>
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn-primary">Register Your Band →</Link>
          <Link href="/competition" className="btn-outline">The Competition</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .timeline-item { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>
    </>
  );
}
