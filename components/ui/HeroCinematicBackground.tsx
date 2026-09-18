"use client";

import { useEffect, useRef, useState } from "react";
import { audioBus, AudioSignal } from "@/lib/audioBus";

interface VideoFeed {
  id: string;
  label: string;
  badge: string;
  fileName: string;
  title: string;
  detail: string;
  src: string;
  poster: string;
  accent: string;
}

const VIDEO_FEEDS: VideoFeed[] = [
  {
    id: "cam-guitar",
    label: "CAM 01 // CAMERA MOVES",
    badge: "GUITAR",
    fileName: "Camera_moves_along_electric_guitar",
    title: "Camera Moves Along Electric Guitar",
    detail: "Macro Strings & Fretboard · 9:16 Native",
    src: "/videos/guitar-cinematic.mp4",
    poster: "/images/guitar-8k.jpg",
    accent: "#E61438",
  },
  {
    id: "cam-brass",
    label: "CAM 02 // CAMERA MOVING",
    badge: "BRASS",
    fileName: "Camera_moving_through_French_horn",
    title: "Camera Moving Through French Horn",
    detail: "Acoustic Golden Bell Flight · 9:16 Native",
    src: "/videos/brass-cinematic.mp4",
    poster: "/images/cinematic_stage_8k.jpg",
    accent: "#B8860B",
  },
  {
    id: "cam-energy",
    label: "CAM 03 // SOUND ENERGY",
    badge: "ENERGY",
    fileName: "Sound_energy_traveling_through",
    title: "Sound Energy Traveling Through Instrument",
    detail: "Harmonic Acoustic Shockwave · 9:16 Native",
    src: "/videos/sound-energy.mp4",
    poster: "/images/epic_music_stage_background.jpg",
    accent: "#00B4D8",
  },
];

