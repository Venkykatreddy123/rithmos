"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { audioBus, AudioSignal } from "@/lib/audioBus";

interface VideoFeed {
  id: string;
  label: string;
  badge: string;
  title: string;
  detail: string;
  src: string;
  poster: string;
  accent: string;
}

const VIDEO_FEEDS: VideoFeed[] = [
  {
    id: "cam-guitar",
    label: "CAM 01 // GUITAR SHRED",
    badge: "STRINGS",
    title: "Electric Guitar Fretboard Run",
    detail: "Distortion Rig · 60 FPS Sweep",
    src: "/videos/guitar-cinematic.mp4",
    poster: "/images/guitar-8k.jpg",
    accent: "#E61438",
  },
  {
    id: "cam-brass",
    label: "CAM 02 // BRASS RESONANCE",
    badge: "HORNS",
    title: "French Horn Acoustic Chamber",
    detail: "Bell Flight · Golden Reflections",
    src: "/videos/brass-cinematic.mp4",
    poster: "/images/cinematic_stage_8k.jpg",
    accent: "#B8860B",
  },
  {
    id: "cam-energy",
    label: "CAM 03 // SONIC ENERGY",
    badge: "KINETIC",
    title: "Soundwaves & Harmonic Shockwave",
    detail: "Acoustic Flow · Frequency Warp",
    src: "/videos/sound-energy.mp4",
    poster: "/images/epic_music_stage_background.jpg",
    accent: "#00B4D8",
  },
];

