"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveformDivider from "@/components/ui/WaveformDivider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    title: "Season Zero — Full Show",
    duration: "1:42:30",
    views: "24K",
    thumb: "/images/hero.jpg",
    tag: "Full Show",
  },
  {
    title: "Arid Monsoon — Live at Club Stage",
    duration: "18:20",
    views: "8.4K",
    thumb: "/images/band.jpg",
    tag: "Live Set",
  },
  {
    title: "The Midnight Signal — 'Hollow Light'",
    duration: "4:55",
    views: "15K",
    thumb: "/images/club.jpg",
    tag: "Single",
  },
  {
    title: "Champion Announcement — Season Zero",
    duration: "6:12",
    views: "31K",
    thumb: "/images/trophy.jpg",
    tag: "Moment",
  },
  {
    title: "Behind the Scenes — Rehearsal Week",
    duration: "22:45",
    views: "5.2K",
    thumb: "/images/rehearsal.jpg",
    tag: "Documentary",
  },
  {
    title: "Seventh Echo — RITHMOS Stage",
    duration: "25:10",
    views: "11.7K",
    thumb: "/images/audience.jpg",
    tag: "Live Set",
  },
];

const updates = [
  {
    date: "Sep 14, 2026",
    title: "Season One Registration Now Open",
    excerpt: "Spots are limited. 32 bands will be selected from all submissions. Don't wait.",
    tag: "Announcement",
  },
  {
    date: "Sep 08, 2026",
    title: "Club Stage Venues Confirmed",
    excerpt: "Four iconic Hyderabad venues confirmed for the Club Stage rounds in October and November.",
    tag: "Events",
  },
  {
    date: "Aug 25, 2026",
    title: "Judge Panel Announced",
    excerpt: "Meet the four industry professionals who will judge Season One of RITHMOS.",
    tag: "People",
  },
  {
    date: "Aug 12, 2026",
    title: "RITHMOS Stage Venue Revealed",
    excerpt: "JRC Convention Centre, Hyderabad will host the Season One finale on November 29.",
    tag: "Events",
  },
];

