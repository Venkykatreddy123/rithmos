"use client";

import { useState, useRef } from "react";

interface BandInfo {
  name: string;
  genre: string;
  origin: string;
  members: string;
  riffKey: number; // base freq for riff synth
  riffPattern: number[];
  bio: string;
}

const BAND_DATABASE: { [key: string]: BandInfo } = {
  "Asur": {
    name: "Asur",
    genre: "Carnatic Prog-Metal",
    origin: "Jubilee Hills, Hyderabad",
    members: "5-Piece (8-String Guitar, Mridangam Fusion, Vocals)",
    riffKey: 110, // A2
    riffPattern: [110, 116.54, 130.81, 146.83, 110, 155.56, 146.83, 110],
    bio: "Pioneering Indian Carnatic microtonal scales fused with drop-tuned progressive djent riffs."
  },
  "The Deccan Reverb": {
    name: "The Deccan Reverb",
    genre: "Post-Grunge / Alt Rock",
    origin: "Secunderabad",
    members: "4-Piece (Dual Guitars, Heavy Bass, Drums)",
    riffKey: 146.83, // D3
    riffPattern: [146.83, 174.61, 196.00, 220.00, 196.00, 174.61],
    bio: "Raw vintage valve-driven distortion and anthemic choruses born out of twin-city garage jam sessions."
  },
  "Charminar Blues": {
    name: "Charminar Blues",
    genre: "Desert / Southern Rock",
    origin: "Old City, Hyderabad",
    members: "4-Piece (Slide Guitar, Hammond Organ, Rhythm)",
    riffKey: 196.00, // G3
    riffPattern: [196, 233.08, 261.63, 277.18, 293.66, 261.63],
    bio: "Delta blues soul combined with Deccani vocal inflections and screaming fuzz solos."
  },
  "Gachibowli Groove": {
    name: "Gachibowli Groove",
    genre: "Indie Math-Funk",
    origin: "HITEC City, Hyderabad",
    members: "5-Piece (Brass Section, Slap Bass, Synth)",
    riffKey: 130.81, // C3
    riffPattern: [130.81, 164.81, 196.00, 246.94, 261.63, 196],
    bio: "Tight syncopated polyrhythms with neo-soul grooves and tech-industry underground energy."
  },
  "Nizam's Riot": {
    name: "Nizam's Riot",
    genre: "Hardcore Punk",
    origin: "Banjara Hills",
    members: "3-Piece (Power Trio)",
    riffKey: 164.81, // E3
    riffPattern: [164.81, 174.61, 164.81, 196, 174.61, 164.81],
    bio: "Fast, blistering 200-BPM political punk rock with furious guitar attack and gang vocals."
  },
  "Solitary Pulse": {
    name: "Solitary Pulse",
    genre: "Cinematic Post-Rock",
    origin: "Begumpet",
    members: "4-Piece (Ambient Guitars, Cello, Drum Pad)",
    riffKey: 220.00, // A3
    riffPattern: [220, 261.63, 329.63, 392.00, 440.00],
    bio: "Crescendo-heavy ambient soundscapes capturing midnight rain over Hussain Sagar."
  },
  "Red Horizon": {
    name: "Red Horizon",
    genre: "Modern Thrash Metal",
    origin: "Kondapur",
    members: "5-Piece (Double Bass Drummer, Shred Guitars)",
    riffKey: 82.41, // E2
    riffPattern: [82.41, 82.41, 87.31, 82.41, 110, 103.83],
    bio: "Relentless double-kick assault, lightning-fast guitar harmonies and thunderous breakdown riffs."
  },
  "Velvet Sound": {
    name: "Velvet Sound",
    genre: "Dream Pop / Indie Rock",
    origin: "Madhapur",
    members: "4-Piece (Ethereal Vocals, Chorus Guitars)",
    riffKey: 261.63, // C4
    riffPattern: [261.63, 293.66, 329.63, 392.00, 349.23],
    bio: "Lush shimmering reverb pedalboards and nostalgic melody hooks."
  }
};

type Match = {
  id: number;
  band1: string;
  band2: string;
  votes1: number;
  votes2: number;
  winner: 1 | 2 | null;
  live?: boolean;
  venue: string;
};

type Round = {
  title: string;
  matches: Match[];
};

const INITIAL_ROUNDS: Round[] = [
  {
    title: "Quarterfinals (Heats)",
    matches: [
      { id: 1, band1: "Asur", band2: "The Deccan Reverb", votes1: 64, votes2: 36, winner: 1, venue: "EXT Moonshine Project" },
      { id: 2, band1: "Charminar Blues", band2: "Nizam's Riot", votes1: 58, votes2: 42, winner: 1, venue: "EXT Moonshine Project" },
      { id: 3, band1: "Gachibowli Groove", band2: "Solitary Pulse", votes1: 71, votes2: 29, winner: 1, venue: "Hitex Arena" },
      { id: 4, band1: "Red Horizon", band2: "Velvet Sound", votes1: 49, votes2: 51, winner: 2, venue: "Hitex Arena" },
    ],
  },
  {
    title: "Semifinals (Arena)",
    matches: [
      { id: 5, band1: "Asur", band2: "Charminar Blues", votes1: 62, votes2: 38, winner: 1, venue: "Hitex Amphitheater" },
      { id: 6, band1: "Gachibowli Groove", band2: "Velvet Sound", votes1: 53, votes2: 47, live: true, winner: null, venue: "Hitex Amphitheater" },
    ],
  },
  {
    title: "Grand Finale (Shilpakala Vedika)",
    matches: [
      { id: 7, band1: "Asur", band2: "TBD (Semi 2 Winner)", votes1: 50, votes2: 50, winner: null, venue: "Shilpakala Vedika Indoor" },
    ],
  },
];

