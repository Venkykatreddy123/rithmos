"use client";

import { useEffect, useRef, useState } from "react";
import { audioBus, AudioSignal } from "@/lib/audioBus";

interface VideoFeed {
  id: string;
  label: string;
  badge: string;
  fileName: string;
  title: string;
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
    title: "Electric Guitar Strings & Fretboard",
    src: "/videos/guitar-cinematic.mp4",
    poster: "/images/guitar-8k.jpg",
    accent: "#E61438",
  },
  {
    id: "cam-brass",
    label: "CAM 02 // CAMERA MOVING",
    badge: "BRASS",
    fileName: "Camera_moving_through_French_horn",
    title: "French Horn Acoustic Interior",
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
    src: "/videos/sound-energy.mp4",
    poster: "/images/epic_music_stage_background.jpg",
    accent: "#00B4D8",
  },
];

export default function HeroCinematicBackground({
  isFullPage = true,
}: {
  isFullPage?: boolean;
}) {
  const [activeFeed, setActiveFeed] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"merged" | "solo">("merged");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [inHero, setInHero] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [timecode, setTimecode] = useState("00:04:18:14");
  const [dbLevel, setDbLevel] = useState("-3.2 dB");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoStageRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, rawX: 0, rawY: 0, targetX: 0, targetY: 0 });
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Mobile viewport detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll tracking to adapt lighting, contrast & HUD visibility across the whole page
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      setInHero(y < 550);
      setScrollProgress(totalH > 0 ? y / totalH : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Autoplay and keep videos synchronized
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  }, [viewMode, activeFeed]);

  // Smooth camera auto-cycle on mobile
  useEffect(() => {
    if (viewMode === "merged" && !isMobile) return;
    const timer = setInterval(() => {
      setActiveFeed((prev) => (prev + 1) % VIDEO_FEEDS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [viewMode, isMobile]);

  // Broadcast timecode & dB counter
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

      const jitter = (-1.8 - Math.random() * 3.5).toFixed(1);
      setDbLevel(`${jitter} dB`);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Smooth Parallax & Mouse Position Tracker
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.rawX = e.clientX;
      mouseRef.current.rawY = e.clientY;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // ─── FULL-PAGE PERSISTENT BACKGROUND MOTION CANVAS ENGINE ──────────────────
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
    const barCount = 52;

    // Organic concert haze puffs
    const smokePuffs = Array.from({ length: 16 }, () => ({
      x: Math.random() * width,
      y: height * 0.55 + Math.random() * (height * 0.4),
      radius: 140 + Math.random() * 160,
      vx: 0.15 + Math.random() * 0.3,
      vy: -0.05 - Math.random() * 0.1,
      alpha: 0.035 + Math.random() * 0.055,
    }));

    // Stage sparks with fluid air resistance
    const sparks = Array.from({ length: 65 }, () => {
      const baseVy = -0.4 - Math.random() * 0.85;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: baseVy,
        baseVy: baseVy,
        size: 1.2 + Math.random() * 2.6,
        color:
          Math.random() > 0.6
            ? "rgba(230, 20, 56, "
            : Math.random() > 0.3
            ? "rgba(184, 134, 11, "
            : "rgba(0, 180, 216, ",
        alpha: 0.35 + Math.random() * 0.5,
      };
    });

    const render = (timeMs: number) => {
      const timeSec = timeMs * 0.001;

      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // ─── 1. STEADICAM JIB FLOAT + 120 BPM SUBWOOFER BASS KICK ───
      const beat = Math.sin(timeSec * Math.PI * 2);
      const subKick = beat > 0.82 ? Math.pow(beat, 6) * 0.016 : 0;
      const liveAudioBoost = audioData.isPlaying ? audioData.rms * 0.035 : 0;
      const totalKickScale = 1.0 + subKick + liveAudioBoost;

      const jibX = Math.sin(timeSec * 0.32) * 9;
      const jibY = Math.cos(timeSec * 0.26) * 7;
      const parallaxX = mouseRef.current.x * -16;
      const parallaxY = mouseRef.current.y * -12;

      if (videoStageRef.current) {
        videoStageRef.current.style.transform = `translate3d(${
          parallaxX + jibX
        }px, ${parallaxY + jibY}px, 0) scale(${totalKickScale})`;
      }

      ctx.clearRect(0, 0, width, height);
      phase += audioData.isPlaying ? 0.048 + audioData.rms * 0.06 : 0.024;

      // ─── 2. INTERACTIVE STAGE FOLLOW-SPOTLIGHT (CURSOR FOCUS) ───
      if (mouseRef.current.rawX > 0 && mouseRef.current.rawY > 0) {
        const spotX = mouseRef.current.rawX;
        const spotY = mouseRef.current.rawY;
        const spotGrad = ctx.createRadialGradient(
          spotX,
          spotY,
          0,
          spotX,
          spotY,
          520
        );
        spotGrad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
        spotGrad.addColorStop(0.35, "rgba(255, 235, 210, 0.05)");
        spotGrad.addColorStop(1, "transparent");
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // ─── 3. ANAMORPHIC HORIZONTAL STAGE FLARE SWEEPS ───
      const flareCycle = (timeSec * 0.28) % (Math.PI * 2);
      const flareY = height * 0.42 + Math.sin(flareCycle) * (height * 0.22);
      const flareIntensity = Math.pow(Math.sin(flareCycle), 4) * 0.42;

      if (flareIntensity > 0.04) {
        const streakGrad = ctx.createLinearGradient(0, flareY, width, flareY);
        streakGrad.addColorStop(0, "transparent");
        streakGrad.addColorStop(0.3, `rgba(230, 20, 56, ${flareIntensity * 0.5})`);
        streakGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareIntensity * 0.95})`);
        streakGrad.addColorStop(0.7, `rgba(184, 134, 11, ${flareIntensity * 0.5})`);
        streakGrad.addColorStop(1, "transparent");

        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, flareY - 1.5, width, 3);

        const haloGrad = ctx.createRadialGradient(
          width * 0.5,
          flareY,
          0,
          width * 0.5,
          flareY,
          180
        );
        haloGrad.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * 0.35})`);
        haloGrad.addColorStop(0.5, `rgba(230, 20, 56, ${flareIntensity * 0.15})`);
        haloGrad.addColorStop(1, "transparent");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(width * 0.5, flareY, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // ─── 4. CONCERT ATMOSPHERIC SMOKE / HAZE DRIFT ───
      smokePuffs.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x - s.radius > width) s.x = -s.radius;
        if (s.y + s.radius < height * 0.4) s.y = height + s.radius * 0.5;

        const grad = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha * 1.5})`);
        grad.addColorStop(0.5, `rgba(240, 240, 245, ${s.alpha * 0.8})`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ─── 5. REAL-TIME 52-BAND EQUALIZER SPECTRUM ───
      const barWidth = Math.max(3, width / (barCount * 1.8));
      const spacing = barWidth * 0.65;
      const totalW = barCount * (barWidth + spacing);
      const startX = (width - totalW) / 2;
      const baseY = height * 0.9;

      for (let i = 0; i < barCount; i++) {
        const norm = i / barCount;
        const bell = Math.sin(norm * Math.PI);
        const wave = Math.sin(norm * 14 + phase * 1.8) * 0.42 + 0.58;
        const liveBoost = audioData.isPlaying ? audioData.rms * 130 : 0;
        const barH =
          (16 + bell * 50 * wave + liveBoost * bell) *
          (0.85 + Math.sin(i * 0.85 + phase * 2) * 0.2);

        const x = startX + i * (barWidth + spacing);
        const y = baseY - barH;

        const grad = ctx.createLinearGradient(0, baseY, 0, y);
        grad.addColorStop(0, "rgba(230, 20, 56, 0.95)");
        grad.addColorStop(0.5, "rgba(184, 134, 11, 0.85)");
        grad.addColorStop(1, "rgba(0, 180, 216, 0.95)");

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barH);

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillRect(x, y - 3, barWidth, 2);
      }

      // ─── 6. AUDIO-REACTIVE WAVEFORM RIBBONS ───
      const ribbonCount = 3;
      for (let r = 0; r < ribbonCount; r++) {
        ctx.beginPath();
        const baseAmp = 38 + r * 22;
        const amp = audioData.isPlaying
          ? baseAmp + audioData.rms * 110
          : baseAmp;
        const freq = 0.0024 + r * 0.0008;
        const speed = phase * (1.1 + r * 0.4);
        const yOffset = height * (0.44 + r * 0.08);

        ctx.moveTo(0, yOffset);
        for (let x = 0; x <= width; x += 12) {
          const y =
            yOffset +
            Math.sin(x * freq + speed) *
              amp *
              Math.cos(x * 0.0012 + speed * 0.45);
          ctx.lineTo(x, y);
        }

        ctx.lineWidth = r === 0 ? 3.5 : 2;
        if (r === 0) {
          ctx.strokeStyle = "rgba(230, 20, 56, 0.85)";
          ctx.shadowColor = "rgba(230, 20, 56, 0.9)";
          ctx.shadowBlur = 18;
        } else if (r === 1) {
          ctx.strokeStyle = "rgba(184, 134, 11, 0.75)";
          ctx.shadowColor = "rgba(184, 134, 11, 0.85)";
          ctx.shadowBlur = 14;
        } else {
          ctx.strokeStyle = "rgba(0, 180, 216, 0.8)";
          ctx.shadowColor = "rgba(0, 180, 216, 0.9)";
          ctx.shadowBlur = 12;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // ─── 7. ACOUSTIC OSCILLOSCOPE CENTER PULSE RINGS ───
      const centerX = width / 2;
      const centerY = height * 0.42;
      for (let k = 0; k < 2; k++) {
        const ringRadius =
          140 +
          k * 90 +
          Math.sin(phase * 1.5 + k) * 16 +
          (audioData.isPlaying ? audioData.rms * 65 : 0);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle =
          k === 0 ? "rgba(230, 20, 56, 0.35)" : "rgba(184, 134, 11, 0.28)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ─── 8. FLUID EMBER PARTICLE TURBULENCE (MOUSE REACTION) ───
      const curMouseX = mouseRef.current.rawX;
      const curMouseY = mouseRef.current.rawY;

      sparks.forEach((p) => {
        if (curMouseX > 0 && curMouseY > 0) {
          const dx = p.x - curMouseX;
          const dy = p.y - curMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const force = (1 - dist / 180) * 3.4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.95;
        p.vy = p.vy * 0.96 + p.baseVy * 0.04;

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

  // Adaptive background opacity based on scroll:
  // - Hero: High contrast, vivid concert video
  // - Body sections: Soft translucent passthrough (so all text & cards are 100% readable)
  // - Final CTA: Intensified stage climax
  const isFinalCTA = scrollProgress > 0.86;
  const overlayBackground = inHero
    ? "radial-gradient(ellipse at 50% 48%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(8, 9, 12, 0.65) 100%)"
    : isFinalCTA
    ? "radial-gradient(ellipse at 50% 50%, rgba(230, 20, 56, 0.18) 0%, rgba(255, 255, 255, 0.5) 45%, rgba(8, 9, 12, 0.85) 100%)"
    : "rgba(255, 255, 255, 0.76)";

  return (
    <div
      style={{
        position: isFullPage ? "fixed" : "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "#08090C",
        transition: "background 0.5s ease",
      }}
    >
      {/* ─── LAYER 1: VIDEO COMPOSITOR WITH STEADICAM JIB + 120 BPM KICK ─── */}
      <div
        ref={videoStageRef}
        style={{
          position: "absolute",
          inset: "-4%",
          width: "108%",
          height: "108%",
          transition: "transform 0.08s ease-out",
          willChange: "transform",
        }}
      >
        {/* DESKTOP: 3x (9:16) Columns = 27:16 Panoramic Widescreen Concert Triptych */}
        <div
          className="hero-desktop-video-wrapper"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          {viewMode === "merged" ? (
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
                          ? "1px solid rgba(255, 255, 255, 0.18)"
                          : "none",
                      boxShadow: isFocused
                        ? `inset 0 0 60px ${feed.accent}45`
                        : "none",
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
                          ? "contrast(1.15) saturate(1.3) brightness(1.05)"
                          : "contrast(1.1) saturate(1.18) brightness(0.96)",
                        transform: isFocused ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.6s ease, filter 0.6s ease",
                      }}
                    />

                    {/* Laser Seam Light Column with Harmonized Cycling Glow */}
                    {index < VIDEO_FEEDS.length - 1 && (
                      <div
                        className="laser-seam-divider"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: "2px",
                          background: `linear-gradient(180deg, transparent 0%, ${feed.accent} 50%, transparent 100%)`,
                          boxShadow: `0 0 16px ${feed.accent}, 0 0 32px ${feed.accent}40`,
                          zIndex: 4,
                        }}
                      />
                    )}

                    {/* Camera Badge Pill (visible in Hero) */}
                    <div
                      style={{
                        position: "absolute",
                        top: "5.5rem",
                        left: "1.5rem",
                        zIndex: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.3rem 0.75rem",
                        background: "rgba(8, 9, 12, 0.85)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        borderRadius: "20px",
                        border: `1px solid ${feed.accent}80`,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.64rem",
                        color: "#FFFFFF",
                        letterSpacing: "0.06em",
                        opacity: inHero ? 1 : 0,
                        transition: "opacity 0.4s ease",
                      }}
                    >
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: feed.accent,
                          boxShadow: `0 0 8px ${feed.accent}`,
                        }}
                      />
                      <span style={{ fontWeight: 700 }}>
                        {feed.badge} // 9:16 NATIVE
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* SOLO 9:16 WITH AMBIENT EXPANSION */
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-15%",
                  filter: "blur(45px) brightness(0.65) saturate(1.3)",
                  transform: "scale(1.15)",
                }}
              >
                <video
                  src={VIDEO_FEEDS[activeFeed].src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  height: "92%",
                  aspectRatio: "9/16",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `2px solid ${VIDEO_FEEDS[activeFeed].accent}`,
                  boxShadow: `0 0 70px ${VIDEO_FEEDS[activeFeed].accent}60`,
                  zIndex: 3,
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* MOBILE: Native 100% Full-Bleed 9:16 Viewport */}
        <div
          className="hero-mobile-video-wrapper"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
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
                  transition: "opacity 0.75s ease, transform 0.75s ease",
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
                    filter: "contrast(1.15) saturate(1.25) brightness(1.02)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── LAYER 2: VOLUMETRIC LIGHT BEAMS ─── */}
      <div
        className="volumetric-light-left"
        style={{
          position: "absolute",
          top: "-20%",
          left: "5%",
          width: "40vw",
          height: "140vh",
          background:
            "linear-gradient(135deg, rgba(230, 20, 56, 0.22) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)",
          transform: `rotate(-22deg) translate3d(${
            mouseRef.current.x * 24
          }px, ${mouseRef.current.y * 18}px, 0)`,
          transformOrigin: "top left",
          mixBlendMode: "screen",
          pointerEvents: "none",
          filter: "blur(28px)",
          animation: "volumetricPulse 8s ease-in-out infinite alternate",
        }}
      />
      <div
        className="volumetric-light-right"
        style={{
          position: "absolute",
          top: "-20%",
          right: "5%",
          width: "40vw",
          height: "140vh",
          background:
            "linear-gradient(-135deg, rgba(184, 134, 11, 0.22) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)",
          transform: `rotate(22deg) translate3d(${
            mouseRef.current.x * -24
          }px, ${mouseRef.current.y * 18}px, 0)`,
          transformOrigin: "top right",
          mixBlendMode: "screen",
          pointerEvents: "none",
          filter: "blur(28px)",
          animation: "volumetricPulse 9s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* ─── LAYER 3: 35MM CINEMATIC FILM GRAIN ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainFilter)' opacity='0.08'/%3E%3C/svg%3E\")",
          opacity: 0.14,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* ─── LAYER 4: CANVAS AUDIO WAVEFORMS, EQUALIZER & FOLLOW-SPOTLIGHT ─── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* ─── LAYER 5: ADAPTIVE READABILITY & CONTRAST OVERLAY (SCROLL-DRIVEN) ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background: overlayBackground,
          transition: "background 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
        }}
      />

      {/* ─── LAYER 6: TELEMETRY HUD DOCK (ACTIVE IN HERO SECTION) ─── */}
      <div
        className="hero-broadcast-dock-left"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "2rem",
          zIndex: 12,
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.4rem 0.85rem",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "30px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.14)",
          pointerEvents: inHero ? "auto" : "none",
          opacity: inHero ? 1 : 0,
          transform: inHero ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
        }}
      >
        {/* LIVE 4K Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            paddingRight: "0.45rem",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#E61438",
              boxShadow: "0 0 10px #E61438",
              animation: "redPulse 1.2s ease-in-out infinite alternate",
            }}
          />
          <span style={{ fontWeight: 800, color: "#E61438", letterSpacing: "0.08em" }}>
            LIVE 4K
          </span>
        </div>

        {/* View Mode Switcher */}
        <div
          className="hidden-on-mobile-dock"
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.05)",
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

        {/* Camera Selector Pills */}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {VIDEO_FEEDS.map((feed, idx) => (
            <button
              key={feed.id}
              onClick={() => setActiveFeed(idx)}
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

      {/* Telemetry FOH dB & Timecode */}
      <div
        className="hero-broadcast-dock-right"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "2rem",
          zIndex: 12,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.4rem 0.85rem",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "30px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.14)",
          pointerEvents: "none",
          opacity: inHero ? 1 : 0,
          transform: inHero ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "#4B5563",
        }}
      >
        <span style={{ fontWeight: 700, color: "#0F1115" }}>TC: {timecode}</span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "12px",
            background: "rgba(184, 134, 11, 0.18)",
            color: "#855A00",
            fontWeight: 800,
            fontSize: "0.62rem",
          }}
        >
          FOH: {dbLevel}
        </span>
      </div>

      <style>{`
        @keyframes volumetricPulse {
          0% { opacity: 0.7; transform: rotate(-22deg) scale(0.96); }
          100% { opacity: 1.0; transform: rotate(-18deg) scale(1.04); }
        }

        @keyframes seamGlowPulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .laser-seam-divider {
          animation: seamGlowPulse 3s ease-in-out infinite;
        }

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
      `}</style>
    </div>
  );
}
