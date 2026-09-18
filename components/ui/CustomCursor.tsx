"use client";

import { useEffect, useRef, useState } from "react";
import { audioBus } from "@/lib/audioBus";

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [audioScale, setAudioScale] = useState(1);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const unsub = audioBus.subscribe((data) => {
      setIsAudioActive(data.isPlaying);
      if (data.isPlaying) {
        setAudioScale(1 + data.rms * 0.8);
      } else {
        setAudioScale(1);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    // Only enable on non-touch pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check hover on interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a") ||
          target.closest("button") ||
          target.closest(".card-stage") ||
          target.closest("[role='button']") ||
          target.closest("input") ||
          target.closest("select")
        );
        setIsHovering(isInteractive);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    };

    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const renderLoop = () => {
      // Smooth lerp for outer ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Center Laser Dot */}
      <div
        ref={cursorDotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "12px" : "6px",
          height: isHovering ? "12px" : "6px",
          marginLeft: isHovering ? "-6px" : "-3px",
          marginTop: isHovering ? "-6px" : "-3px",
          borderRadius: "50%",
          backgroundColor: isHovering ? "var(--red)" : isAudioActive ? "#00AA44" : "var(--red)",
          boxShadow: isHovering
            ? "0 0 15px var(--red), 0 0 25px var(--red)"
            : isAudioActive
            ? "0 0 15px #00AA44, 0 0 30px #00AA44"
            : "0 0 10px var(--red)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease, opacity 0.2s ease",
        }}
      />

      {/* Trailing Laser Ring with Audio Reactive Pulsing */}
      <div
        ref={cursorRingRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "52px" : isClicking ? "22px" : `${34 * audioScale}px`,
          height: isHovering ? "52px" : isClicking ? "22px" : `${34 * audioScale}px`,
          marginLeft: isHovering ? "-26px" : isClicking ? "-11px" : `${-17 * audioScale}px`,
          marginTop: isHovering ? "-26px" : isClicking ? "-11px" : `${-17 * audioScale}px`,
          borderRadius: "50%",
          border: `1.5px solid ${
            isHovering
              ? "rgba(230, 20, 56, 0.85)"
              : isAudioActive
              ? "rgba(0, 170, 68, 0.8)"
              : "rgba(230, 20, 56, 0.6)"
          }`,
          boxShadow: isHovering
            ? "0 0 20px rgba(230, 20, 56, 0.4), inset 0 0 10px rgba(230, 20, 56, 0.15)"
            : isAudioActive
            ? "0 0 25px rgba(0, 170, 68, 0.35), inset 0 0 8px rgba(0, 170, 68, 0.15)"
            : "0 0 12px rgba(230, 20, 56, 0.25)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: isVisible ? 1 : 0,
          transition: "border-color 0.2s ease, opacity 0.2s ease",
        }}
      />

      {/* Soundwave Shockwaves on Click */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            position: "fixed",
            top: ripple.y,
            left: ripple.x,
            width: "10px",
            height: "10px",
            marginLeft: "-5px",
            marginTop: "-5px",
            borderRadius: "50%",
            border: `2px solid ${isAudioActive ? "#00FF66" : "var(--red)"}`,
            boxShadow: `0 0 15px ${isAudioActive ? "#00FF66" : "var(--red)"}`,
            pointerEvents: "none",
            zIndex: 99997,
            animation: "cursor-ripple 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
          }}
        />
      ))}

      <style>{`
        @keyframes cursor-ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(8);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
