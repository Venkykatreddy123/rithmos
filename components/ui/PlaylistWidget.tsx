"use client";

import { useState, useRef, useEffect } from "react";

const PLAYLIST = [
  { id: 1, title: "Echoes of the Riot", band: "The Midnight Signal", duration: "3:45" },
  { id: 2, title: "Steel Rain", band: "Ironclad", duration: "4:12" },
  { id: 3, title: "Neon Skyline", band: "Neon Ghosts", duration: "3:30" },
  { id: 4, title: "Crimson Waves", band: "Crimson Riot", duration: "2:58" },
];

export default function PlaylistWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextTrack();
            return 0;
          }
          return prev + 0.5; // Simulate progress
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex]);

  const currentTrack = PLAYLIST[currentTrackIndex];

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  return (
    <div
      className="playlist-widget-container"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "1rem",
      }}
    >
      {/* Playlist Panel */}
      <div
        className="playlist-widget-panel"
        style={{
          width: "320px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
          padding: "1.25rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span className="label-caps" style={{ fontSize: "0.65rem", color: "var(--red)" }}>
            Season 01 Anthems
          </span>
          <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
            {currentTrackIndex + 1} / {PLAYLIST.length}
          </span>
        </div>

        {/* Track List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {PLAYLIST.map((track, i) => (
            <div
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(i);
                setIsPlaying(true);
                setProgress(0);
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem",
                borderRadius: "4px",
                background: currentTrackIndex === i ? "rgba(230, 20, 56, 0.08)" : "transparent",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: currentTrackIndex === i ? 800 : 600, fontSize: "0.9rem", color: currentTrackIndex === i ? "var(--red)" : "var(--bone)", margin: "0 0 0.2rem" }}>
                  {track.title}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", margin: 0 }}>
                  {track.band}
                </p>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
                {track.duration}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden", marginBottom: "1rem" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--red)", transition: "width 0.5s linear" }} />
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem" }}>
          <button onClick={prevTrack} style={{ background: "none", border: "none", color: "var(--bone)", cursor: "pointer", fontSize: "1.2rem" }}>
            ⏮
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--red)",
              border: "none",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1.2rem",
              boxShadow: isPlaying ? "0 0 15px rgba(230,20,56,0.5)" : "none",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={nextTrack} style={{ background: "none", border: "none", color: "var(--bone)", cursor: "pointer", fontSize: "1.2rem" }}>
            ⏭
          </button>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="playlist-widget-btn"
        aria-label="Toggle playlist"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#FFFFFF",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          color: "var(--bone)",
          position: "relative",
          zIndex: 51,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid var(--red)",
            borderTopColor: "transparent",
            borderRightColor: "transparent",
            animation: isPlaying ? "spin 2s linear infinite" : "none",
            opacity: isPlaying ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        <span style={{ fontSize: "1.4rem", zIndex: 2 }}>🎵</span>
      </button>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .playlist-widget-container {
            bottom: 1.25rem !important;
            right: 1rem !important;
          }
          .playlist-widget-panel {
            width: calc(100vw - 2rem) !important;
            max-width: 320px !important;
          }
          .playlist-widget-btn {
            width: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </div>
  );
}