export default function WatchPage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".video-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: ".videos-grid", start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".update-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: ".updates-section", start: "top 75%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "160px 2.5rem 6rem",
          background: "var(--bg)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/band.jpg"
            alt=""
            fill
            style={{ objectFit: "cover", opacity: 0.1, filter: "saturate(0.3)" }}
          />
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, var(--bg) 0%, transparent 40%, var(--bg) 90%)",
            }}
          />
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="label-caps" style={{ marginBottom: "2rem", animation: "fade-in 0.8s ease forwards" }}>
            ⸺ Watch · Connect ⸺
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
            The Music.<br />
            <span style={{ color: "var(--red)" }}>Live & Loud.</span>
          </h1>
          <p
            className="body-copy"
            style={{
              maxWidth: "500px",
              margin: "2rem auto",
              fontSize: "1.05rem",
              animation: "slide-up 1s ease 0.6s forwards",
              opacity: 0,
            }}
          >
            Highlight reels, full shows, band stories, and behind-the-scenes.
            If you weren&apos;t there, this is the next best thing.
          </p>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── FEATURED VIDEO ───────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <p className="label-caps" style={{ marginBottom: "1rem" }}>Featured</p>
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--bone)", marginBottom: "2.5rem" }}
        >
          Season Zero — <span style={{ color: "var(--red)" }}>The Full Night</span>
        </h2>

        {/* Video player frame */}
        <div
          style={{
            position: "relative",
            aspectRatio: "16/9",
            background: "#FFFFFF",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/hero.jpg"
            alt="Season Zero Full Show"
            fill
            style={{ objectFit: "cover", opacity: 0.85, filter: "saturate(0.8)" }}
          />

          {/* Waveform frame decoration */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(to right, transparent, var(--red), transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(to right, transparent, var(--red), transparent)",
            }}
          />

          {/* Play button */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--red)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                boxShadow: "0 0 25px rgba(230,20,56,0.6)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.1)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
            >
              ▶
            </div>
          </div>

          {/* Duration */}
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              padding: "0.3rem 0.75rem",
              background: "rgba(0,0,0,0.75)",
              borderRadius: "4px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              color: "#FFFFFF",
            }}
          >
            1:42:30
          </div>
        </div>
      </section>

      {/* ─── VIDEO GRID ───────────────────────────────────────────────────── */}
      <section style={{ padding: "0 2.5rem 8rem", maxWidth: "1280px", margin: "0 auto" }}>
        <p className="label-caps" style={{ marginBottom: "1rem" }}>More Videos</p>
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", color: "var(--bone)", marginBottom: "3rem" }}
        >
          Moments from the <span style={{ color: "var(--red)" }}>Stage</span>
        </h2>

        <div
          className="videos-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}
        >
          {highlights.map((vid) => (
            <div
              key={vid.title}
              className="video-card card-stage"
              style={{ cursor: "pointer", overflow: "hidden" }}
            >
              <div style={{ position: "relative", aspectRatio: "16/9" }}>
                <Image
                  src={vid.thumb}
                  alt={vid.title}
                  fill
                  style={{
                    objectFit: "cover",
                    filter: "saturate(0.5)",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(13,13,13,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0")}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "var(--red)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      boxShadow: "0 0 15px rgba(230,20,56,0.6)",
                    }}
                  >
                    ▶
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                    padding: "0.2rem 0.6rem",
                    background: "var(--red)",
                    color: "#FFFFFF",
                    borderRadius: "3px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {vid.tag}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.75rem",
                    right: "0.75rem",
                    padding: "0.2rem 0.6rem",
                    background: "rgba(0,0,0,0.75)",
                    borderRadius: "3px",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {vid.duration}
                </div>
              </div>
              <div style={{ padding: "1.25rem", background: "#FFFFFF" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    color: "var(--bone)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {vid.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                  }}
                >
                  {vid.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── UPDATES FEED ─────────────────────────────────────────────────── */}
      <section
        className="updates-section"
        style={{ padding: "8rem 2.5rem", background: "#F8F9FA" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
            }}
          >
            <div>
              <p className="label-caps" style={{ marginBottom: "0.5rem" }}>Latest Updates</p>
              <h2
                className="display-section"
                style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", color: "var(--bone)" }}
              >
                News from <span style={{ color: "var(--red)" }}>RITHMOS</span>
              </h2>
            </div>
            <a
              href="#"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--red)",
                textDecoration: "none",
              }}
            >
              All Updates →
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {updates.map((upd, i) => (
              <div
                key={upd.title}
                className="update-item"
                style={{
                  padding: "2rem 0",
                  borderBottom: i < updates.length - 1 ? "1px solid var(--border)" : "none",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  gap: "2rem",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(200,16,46,0.03)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  {upd.date}
                </p>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.15rem 0.5rem",
                      background: "rgba(200,16,46,0.15)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--red)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {upd.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      color: "var(--bone)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {upd.title}
                  </h3>
                  <p className="body-copy" style={{ fontSize: "0.875rem" }}>{upd.excerpt}</p>
                </div>
                <span style={{ color: "var(--red)", fontSize: "1.2rem", flexShrink: 0 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 2.5rem",
          textAlign: "center",
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p className="label-caps" style={{ marginBottom: "1.5rem" }}>Follow the Journey</p>
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--bone)", marginBottom: "1rem" }}
        >
          Don&apos;t Miss a <span style={{ color: "var(--red)" }}>Note</span>
        </h2>
        <p className="body-copy" style={{ maxWidth: "440px", margin: "0 auto 2.5rem" }}>
          Follow RITHMOS on Instagram and YouTube for behind-the-scenes,
          band stories, and event announcements.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["Instagram", "YouTube", "Spotify"].map((s) => (
            <a
              key={s}
              href="#"
              className="btn-outline"
              style={{ fontSize: "0.85rem" }}
            >
              {s} →
            </a>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .videos-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .update-item { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
        }
        @media (max-width: 600px) {
          .videos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
