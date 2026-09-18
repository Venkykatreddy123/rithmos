"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveformDivider from "@/components/ui/WaveformDivider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    date: "OCT 14, 2026",
    title: "Club Stage — Night 1",
    venue: "Blend Kitchen & Bar, Banjara Hills",
    time: "7:30 PM",
    bands: ["The Midnight Signal", "Arid Monsoon", "Glass Horizon", "Seventh Echo"],
    img: "/images/club.jpg",
    status: "Upcoming",
  },
  {
    date: "OCT 21, 2026",
    title: "Club Stage — Night 2",
    venue: "Hard Rock Café, Jubilee Hills",
    time: "8:00 PM",
    bands: ["Phantom Ink", "Lost Meridian", "Neon Wraith", "The Open Road"],
    img: "/images/band.jpg",
    status: "Upcoming",
  },
  {
    date: "NOV 08, 2026",
    title: "Club Stage — Night 3",
    venue: "Social, Hitec City",
    time: "7:00 PM",
    bands: ["Acid Summer", "Five Kings", "Broken Compass", "Coastal Theory"],
    img: "/images/rehearsal.jpg",
    status: "Upcoming",
  },
  {
    date: "NOV 29, 2026",
    title: "RITHMOS Stage — The Final",
    venue: "JRC Convention Centre, Hyderabad",
    time: "6:00 PM",
    bands: ["8 Finalists — TBA"],
    img: "/images/hero.jpg",
    status: "Headline",
  },
];

const galleryImages = [
  { src: "/images/hero.jpg", caption: "The Main Stage" },
  { src: "/images/audience.jpg", caption: "The Crowd" },
  { src: "/images/band.jpg", caption: "Live Performance" },
  { src: "/images/club.jpg", caption: "Club Stage Night" },
  { src: "/images/rehearsal.jpg", caption: "Backstage Prep" },
  { src: "/images/guitar.jpg", caption: "In The Details" },
];

export default function ExperiencePage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".event-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: ".events-grid", start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".gallery-item",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: ".gallery-grid", start: "top 75%" },
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
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/audience.jpg"
          alt="RITHMOS Live Experience"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 40%", opacity: 0.5, filter: "saturate(0.7)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.95) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "8rem 2.5rem 4rem",
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <p
            className="label-caps"
            style={{ marginBottom: "2rem", animation: "fade-in 0.8s ease forwards" }}
          >
            ⸺ Season One Events ⸺
          </p>
          <h1
            className="display-hero"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              color: "var(--bone)",
              maxWidth: "800px",
              animation: "slide-up 1s ease 0.3s forwards",
              opacity: 0,
            }}
          >
            Live.<br />
            <span style={{ color: "var(--red)" }}>Loud.</span><br />
            Unforgettable.
          </h1>
          <p
            className="body-copy"
            style={{
              maxWidth: "480px",
              marginTop: "2rem",
              fontSize: "1.1rem",
              animation: "slide-up 1s ease 0.6s forwards",
              opacity: 0,
            }}
          >
            Four events across Hyderabad&apos;s best venues. Each one
            a self-contained experience. All leading to one night.
          </p>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── EVENTS SCHEDULE ──────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <p className="label-caps" style={{ marginBottom: "1rem" }}>Season Schedule</p>
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--bone)", marginBottom: "4rem" }}
        >
          Mark Your <span style={{ color: "var(--red)" }}>Calendar</span>
        </h2>

        <div
          className="events-grid"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {events.map((event, i) => (
            <div
              key={event.title}
              className="event-card card-stage"
              style={{
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                overflow: "hidden",
                border: event.status === "Headline"
                  ? "1px solid rgba(200,16,46,0.6)"
                  : "1px solid var(--border)",
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", minHeight: "200px" }}>
                <Image
                  src={event.img}
                  alt={event.title}
                  fill
                  style={{ objectFit: "cover", filter: "saturate(0.7) brightness(0.9)" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, transparent, rgba(255,255,255,0.75))",
                  }}
                />
                {event.status === "Headline" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      padding: "0.25rem 0.75rem",
                      background: "var(--red)",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderRadius: "3px",
                    }}
                  >
                    Headline Event
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 900,
                        fontStyle: "italic",
                        fontSize: "0.8rem",
                        letterSpacing: "0.15em",
                        color: "var(--red)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {event.date} · {event.time}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        color: "var(--bone)",
                      }}
                    >
                      {event.title}
                    </h3>
                  </div>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      border: "1px solid var(--border)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {event.status}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    marginBottom: "1rem",
                  }}
                >
                  📍 {event.venue}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {event.bands.map((b) => (
                    <span
                      key={b}
                      style={{
                        padding: "0.2rem 0.6rem",
                        background: "rgba(200,16,46,0.1)",
                        border: "1px solid rgba(200,16,46,0.2)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "var(--red)",
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── GALLERY ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: "#F8F9FA" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p className="label-caps" style={{ marginBottom: "1rem" }}>Visual Archive</p>
          <h2
            className="display-section"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--bone)", marginBottom: "4rem" }}
          >
            From the <span style={{ color: "var(--red)" }}>Stage</span>
          </h2>

          <div
            className="gallery-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={img.src + i}
                className="gallery-item"
                style={{
                  position: "relative",
                  aspectRatio: i === 0 || i === 3 ? "1/1" : "4/3",
                  overflow: "hidden",
                  cursor: "pointer",
                  gridColumn: i === 0 ? "span 2" : "auto",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  style={{
                    objectFit: "cover",
                    filter: "saturate(0.7)",
                    transition: "transform 0.5s ease, filter 0.5s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
                    (e.currentTarget as HTMLImageElement).style.filter = "saturate(1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLImageElement).style.filter = "saturate(0.7)";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1rem",
                    background: "linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.2) 80%, transparent)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--bone)",
                      opacity: 0.95,
                    }}
                  >
                    {img.caption}
                  </p>
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
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2
          className="display-section"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--bone)", marginBottom: "2rem" }}
        >
          Be Part of <span style={{ color: "var(--red)" }}>the Story</span>
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn-primary animate-red-pulse">Register Your Band →</Link>
          <Link href="/watch" className="btn-outline">Watch Highlights</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .event-card { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-grid > div:first-child { grid-column: auto !important; }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
