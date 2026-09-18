"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface VenueItem {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: string;
  stageDimensions: string;
  paSystem: string;
  monitors: string;
  lighting: string;
  image: string;
  vibe: string;
  season1Events: string[];
}

const venues: VenueItem[] = [
  {
    id: "gachibowli",
    name: "Gachibowli Live Music Arena",
    type: "Mega Stadium Grand Finale",
    location: "Old Mumbai Highway, Gachibowli, Hyderabad",
    capacity: "12,000+ Fans",
    stageDimensions: "60ft (W) × 40ft (D) × 5ft (H)",
    paSystem: "L-Acoustics K2 Line Array (24 Tops + 16 KS28 Subs · 180,000W)",
    monitors: "12x L-Acoustics X15 HiQ Wedges + Sennheiser IEM G4 Wireless",
    lighting: "48x Robe MegaPointe + 24x Martin Atomic 3000 Strobe + DMX Lasers",
    image: "/images/hero.jpg",
    vibe: "Earth-shaking stadium resonance engineered for peak headline glory, pyrotechnics, and massive crowd singalongs.",
    season1Events: ["Dec 19, 2026: Grand Arena Finale & Winner Coronation"],
  },
  {
    id: "heart-cup",
    name: "Heart Cup Coffee Live Stage",
    type: "Intimate Club Circuit",
    location: "Road No. 45, Jubilee Hills, Hyderabad",
    capacity: "450+ Fans",
    stageDimensions: "28ft (W) × 18ft (D) × 2.5ft (H)",
    paSystem: "d&b audiotechnik V-Series Array with V-GSUB Subwoofers",
    monitors: "8x JBL SRX712M Wedges + Shure PSM900 IEMs",
    lighting: "Chauvet Pro Rogue R2 Wash & Spot Array with Hazebase Foggers",
    image: "/images/club.jpg",
    vibe: "Electrifying proximity where every guitar riff hits you in the chest and the band is within touching distance.",
    season1Events: ["Nov 06, 2026: Rock & Alternative Semi-Final Battle"],
  },
  {
    id: "ext-moonshine",
    name: "EXT by The Moonshine Project",
    type: "Underground Sonic Vault",
    location: "Road No. 82, Film Nagar, Hyderabad",
    capacity: "350+ Fans",
    stageDimensions: "24ft (W) × 16ft (D) × 2ft (H)",
    paSystem: "QSC KLA12 Line Array + Dual KW181 18\" Active Subs",
    monitors: "6x QSC K12.2 Powered Wedges",
    lighting: "Custom Industrial Edison Filament Rigs + Crimson Strobe Bars",
    image: "/images/rehearsal.jpg",
    vibe: "Raw, gritty, brick-and-mortar temple of high-gain tube distortion and uncompromising indie spirit.",
    season1Events: ["Nov 13, 2026: Fusion & Progressive Head-to-Head Clash"],
  },
  {
    id: "shilpakala",
    name: "Shilpakala Amphitheatre",
    type: "Open-Air Acoustic Colosseum",
    location: "HITEC City, Madhapur, Hyderabad",
    capacity: "2,500+ Fans",
    stageDimensions: "45ft (W) × 30ft (D) × 3.5ft (H)",
    paSystem: "JBL VTX A8 Compact Line Array + VTX B18 Arrayable Subs",
    monitors: "10x Turbosound TFX122M Coaxial Wedges",
    lighting: "Architectural Skyline Wash + 32x Claypaky Sharpy Beams",
    image: "/images/hyderabad.jpg",
    vibe: "Natural stone amphitheatre acoustics creating ethereal vocal resonance under the starry Hyderabad night sky.",
    season1Events: ["Nov 20, 2026: The Acoustic & World Fusion Showcase"],
  },
];

