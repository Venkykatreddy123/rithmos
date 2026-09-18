"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface BandItem {
  id: string;
  name: string;
  genre: string;
  hometown: string;
  formed: string;
  quote: string;
  bio: string;
  image: string;
  stats: {
    liveShows: string;
    avgDecibels: string;
    originalTracks: string;
    fanVotes: string;
  };
  lineup: { name: string; instrument: string; gear: string }[];
  signatureTracks: string[];
  awards: string[];
  stageStyle: string;
  audioFreqs: number[];
}

const bandData: BandItem[] = [
  {
    id: "deccan-frequency",
    name: "The Deccan Frequency",
    genre: "Carnatic Progressive Rock",
    hometown: "Hyderabad (Secunderabad)",
    formed: "2023",
    quote: "We spent 3 years in a dusty basement near Begumpet. RITHMOS is the arena our sound was born for.",
    bio: "Pioneering a blistering blend of complex 7/8 Carnatic rhythm cycles, distorted dual-guitar harmonies, and thundering polyrhythmic mridangam-infused drums. Their live sets are legendary for inducing massive synchronized crowd headbanging.",
    image: "/images/band.jpg",
    stats: {
      liveShows: "42 Gigs",
      avgDecibels: "114 dB(A)",
      originalTracks: "8 Mastered",
      fanVotes: "14.2K",
    },
    lineup: [
      { name: "Siddharth Rao", instrument: "Lead Guitar & Konnakol", gear: "Ibanez Prestige RG · Neural DSP Quad Cortex" },
      { name: "Meera Krishnan", instrument: "Vocals & Classical Veena", gear: "Custom Shure KSM9 Wireless" },
      { name: "Pranav Teja", instrument: "Drums & Hybrid Percussion", gear: "Tama Starclassic · Meinl Byzance Cymbals" },
      { name: "Arjun Reddy", instrument: "6-String Extended Bass", gear: "Dingwall NG3 · Darkglass Microtubes 900" },
    ],
    signatureTracks: ["Charminar After Dark", "Raga of the Damned", "7th Pulse Odyssey"],
    awards: ["Winner: Deccan Underground 2025", "Best Original Song - Rolling Stone India Indie Radar"],
    stageStyle: "High-voltage kinetic pacing with synchronized dual-guitar breakdown drops.",
    audioFreqs: [82.41, 123.47, 164.81, 220.0, 329.63],
  },
  {
    id: "red-echoes",
    name: "Red Echoes",
    genre: "Alternative Rock / Post-Grunge",
    hometown: "Hyderabad (Jubilee Hills)",
    formed: "2022",
    quote: "Nothing on earth compares to the exact millisecond when the overdrive kicks in and 5,000 strangers sing your lyrics back at you.",
    bio: "Formed by four childhood friends with an obsession for 90s alternative rock crunch and soaring stadium anthems. Known for raw, unpolished energy that turns any venue into an electric sweatbox.",
    image: "/images/guitar.jpg",
    stats: {
      liveShows: "65 Gigs",
      avgDecibels: "118 dB(A)",
      originalTracks: "12 Mastered",
      fanVotes: "21.8K",
    },
    lineup: [
      { name: "Kabir Malhotra", instrument: "Lead Vocals & Rhythm Guitar", gear: "Fender 1962 Telecaster · Vox AC30 Handwired" },
      { name: "Neil Fernandez", instrument: "Lead Guitar & Soloist", gear: "Gibson Les Paul Standard · Marshall JCM800" },
      { name: "Varun Nair", instrument: "Drums & Backing Vocals", gear: "DW Collectors Series · Zildjian K Custom" },
      { name: "Rohan Varma", instrument: "Precision Bass", gear: "Fender Precision Bass · Ampeg Heritage SVT" },
    ],
    signatureTracks: ["Bleed in Crimson", "Neon Boulevard", "Echo Chamber Anthem"],
    awards: ["Best Live Performance - Hard Rock Cafe Hyderabad", "100k+ Streams on Spotify Indie India"],
    stageStyle: "Explosive stage jumps, raw tube amplifier saturation, and anthemic stadium call-and-response.",
    audioFreqs: [73.42, 110.0, 146.83, 196.0, 293.66],
  },
  {
    id: "hyderabad-collective",
    name: "The Neon Collective",
    genre: "Electro-Rock / Synthwave Fusion",
    hometown: "Hyderabad (Madhapur / HITEC City)",
    formed: "2024",
    quote: "Cyberpunk visuals, analog synthesizers, and crushing drum beats — live music in Telangana is having its golden age.",
    bio: "Blending analog moog synth basslines, punchy disco-rock drum grooves, and soaring female rock vocals. Their live sets feature synchronized audio-reactive LED jacket lights designed by the band members themselves.",
    image: "/images/audience.jpg",
    stats: {
      liveShows: "30 Gigs",
      avgDecibels: "109 dB(A)",
      originalTracks: "6 Mastered",
      fanVotes: "9.7K",
    },
    lineup: [
      { name: "Tanya Sen", instrument: "Vocals & Moog Synthesizers", gear: "Moog Subsequent 37 · TC-Helicon VoiceLive" },
      { name: "Dev Roy", instrument: "Electric Guitar & Talkbox", gear: "PRS Custom 24 · Strymon Timeline & BigSky" },
      { name: "Kunal Jha", instrument: "Bass & Synth Sub", gear: "Music Man StingRay · Novation Bass Station II" },
      { name: "Aditya Murthy", instrument: "Hybrid Electronic Drums", gear: "Roland SPD-SX PRO · Pearl Masters Maple" },
    ],
    signatureTracks: ["HITEC Midnight", "Circuit Breaker", "Velocity Protocol"],
    awards: ["Emerging Electronic Act 2025", "Featured on Red Bull SoundClash Indie Spotlight"],
    stageStyle: "Hypnotic synthwave laser ambiance with infectious dance-rock breakdowns.",
    audioFreqs: [65.41, 98.0, 130.81, 164.81, 246.94],
  },
];