export default function HeroCinematicBackground() {
  const [activeFeed, setActiveFeed] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"director" | "merged">("merged");
  const [timecode, setTimecode] = useState("00:04:18:14");
  const [dbLevel, setDbLevel] = useState("-3.2 dB");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Ensure all videos play smoothly in sync
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.play().catch(() => {
          // Handled gracefully if browser restricts initial autoplay
        });
      }
    });
  }, [viewMode]);

  // Auto-cycle cameras in Director mode every 8 seconds
  useEffect(() => {
    if (viewMode !== "director") return;
    const timer = setInterval(() => {
      setActiveFeed((prev) => (prev + 1) % VIDEO_FEEDS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [viewMode]);

  // Live broadcast timecode counter and simulated dB meter
  useEffect(() => {
    let frame = 14;
    let sec = 18;
    let min = 4;
    const interval = setInterval(() => {
      frame++;
      if (frame >= 30) {
        frame = 0;
        sec++;
        if (sec >= 60) {
          sec = 0;
          min++;
        }
      }
      const pad = (n: number) => String(n).padStart(2, "0");
      setTimecode(`00:${pad(min)}:${pad(sec)}:${pad(frame)}`);

      // Jitter dB meter
      const jitter = (-1.5 - Math.random() * 4).toFixed(1);
      setDbLevel(`${jitter} dB`);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Parallax mouse tracker
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Video-Like Motion Graphics Canvas: 64-Band Equalizer, Flowing Waveforms & Embers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let audioData: AudioSignal = {
      isPlaying: false,
      rms: 0,
      bass: 0,
      mid: 0,
      high: 0,
      channels: {},
    };

    const unsubscribe = audioBus.subscribe((data) => {
      audioData = data;
    });

    let phase = 0;
    const barCount = 48;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.4 - Math.random() * 0.9,
      size: 1.4 + Math.random() * 2.8,
      color: Math.random() > 0.6 ? "rgba(230, 20, 56, " : Math.random() > 0.3 ? "rgba(212, 160, 56, " : "rgba(0, 180, 216, ",
      alpha: 0.25 + Math.random() * 0.55,
    }));

    const render = () => {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);
      phase += audioData.isPlaying ? 0.045 + audioData.rms * 0.06 : 0.024;

      // ─── 1. Real-Time Equalizer Spectrum Bars (Bottom Stage Video Graphics) ───
      const barWidth = Math.max(3, width / (barCount * 1.8));
      const spacing = barWidth * 0.65;
      const totalW = barCount * (barWidth + spacing);
      const startX = (width - totalW) / 2;
      const baseY = height * 0.88;

      for (let i = 0; i < barCount; i++) {
        const norm = i / barCount;
        const bell = Math.sin(norm * Math.PI);
        const wave = Math.sin(norm * 14 + phase * 1.8) * 0.4 + 0.6;
        const liveBoost = audioData.isPlaying ? audioData.rms * 120 : 0;
        const barH = (18 + bell * 46 * wave + liveBoost * bell) * (0.8 + Math.sin(i * 0.8 + phase * 2) * 0.2);

        const x = startX + i * (barWidth + spacing);
        const y = baseY - barH;

        const grad = ctx.createLinearGradient(0, baseY, 0, y);
        grad.addColorStop(0, "rgba(230, 20, 56, 0.75)");
        grad.addColorStop(0.5, "rgba(212, 160, 56, 0.65)");
        grad.addColorStop(1, "rgba(0, 180, 216, 0.75)");

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barH);

        // Peak cap dot
        ctx.fillStyle = "rgba(230, 20, 56, 0.95)";
        ctx.fillRect(x, y - 3, barWidth, 2);
      }

      // ─── 2. Flowing Audio Waveform Ribbons (Cinematic Light Streams) ───
      const ribbonCount = 3;
      for (let r = 0; r < ribbonCount; r++) {
        ctx.beginPath();
        const baseAmp = 36 + r * 20;
        const amp = audioData.isPlaying ? baseAmp + audioData.rms * 100 : baseAmp;
        const freq = 0.0022 + r * 0.0008;
        const speed = phase * (1.1 + r * 0.4);
        const yOffset = height * (0.45 + r * 0.09);

        ctx.moveTo(0, yOffset);
        for (let x = 0; x <= width; x += 14) {
          const y =
            yOffset +
            Math.sin(x * freq + speed) * amp * Math.cos(x * 0.0012 + speed * 0.45);
          ctx.lineTo(x, y);
        }

        ctx.lineWidth = r === 0 ? 3.5 : 2;
        if (r === 0) {
          ctx.strokeStyle = "rgba(230, 20, 56, 0.55)";
          ctx.shadowColor = "rgba(230, 20, 56, 0.75)";
          ctx.shadowBlur = 18;
        } else if (r === 1) {
          ctx.strokeStyle = "rgba(212, 160, 56, 0.45)";
          ctx.shadowColor = "rgba(212, 160, 56, 0.65)";
          ctx.shadowBlur = 14;
        } else {
          ctx.strokeStyle = "rgba(0, 180, 216, 0.4)";
          ctx.shadowColor = "rgba(0, 180, 216, 0.5)";
          ctx.shadowBlur = 10;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // ─── 3. Pulsating Center Oscilloscope Audio Rings (Behind Headline) ───
      const centerX = width / 2;
      const centerY = height * 0.42;
      const ringCount = 2;
      for (let k = 0; k < ringCount; k++) {
        const ringRadius = 140 + k * 85 + Math.sin(phase * 1.5 + k) * 15 + (audioData.isPlaying ? audioData.rms * 60 : 0);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = k === 0 ? "rgba(230, 20, 56, 0.22)" : "rgba(212, 160, 56, 0.18)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ─── 4. Stage Embers & Rising Harmonic Sparks ───
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* ─── LAYER 1: CINEMATIC MULTI-VIDEO STAGE (MERGED TRIO OR DIRECTOR CUT) ─── */}
      {viewMode === "director" ? (
        /* DIRECTOR CUT: Smooth cross-fade between active videos */
        <div
          style={{
            position: "absolute",
            inset: "-5%",
            width: "110%",
            height: "110%",
          }}
        >
          {VIDEO_FEEDS.map((feed, index) => {
            const isActive = index === activeFeed;
            return (
              <div
                key={feed.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1), transform 8s ease-in-out",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  willChange: "transform, opacity",
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={feed.src}
                  poster={feed.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 40%",
                    filter: "brightness(0.94) contrast(1.15) saturate(1.22)",
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* MERGED TRIO: Triple angled concert video wall matrix with live synchronized streams */
        <div
          className="hero-merged-trio-grid"
          style={{
            position: "absolute",
            inset: "-3%",
            width: "106%",
            height: "106%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "6px",
            background: "#0F1115",
          }}
        >
          {VIDEO_FEEDS.map((feed, index) => {
            const isSelected = index === activeFeed;
            return (
              <div
                key={feed.id}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  border: isSelected
                    ? `2px solid ${feed.accent}`
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: isSelected ? `0 0 30px ${feed.accent}40` : "none",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={feed.src}
                  poster={feed.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                    filter: isSelected
                      ? "brightness(0.96) contrast(1.18) saturate(1.25)"
                      : "brightness(0.85) contrast(1.1) saturate(1.05)",
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                    transition: "all 0.6s ease",
                  }}
                />

                {/* Sub-feed Camera Badge in Merged View */}
                <div
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    left: "1.25rem",
                    zIndex: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.25rem 0.6rem",
                    background: "rgba(15, 17, 21, 0.75)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "20px",
                    border: `1px solid ${feed.accent}60`,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "#FFFFFF",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: feed.accent,
                      boxShadow: `0 0 6px ${feed.accent}`,
                    }}
                  />
                  <span>{feed.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── LAYER 2: Live Concert Motion Graphics Overlays ─── */}

      {/* A. Concert LED Video Wall Matrix Texture (Subtle Jumbotron Micro-Grid) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage:
            "radial-gradient(circle, rgba(0, 0, 0, 0.12) 1px, transparent 1px)",
          backgroundSize: "7px 7px",
          opacity: 0.18,
        }}
      />

      {/* B. Dynamic Video Broadcast Telemetry HUD Graphics */}
      {/* Sleek Floating Broadcast Camera Dock (Bottom-Left) */}
      <div
        className="hero-broadcast-dock-left"
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "2rem",
          zIndex: 12,
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.4rem 0.85rem",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "30px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
          pointerEvents: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
        }}
      >
        {/* Live 4K Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", paddingRight: "0.45rem", borderRight: "1px solid rgba(0,0,0,0.12)" }}>
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#E61438",
              boxShadow: "0 0 8px #E61438",
              animation: "redPulse 1.2s ease-in-out infinite alternate",
            }}
          />
          <span style={{ fontWeight: 800, color: "#E61438", letterSpacing: "0.08em" }}>
            LIVE 4K
          </span>
        </div>

        {/* View Mode Switcher: MERGED vs DIRECTOR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.04)",
            padding: "2px",
            borderRadius: "16px",
            marginRight: "0.35rem",
          }}
        >
          <button
            onClick={() => setViewMode("merged")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 800,
              padding: "3px 9px",
              borderRadius: "14px",
              background: viewMode === "merged" ? "#0F1115" : "transparent",
              color: viewMode === "merged" ? "#FFFFFF" : "#5A5D68",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ☵ MERGED
          </button>
          <button
            onClick={() => setViewMode("director")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 800,
              padding: "3px 9px",
              borderRadius: "14px",
              background: viewMode === "director" ? "var(--red)" : "transparent",
              color: viewMode === "director" ? "#FFFFFF" : "#5A5D68",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ◉ SOLO
          </button>
        </div>

        {/* Camera Selector Pills */}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {VIDEO_FEEDS.map((feed, idx) => (
            <button
              key={feed.id}
              onClick={() => {
                setActiveFeed(idx);
                if (viewMode !== "director") {
                  // Keep merged but focus this camera or switch to director if desired
                }
              }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "15px",
                background: activeFeed === idx ? feed.accent : "transparent",
                color: activeFeed === idx ? "#ffffff" : "#4B5563",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              CAM 0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Timecode & Venue Telemetry (Bottom-Right) */}
      <div
        className="hero-broadcast-dock-right"
        style={{
          position: "absolute",
          bottom: "1.5rem",
          right: "2rem",
          zIndex: 12,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.4rem 0.85rem",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "30px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "#4B5563",
        }}
      >
        <span style={{ fontWeight: 700, color: "#1F242F" }}>TC: {timecode}</span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "12px",
            background: "rgba(212, 160, 56, 0.15)",
            color: "#855A00",
            fontWeight: 700,
            fontSize: "0.62rem",
          }}
        >
          FOH: {dbLevel}
        </span>
      </div>

      {/* ─── LAYER 3: Interactive Video Motion Graphics Canvas (Ribbons, EQ, Waves) ─── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* ─── LAYER 4: Volumetric Concert Laser Beams & Spotlights ─── */}
      <div className="stage-laser-left" />
      <div className="stage-laser-right" />
      <div className="stage-haze-layer" />
      <div className="volumetric-spotlight-left" />
      <div className="volumetric-spotlight-right" />

      {/* ─── LAYER 5: Clean Luminous Translucent White Gradient Overlay ─── */}
      {/* Harmonizes the video with the white theme while guaranteeing 100% headline legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.72) 75%, #FFFFFF 100%)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @media (max-width: 768px) {
          .hero-broadcast-dock-right {
            display: none !important;
          }
          .hero-broadcast-dock-left {
            left: 50% !important;
            transform: translateX(-50%) !important;
            bottom: 0.85rem !important;
            padding: 0.35rem 0.65rem !important;
            gap: 0.4rem !important;
            max-width: calc(100vw - 2rem) !important;
            justify-content: center !important;
          }
          .hero-merged-trio-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