export default function HeroCinematicBackground() {
  const [activeFeed, setActiveFeed] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"merged" | "solo">("merged");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [timecode, setTimecode] = useState("00:04:18:14");
  const [dbLevel, setDbLevel] = useState("-3.2 dB");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Detect mobile viewport for tailored ratio conversion
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
  }, [viewMode, activeFeed]);

  // Auto-cycle cameras smoothly every 7 seconds on mobile or in solo mode
  useEffect(() => {
    if (viewMode === "merged" && !isMobile) return;
    const timer = setInterval(() => {
      setActiveFeed((prev) => (prev + 1) % VIDEO_FEEDS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [viewMode, isMobile]);

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

  // Video-Like Motion Graphics Canvas: 48-Band Equalizer, Harmonic Light Ribbons & Embers
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
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.4 - Math.random() * 0.9,
      size: 1.4 + Math.random() * 2.8,
      color:
        Math.random() > 0.6
          ? "rgba(230, 20, 56, "
          : Math.random() > 0.3
          ? "rgba(184, 134, 11, "
          : "rgba(0, 180, 216, ",
      alpha: 0.25 + Math.random() * 0.55,
    }));

    const render = () => {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);
      phase += audioData.isPlaying ? 0.045 + audioData.rms * 0.06 : 0.024;

      // ─── 1. Real-Time Equalizer Spectrum Bars (Stage Base) ───
      const barWidth = Math.max(3, width / (barCount * 1.8));
      const spacing = barWidth * 0.65;
      const totalW = barCount * (barWidth + spacing);
      const startX = (width - totalW) / 2;
      const baseY = height * 0.89;

      for (let i = 0; i < barCount; i++) {
        const norm = i / barCount;
        const bell = Math.sin(norm * Math.PI);
        const wave = Math.sin(norm * 14 + phase * 1.8) * 0.4 + 0.6;
        const liveBoost = audioData.isPlaying ? audioData.rms * 120 : 0;
        const barH =
          (18 + bell * 46 * wave + liveBoost * bell) *
          (0.8 + Math.sin(i * 0.8 + phase * 2) * 0.2);

        const x = startX + i * (barWidth + spacing);
        const y = baseY - barH;

        const grad = ctx.createLinearGradient(0, baseY, 0, y);
        grad.addColorStop(0, "rgba(230, 20, 56, 0.85)");
        grad.addColorStop(0.5, "rgba(184, 134, 11, 0.75)");
        grad.addColorStop(1, "rgba(0, 180, 216, 0.85)");

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
          ctx.strokeStyle = "rgba(230, 20, 56, 0.6)";
          ctx.shadowColor = "rgba(230, 20, 56, 0.8)";
          ctx.shadowBlur = 18;
        } else if (r === 1) {
          ctx.strokeStyle = "rgba(184, 134, 11, 0.55)";
          ctx.shadowColor = "rgba(184, 134, 11, 0.7)";
          ctx.shadowBlur = 14;
        } else {
          ctx.strokeStyle = "rgba(0, 180, 216, 0.5)";
          ctx.shadowColor = "rgba(0, 180, 216, 0.6)";
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
        const ringRadius =
          140 +
          k * 85 +
          Math.sin(phase * 1.5 + k) * 15 +
          (audioData.isPlaying ? audioData.rms * 60 : 0);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle =
          k === 0 ? "rgba(230, 20, 56, 0.25)" : "rgba(184, 134, 11, 0.2)";
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
        background: "#0F1115",
      }}
    >
      {/* ─── LAYER 1: VIDEO COMPOSITOR (DESKTOP 27:16 TRIPTYCH & MOBILE 9:16 NATIVE) ─── */}

      {/* A. DESKTOP LAYOUT: 3x (9:16) Columns = 27:16 Widescreen Panoramic Stage Wall */}
      <div
        className="hero-desktop-video-wrapper"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          transition: "opacity 0.6s ease",
        }}
      >
        {viewMode === "merged" ? (
          /* MERGED 3-COLUMN PANORAMIC TRIPTYCH */
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "stretch",
            }}
          >
            {VIDEO_FEEDS.map((feed, index) => {
              const isFocused = activeFeed === index;
              return (
                <div
                  key={feed.id}
                  style={{
                    position: "relative",
                    flex: isFocused ? 1.15 : 1,
                    height: "100%",
                    overflow: "hidden",
                    borderRight:
                      index < VIDEO_FEEDS.length - 1
                        ? "2px solid rgba(255, 255, 255, 0.12)"
                        : "none",
                    boxShadow: isFocused ? `inset 0 0 40px ${feed.accent}30` : "none",
                    transition: "flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
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
                      filter: isFocused
                        ? "brightness(0.96) contrast(1.18) saturate(1.28)"
                        : "brightness(0.86) contrast(1.12) saturate(1.08)",
                      transform: isFocused ? "scale(1.03)" : "scale(1)",
                      transition: "transform 0.6s ease, filter 0.6s ease",
                    }}
                  />

                  {/* Laser Seam Light Column Divider */}
                  {index < VIDEO_FEEDS.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: "2px",
                        background: `linear-gradient(180deg, transparent 0%, ${feed.accent} 50%, transparent 100%)`,
                        boxShadow: `0 0 12px ${feed.accent}`,
                        zIndex: 4,
                      }}
                    />
                  )}

                  {/* Desktop Camera Label Chip */}
                  <div
                    style={{
                      position: "absolute",
                      top: "5.5rem",
                      left: "1.5rem",
                      zIndex: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.25rem 0.65rem",
                      background: "rgba(15, 17, 21, 0.8)",
                      backdropFilter: "blur(12px)",
                      borderRadius: "18px",
                      border: `1px solid ${feed.accent}70`,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "#FFFFFF",
                      letterSpacing: "0.06em",
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
                    <span>{feed.badge} // 9:16</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* SOLO FOCUS WITH AMBIENT RATIO EXTENSION (No 300% crop stretch!) */
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Ambient Blurred Full-Bleed 16:9 Backdrop */}
            <div
              style={{
                position: "absolute",
                inset: "-10%",
                width: "120%",
                height: "120%",
                filter: "blur(40px) brightness(0.7)",
                opacity: 0.65,
                transform: "scale(1.1)",
              }}
            >
              <video
                src={VIDEO_FEEDS[activeFeed].src}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Sharp Uncropped 9:16 Framed Video */}
            <div
              style={{
                position: "relative",
                height: "92%",
                aspectRatio: "9/16",
                borderRadius: "20px",
                overflow: "hidden",
                border: `2px solid ${VIDEO_FEEDS[activeFeed].accent}`,
                boxShadow: `0 0 60px ${VIDEO_FEEDS[activeFeed].accent}50, 0 20px 40px rgba(0,0,0,0.5)`,
                zIndex: 3,
                animation: "soloZoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <video
                src={VIDEO_FEEDS[activeFeed].src}
                poster={VIDEO_FEEDS[activeFeed].poster}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* B. MOBILE LAYOUT: Full-Screen Native 9:16 Viewport Matching Phone Screen */}
      <div
        className="hero-mobile-video-wrapper"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "none",
        }}
      >
        {VIDEO_FEEDS.map((feed, index) => {
          const isActive = activeFeed === index;
          return (
            <div
              key={feed.id}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scale(1)" : "scale(1.04)",
                transition: "opacity 0.8s ease-in-out, transform 0.8s ease-in-out",
                willChange: "opacity, transform",
              }}
            >
              <video
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
                  filter: "brightness(0.95) contrast(1.15) saturate(1.22)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ─── LAYER 2: Stage Motion Graphics & LED Grid Texture ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage:
            "radial-gradient(circle, rgba(0, 0, 0, 0.12) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />

      {/* ─── LAYER 3: Audio Spectrum Waves, Equalizer & Embers Canvas ─── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* ─── LAYER 4: Dynamic Stage Spotlight Beams ─── */}
      <div className="stage-laser-left" />
      <div className="stage-laser-right" />
      <div className="stage-haze-layer" />
      <div className="volumetric-spotlight-left" />
      <div className="volumetric-spotlight-right" />

      {/* ─── LAYER 5: Luminous White Radial Overlay (Ensures 100% Text Legibility) ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.64) 45%, rgba(255,255,255,0.48) 75%, #FFFFFF 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ─── LAYER 6: Telemetry HUD Dock (Desktop & Mobile Tailored) ─── */}
      {/* Bottom-Left Controls Dock */}
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
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "30px",
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
          pointerEvents: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
        }}
      >
        {/* Live 4K Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            paddingRight: "0.45rem",
            borderRight: "1px solid rgba(0,0,0,0.12)",
          }}
        >
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

        {/* Desktop View Mode Switcher: MERGED vs SOLO */}
        <div
          className="hidden-on-mobile-dock"
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
            ☵ MERGED 27:16
          </button>
          <button
            onClick={() => setViewMode("solo")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 800,
              padding: "3px 9px",
              borderRadius: "14px",
              background: viewMode === "solo" ? "var(--red)" : "transparent",
              color: viewMode === "solo" ? "#FFFFFF" : "#5A5D68",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ◉ SOLO 9:16
          </button>
        </div>

        {/* Camera Selector Pills (Guitar, Horn, Sound Energy) */}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {VIDEO_FEEDS.map((feed, idx) => (
            <button
              key={feed.id}
              onClick={() => {
                setActiveFeed(idx);
              }}
              title={feed.title}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: "15px",
                background: activeFeed === idx ? feed.accent : "transparent",
                color: activeFeed === idx ? "#ffffff" : "#4B5563",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {feed.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom-Right Timecode & Telemetry */}
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
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "30px",
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
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
            background: "rgba(184, 134, 11, 0.15)",
            color: "#855A00",
            fontWeight: 700,
            fontSize: "0.62rem",
          }}
        >
          FOH: {dbLevel}
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-desktop-video-wrapper {
            display: none !important;
          }
          .hero-mobile-video-wrapper {
            display: block !important;
          }
          .hero-broadcast-dock-right {
            display: none !important;
          }
          .hidden-on-mobile-dock {
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
        }
        @keyframes soloZoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