export default function BandShowcaseSection() {
  const [selectedBand, setSelectedBand] = useState<BandItem>(bandData[0]);
  const [activeTab, setActiveTab] = useState<"overview" | "lineup" | "tech">("overview");
  const [playingBandId, setPlayingBandId] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode[]>([]);

  const playBandRiff = (band: BandItem) => {
    if (playingBandId === band.id) {
      // Stop
      oscRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      oscRef.current = [];
      setPlayingBandId(null);
      return;
    }

    try {
      // Stop previous
      oscRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      oscRef.current = [];

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const oscillators: OscillatorNode[] = [];

      band.audioFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1600, ctx.currentTime);

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        oscillators.push(osc);
      });

      oscRef.current = oscillators;
      setPlayingBandId(band.id);

      // Auto stop after 5 seconds
      setTimeout(() => {
        oscillators.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        setPlayingBandId(null);
      }, 5000);
    } catch {
      setPlayingBandId(band.id);
      setTimeout(() => setPlayingBandId(null), 3000);
    }
  };

  return (
    <section
      style={{
        padding: "8rem 2.5rem",
        maxWidth: "1380px",
        margin: "0 auto",
        position: "relative",
      }}
      id="band-stories-section"
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "3.5rem",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.6rem" }}>
            <span className="hud-badge red">BAND DOSSIERS & ROSTER</span>
            <span className="mono-telemetry">SEASON 01 CONTENDERS</span>
          </div>
          <h2
            className="display-section"
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)",
              color: "#0F1115",
              lineHeight: 0.9,
            }}
          >
            Bands That <span style={{ color: "var(--red)" }}>Dare to Rise</span>
          </h2>
          <p className="body-copy" style={{ maxWidth: "600px", marginTop: "1rem" }}>
            Inspect the real sonic pioneers competing in Season 01. Complete with studio member lineups, authentic stage gear specs, live telemetry, and interactive audio riff previews.
          </p>
        </div>

        {/* Quick Selector Pills */}
        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          {bandData.map((band) => {
            const isSelected = selectedBand.id === band.id;
            return (
              <button
                key={band.id}
                onClick={() => {
                  setSelectedBand(band);
                  setActiveTab("overview");
                }}
                style={{
                  padding: "0.75rem 1.4rem",
                  background: isSelected ? "var(--red)" : "#FFFFFF",
                  border: `1px solid ${isSelected ? "var(--red)" : "rgba(0, 0, 0, 0.12)"}`,
                  color: isSelected ? "#FFFFFF" : "#2D3139",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected ? "0 4px 15px rgba(230, 20, 56, 0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {band.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Band Dossier Grid Card */}
      <div
        className="card-stage band-dossier-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.3fr",
          minHeight: "640px",
          background: "#FFFFFF",
          border: "1px solid rgba(230, 20, 56, 0.3)",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Left: High-Impact Band Photography */}
        <div
          className="band-image-col"
          style={{
            position: "relative",
            minHeight: "460px",
            overflow: "hidden",
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Image
            src={selectedBand.image}
            alt={selectedBand.name}
            fill
            sizes="(max-width: 900px) 100vw, 650px"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              filter: "contrast(1.1) brightness(0.95)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.5) 100%)",
            }}
          />

          {/* Top Floating Badge */}
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.5rem",
              right: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="hud-badge red">
              <span className="live-indicator" /> {selectedBand.genre}
            </span>
            <span className="hud-badge">EST. {selectedBand.formed}</span>
          </div>

          {/* Audio Riff Play Trigger Button */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <button
              onClick={() => playBandRiff(selectedBand)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.8rem 1.6rem",
                background: playingBandId === selectedBand.id ? "var(--red)" : "rgba(10, 10, 10, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "30px",
                color: "#FFFFFF",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                boxShadow: playingBandId === selectedBand.id ? "0 0 30px var(--red)" : "0 10px 25px rgba(0,0,0,0.8)",
                transition: "all 0.3s ease",
              }}
            >
              <span>{playingBandId === selectedBand.id ? "■" : "▶"}</span>
              <span>{playingBandId === selectedBand.id ? "Playing Audio Sample..." : "Audition Band Riff"}</span>
            </button>
          </div>

          {/* Bottom Overlay Stats */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
                background: "#FFFFFF",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "6px",
                padding: "1rem 0.5rem",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <div>
                <p className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>LIVE GIGS</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "#0F1115", margin: 0 }}>
                  {selectedBand.stats.liveShows}
                </p>
              </div>
              <div>
                <p className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>DECIBEL</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--red)", margin: 0 }}>
                  {selectedBand.stats.avgDecibels}
                </p>
              </div>
              <div>
                <p className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>TRACKS</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "#0F1115", margin: 0 }}>
                  {selectedBand.stats.originalTracks}
                </p>
              </div>
              <div>
                <p className="mono-telemetry" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>FAN VOTES</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--gold)", margin: 0 }}>
                  {selectedBand.stats.fanVotes}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rich Informational Details & Tabbed View */}
        <div
          className="band-details-col"
          style={{
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#FFFFFF",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
              <span className="mono-telemetry" style={{ color: "var(--red)", fontWeight: 700 }}>
                📍 {selectedBand.hometown}
              </span>
              <span className="hud-badge gold">OFFICIAL CONTENDER</span>
            </div>

            <h3
              className="display-section"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                color: "#0F1115",
                marginBottom: "0.75rem",
              }}
            >
              {selectedBand.name}
            </h3>

            {/* Quote */}
            <p
              style={{
                fontStyle: "italic",
                color: "#2D3139",
                fontSize: "1rem",
                lineHeight: 1.6,
                borderLeft: "3px solid var(--red)",
                paddingLeft: "1.1rem",
                marginBottom: "1.5rem",
                background: "rgba(230, 20, 56, 0.05)",
                padding: "0.75rem 1rem",
                borderRadius: "0 4px 4px 0",
              }}
            >
              &ldquo;{selectedBand.quote}&rdquo;
            </p>

            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                paddingBottom: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              {(["overview", "lineup", "tech"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.45rem 1rem",
                    background: activeTab === tab ? "rgba(230,20,56,0.12)" : "#F8F9FA",
                    border: `1px solid ${activeTab === tab ? "var(--red)" : "rgba(0,0,0,0.08)"}`,
                    color: activeTab === tab ? "var(--red)" : "var(--muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tab === "overview" ? "Band Dossier" : tab === "lineup" ? "Member Roster & Gear" : "Stage Audio Specs"}
                </button>
              ))}
            </div>

            {/* Tab Content 1: Overview */}
            {activeTab === "overview" && (
              <div>
                <p className="body-copy" style={{ fontSize: "0.95rem", marginBottom: "1.25rem", color: "#2D3139" }}>
                  {selectedBand.bio}
                </p>

                <div style={{ marginBottom: "1.25rem" }}>
                  <p className="mono-telemetry" style={{ fontSize: "0.7rem", color: "var(--red)", marginBottom: "0.5rem" }}>
                    SIGNATURE ANTHEMS & SINGLES
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {selectedBand.signatureTracks.map((track, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "0.4rem 0.85rem",
                          background: "#F8F9FA",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          borderRadius: "4px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.76rem",
                          color: "#0F1115",
                        }}
                      >
                        🎵 {track}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mono-telemetry" style={{ fontSize: "0.7rem", color: "var(--gold)", marginBottom: "0.4rem" }}>
                    ACCOLADES & RECOGNITION
                  </p>
                  {selectedBand.awards.map((award, i) => (
                    <p key={i} style={{ fontSize: "0.86rem", color: "#0F1115", margin: "0.25rem 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ color: "var(--gold)" }}>★</span> {award}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content 2: Lineup */}
            {activeTab === "lineup" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {selectedBand.lineup.map((member, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.85rem 1.1rem",
                      background: "#F8F9FA",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "6px",
                    }}
                  >
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "#0F1115", margin: 0 }}>
                        {member.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--red)", margin: "0.15rem 0 0" }}>
                        {member.instrument}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--muted)",
                        maxWidth: "220px",
                        textAlign: "right",
                      }}
                    >
                      {member.gear}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content 3: Tech */}
            {activeTab === "tech" && (
              <div>
                <div
                  style={{
                    padding: "1.1rem",
                    background: "rgba(230, 20, 56, 0.06)",
                    border: "1px solid rgba(230, 20, 56, 0.25)",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                  }}
                >
                  <p className="mono-telemetry" style={{ fontSize: "0.7rem", color: "var(--red)", marginBottom: "0.35rem" }}>
                    STAGE ENERGY PROFILE & LIVE PACING
                  </p>
                  <p style={{ fontSize: "0.92rem", color: "#0F1115", margin: 0, lineHeight: 1.6 }}>
                    {selectedBand.stageStyle}
                  </p>
                </div>

                <div
                  style={{
                    padding: "1.1rem",
                    background: "#F8F9FA",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "4px",
                  }}
                >
                  <p className="mono-telemetry" style={{ fontSize: "0.7rem", color: "var(--gold)", marginBottom: "0.4rem" }}>
                    RECOMMENDED FOH MIX REQUIREMENTS
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#0F1115", lineHeight: 1.6, margin: 0 }}>
                    Heavy low-end punch (+3dB @ 60Hz), bright stereo guitar spread with sidechain ducking under lead vocal, ambient hall reverb on drum overheads.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <span className="mono-telemetry" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
              STAGE 02 HEADLINER CONTENDER
            </span>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/watch" className="btn-outline" style={{ padding: "0.65rem 1.3rem", fontSize: "0.9rem" }}>
                Watch Auditions
              </Link>
              <Link href="/contact" className="btn-primary" style={{ padding: "0.65rem 1.5rem", fontSize: "0.9rem" }}>
                Vote for Band →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          #band-stories-section {
            padding: 4rem 1.25rem !important;
          }
          .band-dossier-grid {
            grid-template-columns: 1fr !important;
          }
          .band-image-col {
            min-height: 320px !important;
            height: 320px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
          }
          .band-details-col {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