export default function VenueMatrixSection() {
  const [activeVenue, setActiveVenue] = useState<VenueItem>(venues[0]);

  return (
    <section
      style={{
        padding: "8rem 2.5rem",
        maxWidth: "1380px",
        margin: "0 auto",
        position: "relative",
      }}
      id="venue-matrix-section"
    >
      {/* Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.6rem" }}>
          <span className="hud-badge gold">STAGE & ACOUSTIC INFRASTRUCTURE</span>
          <span className="mono-telemetry">HYDERABAD HOST VENUES</span>
        </div>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
            color: "#0F1115",
            lineHeight: 0.92,
          }}
        >
          The Four <span style={{ color: "var(--gold)" }}>Sacred Stages</span>
        </h2>
        <p className="body-copy" style={{ maxWidth: "620px", marginTop: "1rem" }}>
          From intimate club pressure to massive stadium line arrays. Inspect the acoustics, sound reinforcement rigs, and stage dimensions where Season 1 history will be written.
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "2.5rem",
          alignItems: "stretch",
        }}
        className="venue-grid-container"
      >
        {/* Left: Venue List Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {venues.map((venue, idx) => {
            const isSelected = activeVenue.id === venue.id;
            return (
              <div
                key={venue.id}
                className="venue-button-card"
                onClick={() => setActiveVenue(venue)}
                style={{
                  background: isSelected ? "rgba(230, 20, 56, 0.08)" : "#FFFFFF",
                  border: `1px solid ${isSelected ? "var(--red)" : "rgba(0, 0, 0, 0.1)"}`,
                  borderRadius: "6px",
                  padding: "1.6rem",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isSelected ? "0 8px 25px rgba(230, 20, 56, 0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                  transform: isSelected ? "translateX(8px)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: isSelected ? "var(--red)" : "var(--muted)",
                      fontWeight: 800,
                    }}
                  >
                    STAGE 0{idx + 1}
                  </span>
                  <span className="hud-badge" style={{ fontSize: "0.7rem" }}>
                    👥 {venue.capacity}
                  </span>
                </div>

                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1.45rem",
                    color: isSelected ? "var(--red)" : "#0F1115",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {venue.name}
                </h4>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: isSelected ? "#0F1115" : "var(--muted)",
                    margin: "0.4rem 0 0",
                  }}
                >
                  {venue.type} · {venue.location.split(",")[1]?.trim() || "Hyderabad"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Rich Interactive Spec Card */}
        <div
          className="card-stage"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.4)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
          }}
        >
          {/* Top Stage Photo with Overlay */}
          <div style={{ position: "relative", height: "250px", width: "100%" }}>
            <Image
              src={activeVenue.image}
              alt={activeVenue.name}
              fill
              sizes="(max-width: 900px) 100vw, 700px"
              style={{ objectFit: "cover", filter: "contrast(1.1) brightness(0.95)" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.6) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                left: "1.5rem",
                right: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="hud-badge gold">
                <span className="live-indicator" style={{ background: "var(--gold)" }} /> OFFICIAL STAGE VENUE
              </span>
              <span className="hud-badge">CAPACITY: {activeVenue.capacity}</span>
            </div>
            <div style={{ position: "absolute", bottom: "1rem", left: "1.5rem" }}>
              <h3
                className="display-section"
                style={{ fontSize: "1.9rem", color: "#0F1115", margin: 0 }}
              >
                {activeVenue.name}
              </h3>
            </div>
          </div>

          {/* Details Body */}
          <div className="venue-details-body" style={{ padding: "2.2rem", display: "flex", flexDirection: "column", gap: "1.3rem", flex: 1 }}>
            <p className="body-copy" style={{ fontSize: "0.96rem", fontStyle: "italic", margin: 0, color: "#2D3139" }}>
              &ldquo;{activeVenue.vibe}&rdquo;
            </p>

            {/* Tech Specs Matrix */}
            <div
              className="venue-specs-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.1rem",
                background: "#F8F9FA",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                borderRadius: "6px",
                padding: "1.3rem",
              }}
            >
              <div>
                <span className="mono-telemetry" style={{ fontSize: "0.68rem", color: "var(--red)" }}>
                  STAGE DIMENSIONS
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#0F1115", margin: "0.25rem 0 0", fontWeight: 700 }}>
                  {activeVenue.stageDimensions}
                </p>
              </div>

              <div>
                <span className="mono-telemetry" style={{ fontSize: "0.68rem", color: "var(--gold)" }}>
                  PA CONCERT SYSTEM
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#0F1115", margin: "0.25rem 0 0", fontWeight: 700 }}>
                  {activeVenue.paSystem}
                </p>
              </div>

              <div>
                <span className="mono-telemetry" style={{ fontSize: "0.68rem", color: "var(--red)" }}>
                  MONITOR RIG & IEMS
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#0F1115", margin: "0.25rem 0 0", fontWeight: 700 }}>
                  {activeVenue.monitors}
                </p>
              </div>

              <div>
                <span className="mono-telemetry" style={{ fontSize: "0.68rem", color: "var(--gold)" }}>
                  LIGHTING & PYRO RIG
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#0F1115", margin: "0.25rem 0 0", fontWeight: 700 }}>
                  {activeVenue.lighting}
                </p>
              </div>
            </div>

            {/* Scheduled Season 1 Event */}
            <div
              style={{
                padding: "1rem 1.4rem",
                background: "rgba(230, 20, 56, 0.06)",
                border: "1px solid rgba(230, 20, 56, 0.25)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>🎟️</span>
              <div>
                <span className="mono-telemetry" style={{ fontSize: "0.68rem", color: "var(--red)" }}>
                  SCHEDULED COMPETITION DATE
                </span>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "#0F1115", margin: 0 }}>
                  {activeVenue.season1Events[0]}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <span className="mono-telemetry" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                HYDERABAD LIVE ECOSYSTEM
              </span>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link href="/experience" className="btn-outline" style={{ padding: "0.65rem 1.3rem", fontSize: "0.9rem" }}>
                  Venue Photos & Map
                </Link>
                <Link href="/contact" className="btn-primary" style={{ padding: "0.65rem 1.5rem", fontSize: "0.9rem" }}>
                  Register to Perform →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #venue-matrix-section {
            padding: 4rem 1.25rem !important;
          }
          .venue-grid-container {
            grid-template-columns: 1fr !important;
          }
          .venue-button-card {
            padding: 1.1rem !important;
            transform: none !important;
          }
          .venue-details-body {
            padding: 1.25rem !important;
          }
        }
        @media (max-width: 640px) {
          .venue-specs-grid {
            grid-template-columns: 1fr !important;
            padding: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
