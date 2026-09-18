"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { audioBus, AudioSignal } from "@/lib/audioBus";

/* ─── Parallax Camera Controller ─────────────────────────────────────────── */
function SceneController({ mousePos }: { mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mousePos.current.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (-mousePos.current.y * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Ambient Stage Spotlights ───────────────────────────────────────────── */
function ConcertBeams() {
  const leftBeam = useRef<THREE.SpotLight>(null);
  const rightBeam = useRef<THREE.SpotLight>(null);
  const audioDataRef = useRef<AudioSignal>({
    isPlaying: false, rms: 0, bass: 0, mid: 0, high: 0, channels: {}
  });

  useEffect(() => {
    return audioBus.subscribe((data) => {
      audioDataRef.current = data;
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const isPlaying = audioDataRef.current.isPlaying;
    const rms = audioDataRef.current.rms || 0;
    const speed = isPlaying ? 1.4 : 0.8;

    if (leftBeam.current) {
      leftBeam.current.target.position.x = -3 + Math.sin(t * speed) * 3;
      leftBeam.current.target.position.y = -1.5;
      leftBeam.current.target.updateMatrixWorld();
      leftBeam.current.intensity = isPlaying ? 3.5 + rms * 2 : 2.0;
    }
    if (rightBeam.current) {
      rightBeam.current.target.position.x = 3 - Math.sin(t * (speed * 0.9)) * 3;
      rightBeam.current.target.position.y = -1.5;
      rightBeam.current.target.updateMatrixWorld();
      rightBeam.current.intensity = isPlaying ? 3.5 + rms * 2 : 2.0;
    }
  });

  return (
    <>
      <spotLight
        ref={leftBeam}
        position={[-9, 8, 2]}
        angle={0.35}
        penumbra={0.9}
        intensity={2.2}
        color="#E61438"
        distance={30}
      />
      <spotLight
        ref={rightBeam}
        position={[9, 8, 2]}
        angle={0.35}
        penumbra={0.9}
        intensity={2.2}
        color="#D4A038"
        distance={30}
      />
    </>
  );
}

/* ─── Subtle Concert Embers ──────────────────────────────────────────────── */
function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const audioDataRef = useRef<AudioSignal>({
    isPlaying: false, rms: 0, bass: 0, mid: 0, high: 0, channels: {}
  });

  useEffect(() => {
    return audioBus.subscribe((data) => {
      audioDataRef.current = data;
    });
  }, []);

  const PARTICLE_COUNT = 450;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const redColor = new THREE.Color("#E61438");
    const goldColor = new THREE.Color("#D4A038");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;

      const rand = Math.random();
      const color = rand < 0.65 ? redColor : goldColor;
      col[i * 3]     = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const isPlaying = audioDataRef.current.isPlaying;
    const rms = audioDataRef.current.rms || 0;

    const rotSpeed = isPlaying ? 0.04 + rms * 0.04 : 0.02;
    pointsRef.current.rotation.y = t * rotSpeed;

    const posArr = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArr[i * 3 + 1] += 0.005;
      if (posArr[i * 3 + 1] > 7) posArr[i * 3 + 1] = -7;
    }
    (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#E61438"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Main Hero Canvas Component ─────────────────────────────────────────── */
interface HeroCanvasProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function HeroCanvas({ scrollProgress }: HeroCanvasProps) {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Canvas
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
      camera={{ position: [0, 0, 9], fov: 52 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
      }}
    >
      <SceneController mousePos={mousePos} />

      <ambientLight intensity={0.9} color="#FFFFFF" />
      <ConcertBeams />
      <pointLight position={[0, 0, 4]} intensity={1.0} color="#E61438" />

      {/* Subtle Concert Embers */}
      <ParticleField scrollProgress={scrollProgress} />
    </Canvas>
  );
}