export default function TournamentBracket() {
  const [selectedBand, setSelectedBand] = useState<BandInfo | null>(null);
  const [activeRiffBand, setActiveRiffBand] = useState<string | null>(null);
  const [liveVotes, setLiveVotes] = useState<{ [matchId: number]: { v1: number; v2: number } }>({
    6: { v1: 53, v2: 47 }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthetic signature riff for a band
  const playBandRiff = (bandName: string) => {
    const band = BAND_DATABASE[bandName];
    if (!band) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") ctx.resume();

      setActiveRiffBand(bandName);
      const now = ctx.currentTime;
      const noteDuration = 0.22;

      band.riffPattern.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filt = ctx.createBiquadFilter();

        osc.type = band.genre.includes("Metal") || band.genre.includes("Rock") ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

        filt.type = "lowpass";
        filt.frequency.setValueAtTime(2000, now + idx * noteDuration);
        filt.frequency.exponentialRampToValueAtTime(400, now + (idx + 1) * noteDuration);

        gain.gain.setValueAtTime(0.3, now + idx * noteDuration);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 0.9) * noteDuration);

        osc.connect(filt);
        filt.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * noteDuration);
        osc.stop(now + (idx + 1) * noteDuration);
      });

      setTimeout(() => {
        setActiveRiffBand(null);
      }, band.riffPattern.length * noteDuration * 1000 + 200);
    } catch (e) {
      console.error(e);
      setActiveRiffBand(null);
    }
  };

  const castLiveVote = (matchId: number, bandIndex: 1 | 2) => {
    setLiveVotes(prev => {
      const cur = prev[matchId] || { v1: 50, v2: 50 };
      if (bandIndex === 1) {
        return { ...prev, [matchId]: { v1: Math.min(95, cur.v1 + 2), v2: Math.max(5, cur.v2 - 2) } };
      } else {
        return { ...prev, [matchId]: { v1: Math.max(5, cur.v1 - 2), v2: Math.min(95, cur.v2 + 2) } };
      }
    });
  };

  return (
    <div
      style={{
        padding: "2.5rem 1.5rem",
        background: "#FFFFFF",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
      }}
    >
      {/* ─── Header Plate ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--red)",
                boxShadow: "0 0 10px var(--red)",
                display: "inline-block",
              }}
            />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--red)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
              HYDERABAD CHAMPIONSHIP BRACKET • SEASON 01
            </span>
          </div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.8rem", color: "var(--bone)", margin: 0, textTransform: "uppercase" }}>
            Live Knockout Tournament
          </h3>
        </div>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--gold)", background: "rgba(212,160,56,0.1)", border: "1px solid rgba(212,160,56,0.3)", padding: "6px 12px", borderRadius: "6px" }}>
          🏆 ₹5,00,000 Total Prize Pool & Label Signing
        </div>
      </div>

      {/* ─── Interactive Tournament Grid ─── */}
      <div style={{ display: "flex", minWidth: "850px", justifyContent: "space-between", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem" }}>
        {INITIAL_ROUNDS.map((round, rIndex) => (
          <div key={round.title} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                color: "var(--muted)",
                letterSpacing: "0.08em",
                marginBottom: "1.2rem",
                textAlign: "center",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                paddingBottom: "0.5rem",
              }}
            >
              {round.title}
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                flex: 1,
                gap: rIndex === 0 ? "1rem" : rIndex === 1 ? "2.5rem" : "0",
              }}
            >
              {round.matches.map((match) => {
                const isLive = match.live;
                const v1 = isLive ? (liveVotes[match.id]?.v1 ?? match.votes1) : match.votes1;
                const v2 = isLive ? (liveVotes[match.id]?.v2 ?? match.votes2) : match.votes2;

                return (
                  <div
                    key={match.id}
                    style={{
                      background: isLive ? "#FFF5F6" : "#FFFFFF",
                      border: isLive ? "1px solid rgba(230,20,56,0.4)" : "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                      padding: "0.85rem",
                      boxShadow: isLive ? "0 4px 15px rgba(230,20,56,0.15)" : "0 2px 8px rgba(0,0,0,0.03)",
                      position: "relative",
                    }}
                  >
                    {/* Match Venue & Status */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                      <span style={{ fontSize: "0.58rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                        📍 {match.venue}
                      </span>
                      {isLive && (
                        <span
                          style={{
                            fontSize: "0.58rem",
                            fontFamily: "var(--font-mono)",
                            color: "#FFFFFF",
                            background: "var(--red)",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            animation: "pulse 1.5s infinite",
                          }}
                        >
                          LIVE FAN BATTLE
                        </span>
                      )}
                    </div>

                    {/* Band 1 Strip */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "4px",
                        background: match.winner === 1 ? "rgba(184,134,11,0.12)" : "#F8F9FA",
                        border: match.winner === 1 ? "1px solid rgba(184,134,11,0.35)" : "1px solid rgba(0,0,0,0.06)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {BAND_DATABASE[match.band1] && (
                          <button
                            onClick={() => playBandRiff(match.band1)}
                            style={{
                              background: activeRiffBand === match.band1 ? "var(--red)" : "rgba(0,0,0,0.06)",
                              border: "none",
                              color: activeRiffBand === match.band1 ? "#FFFFFF" : "#0F1115",
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              fontSize: "0.6rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Audition 5-sec Signature Riff"
                          >
                            {activeRiffBand === match.band1 ? "♫" : "▶"}
                          </button>
                        )}
                        <span
                          onClick={() => BAND_DATABASE[match.band1] && setSelectedBand(BAND_DATABASE[match.band1])}
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "0.82rem",
                            fontWeight: match.winner === 1 ? 800 : 600,
                            color: match.winner === 1 ? "var(--gold)" : "var(--bone)",
                            cursor: BAND_DATABASE[match.band1] ? "pointer" : "default",
                            textDecoration: BAND_DATABASE[match.band1] ? "underline dotted" : "none",
                          }}
                        >
                          {match.band1}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: match.winner === 1 ? "var(--gold)" : "var(--muted)", fontWeight: 700 }}>
                          {v1}%
                        </span>
                        {isLive && (
                          <button
                            onClick={() => castLiveVote(match.id, 1)}
                            style={{
                              background: "rgba(230,20,56,0.12)",
                              border: "1px solid rgba(230,20,56,0.4)",
                              color: "var(--red)",
                              borderRadius: "3px",
                              fontSize: "0.55rem",
                              padding: "2px 5px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            +VOTE
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Band 2 Strip */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "4px",
                        background: match.winner === 2 ? "rgba(184,134,11,0.12)" : "#F8F9FA",
                        border: match.winner === 2 ? "1px solid rgba(184,134,11,0.35)" : "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {BAND_DATABASE[match.band2] && (
                          <button
                            onClick={() => playBandRiff(match.band2)}
                            style={{
                              background: activeRiffBand === match.band2 ? "var(--red)" : "rgba(0,0,0,0.06)",
                              border: "none",
                              color: activeRiffBand === match.band2 ? "#FFFFFF" : "#0F1115",
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              fontSize: "0.6rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Audition 5-sec Signature Riff"
                          >
                            {activeRiffBand === match.band2 ? "♫" : "▶"}
                          </button>
                        )}
                        <span
                          onClick={() => BAND_DATABASE[match.band2] && setSelectedBand(BAND_DATABASE[match.band2])}
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "0.82rem",
                            fontWeight: match.winner === 2 ? 800 : 600,
                            color: match.winner === 2 ? "var(--gold)" : "var(--bone)",
                            cursor: BAND_DATABASE[match.band2] ? "pointer" : "default",
                            textDecoration: BAND_DATABASE[match.band2] ? "underline dotted" : "none",
                          }}
                        >
                          {match.band2}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: match.winner === 2 ? "var(--gold)" : "var(--muted)", fontWeight: 700 }}>
                          {v2}%
                        </span>
                        {isLive && (
                          <button
                            onClick={() => castLiveVote(match.id, 2)}
                            style={{
                              background: "rgba(230,20,56,0.2)",
                              border: "1px solid rgba(230,20,56,0.4)",
                              color: "var(--red)",
                              borderRadius: "3px",
                              fontSize: "0.55rem",
                              padding: "2px 5px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            +VOTE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Band Info Modal / Drawer ─── */}
      {selectedBand && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.2rem",
            background: "#F8F9FA",
            border: "1px solid rgba(184,134,11,0.3)",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, color: "var(--bone)" }}>
                {selectedBand.name}
              </span>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--gold)", background: "rgba(184,134,11,0.15)", padding: "2px 6px", borderRadius: "3px" }}>
                {selectedBand.genre}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", margin: "0.3rem 0" }}>
              📍 {selectedBand.origin} • Lineup: {selectedBand.members}
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--bone)", margin: "0.4rem 0 0", maxWidth: "600px", lineHeight: 1.4 }}>
              {selectedBand.bio}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => playBandRiff(selectedBand.name)}
              style={{
                background: "var(--red)",
                border: "none",
                color: "#FFFFFF",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "0.72rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ♫ Play Signature Riff
            </button>
            <button
              onClick={() => setSelectedBand(null)}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.15)",
                color: "var(--muted)",
                padding: "6px 10px",
                borderRadius: "4px",
                fontSize: "0.72rem",
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
