"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { audioBus, AudioSignal } from "@/lib/audioBus";

const CAMERA_FEEDS = [
  {
    id: "cam-1",
    label: "CAM 01 // MAIN STAGE",
    detail: "Full Live Band • Dynamic Rig Feed",
    src: "/images/band.jpg",
    alt: "Live Indian Rock Band performing with lead singer, guitarist and drummer",
  },
  {
    id: "cam-2",
    label: "CAM 02 // LEAD GUITAR",
    detail: "Solo Shred • Red Floodlight Trusses",
    src: "/images/hero.jpg",
    alt: "Lead rock guitarist rocking out on stage under stadium spotlights",
  },
  {
    id: "cam-3",
    label: "CAM 03 // ARENA CROWD",
    detail: "12,000+ Capacity • Laser Matrix",
    src: "/images/audience.jpg",
    alt: "Massive stadium festival concert crowd with phone torches and laser beams",
  },
  {
    id: "cam-4",
    label: "CAM 04 // JUMBOTRON ARENA",
    detail: "8K Stadium Architecture • Curved Screens",
    src: "/images/cinematic_stage_8k.jpg",
    alt: "8K stadium arena concert stage with massive curved LED backdrop",
  },
];

export default function HeroCinematicBackground() {
  const [activeFeed, setActiveFeed] = useState(0);
  const [timecode, setTimecode] = useState("00:04:18:14");
  const [dbLevel, setDbLevel] = useState("-3.2 dB");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Auto-switch broadcast camera feeds every 7 seconds for dynamic video-montage feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeed((prev) => (prev + 1) % CAMERA_FEEDS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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

  // Video-Like Motion Graphics Canvas: 64-Band Equalizer, Audio Waveforms & Embers
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
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.4 - Math.random() * 0.8,
      size: 1.2 + Math.random() * 2.8,
      color: Math.random() > 0.4 ? "rgba(230, 20, 56, " : "rgba(212, 160, 56, ",
      alpha: 0.25 + Math.random() * 0.55,
    }));

    const render = () => {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);
      phase += audioData.isPlaying ? 0.045 + audioData.rms * 0.06 : 0.022;

      // ─── 1. Real-Time Equalizer Spectrum Bars (Bottom Stage Video Graphics) ───
      const barWidth = Math.max(3, width / (barCount * 1.8));
      const spacing = barWidth * 0.65;
      const totalW = barCount * (barWidth + spacing);
      const startX = (width - totalW) / 2;
      const baseY = height * 0.88;

      for (let i = 0; i < barCount; i++) {
        // Curve frequency distribution
        const norm = i / barCount;
        const bell = Math.sin(norm * Math.PI);
        const wave = Math.sin(norm * 14 + phase * 1.8) * 0.4 + 0.6;
        const liveBoost = audioData.isPlaying ? audioData.rms * 120 : 0;
        const barH = (18 + bell * 45 * wave + liveBoost * bell) * (0.8 + Math.sin(i * 0.8 + phase * 2) * 0.2);

        const x = startX + i * (barWidth + spacing);
        const y = baseY - barH;

        const grad = ctx.createLinearGradient(0, baseY, 0, y);
        grad.addColorStop(0, "rgba(230, 20, 56, 0.75)");
        grad.addColorStop(0.6, "rgba(212, 160, 56, 0.6)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0.85)");

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barH);

        // Peak cap dot
        ctx.fillStyle = "rgba(230, 20, 56, 0.9)";
        ctx.fillRect(x, y - 3, barWidth, 2);
      }

      // ─── 2. Flowing Audio Waveform Ribbons (Cinematic Light Streams) ───
      const ribbonCount = 3;
      for (let r = 0; r < ribbonCount; r++) {
        ctx.beginPath();
        const baseAmp = 38 + r * 22;
        const amp = audioData.isPlaying ? baseAmp + audioData.rms * 100 : baseAmp;
        const freq = 0.0024 + r * 0.0009;
        const speed = phase * (1.1 + r * 0.4);
        const yOffset = height * (0.46 + r * 0.08);

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
          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // ─── 3. Pulsating Center Oscilloscope Audio Rings (Behind Headline) ───
      const centerX = width / 2;
      const centerY = height * 0.42;
      const ringCount = 2;
      for (let k = 0; k < ringCount; k++) {
        const ringRadius = 140 + k * 80 + Math.sin(phase * 1.5 + k) * 15 + (audioData.isPlaying ? audioData.rms * 60 : 0);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = k === 0 ? "rgba(230, 20, 56, 0.22)" : "rgba(212, 160, 56, 0.18)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ─── 4. Stage Embers & Rising Fire Sparks ───
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
      {/* ─── LAYER 1: Real Concert Video Feeds (Smooth Cross-fade & Ken Burns Push) ─── */}
      <div
        style={{
          position: "absolute",
          inset: "-5%",
          width: "110%",
          height: "110%",
        }}
      >
        {CAMERA_FEEDS.map((feed, index) => {
          const isActive = index === activeFeed;
          return (
            <div
              key={feed.id}
              style={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: "opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isActive ? "scale(1.06)" : "scale(1)",
                transitionProperty: "opacity, transform",
                transitionDuration: "1.6s, 8s",
                transitionTimingFunction: "ease-in-out",
                willChange: "transform, opacity",
              }}
            >
              <Image
                src={feed.src}
                alt={feed.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                style={{
                  objectFit: "cover",
                  objectPosition: index === 0 ? "center 42%" : "center 35%",
                  filter: "brightness(0.92) contrast(1.18) saturate(1.2)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ─── LAYER 2: Live Concert Motion Graphics Overlays ─── */}

      {/* A. Concert LED Video Wall Matrix Texture (Subtle Jumbotron Micro-Grid) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage:
            "radial-gradient(circle, rgba(0, 0, 0, 0.15) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
          opacity: 0.15,
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
          gap: "0.7rem",
          padding: "0.4rem 0.85rem",
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "30px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          pointerEvents: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
        }}
      >
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

        <div style={{ display: "flex", gap: "0.25rem" }}>
          {CAMERA_FEEDS.map((feed, idx) => (
            <button
              key={feed.id}
              onClick={() => setActiveFeed(idx)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "15px",
                background: activeFeed === idx ? "var(--red)" : "transparent",
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
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "30px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
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
      {/* Blends the video into the white theme while guaranteeing 100% headline legibility */}
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
        }
      `}</style>
    </div>
  );
}
