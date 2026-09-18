"use client";

import { useEffect, useRef, useState } from "react";

interface VideoFeed {
  id: string;
  src: string;
  poster: string;
}

const VIDEO_FEEDS: VideoFeed[] = [
  {
    id: "cam-guitar",
    src: "/videos/guitar-cinematic.mp4",
    poster: "/images/guitar-8k.jpg",
  },
  {
    id: "cam-brass",
    src: "/videos/brass-cinematic.mp4",
    poster: "/images/cinematic_stage_8k.jpg",
  },
  {
    id: "cam-energy",
    src: "/videos/sound-energy.mp4",
    poster: "/images/epic_music_stage_background.jpg",
  },
];

export default function HeroCinematicBackground({
  isFullPage = true,
}: {
  isFullPage?: boolean;
}) {
  const [activeFeed, setActiveFeed] = useState<number>(0);
  const [inHero, setInHero] = useState<boolean>(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Scroll tracking — simple hero vs body detection
  useEffect(() => {
    const handleScroll = () => {
      setInHero(window.scrollY < 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth auto-crossfade between video feeds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeed((prev) => (prev + 1) % VIDEO_FEEDS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Keep all videos playing and synced
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  }, [activeFeed]);

  return (
    <div
      style={{
        position: isFullPage ? "fixed" : "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* ─── VIDEO LAYER: Smooth Crossfade Between 3 Cinematic Feeds ─── */}
      <div
        style={{
          position: "absolute",
          inset: "-2%",
          width: "104%",
          height: "104%",
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
                transition: "opacity 1.8s ease-in-out",
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
                  filter: "brightness(0.75) contrast(1.1) saturate(1.15)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ─── GRADIENT OVERLAY: Ensures crystal clear text readability ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: inHero
            ? `linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.35) 0%,
                rgba(0, 0, 0, 0.15) 30%,
                rgba(0, 0, 0, 0.1) 50%,
                rgba(0, 0, 0, 0.25) 80%,
                rgba(0, 0, 0, 0.5) 100%
              )`
            : "rgba(255, 255, 255, 0.88)",
          transition: "background 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
        }}
      />

      {/* ─── SUBTLE RADIAL VIGNETTE: Cinematic frame focus ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background: inHero
            ? "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0, 0, 0, 0.4) 100%)"
            : "none",
          transition: "background 0.8s ease",
          pointerEvents: "none",
        }}
      />

      {/* ─── SUBTLE VOLUMETRIC LIGHT BEAMS (CSS only, no canvas) ─── */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "10%",
          width: "35vw",
          height: "130vh",
          background:
            "linear-gradient(155deg, rgba(230, 20, 56, 0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
          opacity: inHero ? 0.7 : 0,
          transition: "opacity 1s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "10%",
          width: "35vw",
          height: "130vh",
          background:
            "linear-gradient(-155deg, rgba(184, 134, 11, 0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
          opacity: inHero ? 0.7 : 0,
          transition: "opacity 1s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ─── MINIMAL FILM GRAIN ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainFilter)' opacity='0.06'/%3E%3C/svg%3E\")",
          opacity: 0.08,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* ─── BOTTOM GRADIENT FADE (Smooth transition to white sections) ─── */}
      {!inHero && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30vh",
            background: "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.95))",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
