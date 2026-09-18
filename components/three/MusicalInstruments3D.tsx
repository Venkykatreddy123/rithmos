"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { audioBus, AudioSignal } from "@/lib/audioBus";

/* ─── 1. 3D Electric Guitar (Left Stage Flank) ───────────────────────────── */
export function Guitar3D({
  position = [-4.6, 0.4, -1.2],
  rotation = [0.25, 0.6, -0.35],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const stringsMatRef = useRef<THREE.MeshBasicMaterial[]>([]);
  const audioDataRef = useRef<AudioSignal>({
    isPlaying: false, rms: 0, bass: 0, mid: 0, high: 0, channels: {}
  });

  useEffect(() => {
    return audioBus.subscribe((data) => {
      audioDataRef.current = data;
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const gEnergy = audioDataRef.current.channels?.guitar || 0;
    const isPlaying = audioDataRef.current.isPlaying;

    const pulse = isPlaying ? 1 + gEnergy * 0.18 : 1;
    groupRef.current.scale.set(0.95 * pulse, 0.95 * pulse, 0.95 * pulse);

    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.7) * 0.18 + (isPlaying ? Math.sin(t * 10) * gEnergy * 0.09 : 0);
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.5) * 0.12;

    stringsMatRef.current.forEach((mat, idx) => {
      if (mat) {
        if (isPlaying && gEnergy > 0.25) {
          mat.color.setHex(idx < 2 ? 0xFFE082 : 0x00E5FF);
        } else {
          mat.color.setHex(idx < 2 ? 0xD4A038 : 0xFFFFFF);
        }
      }
    });
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.45}>
      <group ref={groupRef} position={position} rotation={rotation} scale={0.95}>
        {/* Guitar Body Main */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[1.4, 1.8, 0.18]} />
          <meshStandardMaterial
            color="#E61438"
            emissive="#8A0B20"
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.8}
          />
        </mesh>

        {/* Lower Bout / Contours */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.75, 0.85, 0.6, 24]} />
          <meshStandardMaterial
            color="#C8102E"
            emissive="#750718"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.75}
          />
        </mesh>

        {/* Pickguard (Dark Obsidian) */}
        <mesh position={[0.15, -0.5, 0.1]}>
          <boxGeometry args={[0.9, 1.1, 0.02]} />
          <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Dual Humbucker Pickups */}
        {[-0.25, 0.25].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset - 0.5, 0.11]}>
            <boxGeometry args={[0.7, 0.22, 0.04]} />
            <meshStandardMaterial color="#E2DFD6" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Guitar Neck */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.22, 2.5, 0.14]} />
          <meshStandardMaterial color="#2A1B0E" roughness={0.4} />
        </mesh>

        {/* Fretboard & Frets */}
        <mesh position={[0, 1.5, 0.075]}>
          <boxGeometry args={[0.24, 2.45, 0.02]} />
          <meshStandardMaterial color="#111111" roughness={0.3} />
        </mesh>

        {/* Headstock */}
        <mesh position={[0, 2.95, -0.05]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.34, 0.6, 0.12]} />
          <meshStandardMaterial color="#E61438" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* 6 Glowing Metallic Strings */}
        {[-0.08, -0.05, -0.02, 0.02, 0.05, 0.08].map((xOffset, i) => (
          <mesh key={i} position={[xOffset, 0.8, 0.09]}>
            <cylinderGeometry args={[0.006, 0.006, 3.8, 8]} />
            <meshBasicMaterial
              ref={(el) => { if (el) stringsMatRef.current[i] = el; }}
              color={i < 2 ? "#D4A038" : "#FFFFFF"}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── 2. 3D Drum Cymbal & Snare (Right Stage Flank) ───────────────────────── */
export function DrumKitPiece3D({
  position = [4.6, 0.8, -1.3],
  rotation = [0.55, -0.5, 0.3],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const snareRef = useRef<THREE.Mesh>(null);
  const audioDataRef = useRef<AudioSignal>({
    isPlaying: false, rms: 0, bass: 0, mid: 0, high: 0, channels: {}
  });

  useEffect(() => {
    return audioBus.subscribe((data) => {
      audioDataRef.current = data;
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const dEnergy = audioDataRef.current.channels?.drums || 0;
    const isPlaying = audioDataRef.current.isPlaying;

    groupRef.current.rotation.y = t * (isPlaying ? 0.5 + dEnergy * 0.9 : 0.4);
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 1.5) * 0.05 + (isPlaying ? Math.sin(t * 16) * dEnergy * 0.14 : 0);

    if (snareRef.current && isPlaying) {
      const snap = 1 + dEnergy * 0.12;
      snareRef.current.scale.set(snap, 1, snap);
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.4}>
      <group ref={groupRef} position={position} rotation={rotation} scale={0.95}>
        {/* Bronze Crash / Ride Cymbal */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.4, 1.45, 0.03, 36]} />
          <meshStandardMaterial
            color="#D4A038"
            emissive="#8B6514"
            emissiveIntensity={0.45}
            roughness={0.15}
            metalness={0.95}
          />
        </mesh>

        {/* Center Bell */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#FAD36E"
            emissive="#D4A038"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.98}
          />
        </mesh>

        {/* Lathing Acoustic Groove Rings */}
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial color="#FFE082" transparent opacity={0.5} />
        </mesh>

        {/* Snare Drum Component Below */}
        <mesh ref={snareRef} position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.5, 32]} />
          <meshStandardMaterial color="#15151A" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Snare Chrome Rims */}
        {[-0.26, 0.26].map((yOffset, i) => (
          <mesh key={i} position={[0, -1.2 + yOffset, 0]}>
            <torusGeometry args={[0.82, 0.03, 16, 32]} />
            <meshStandardMaterial color="#E2DFD6" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── 3. 3D Stage Sub-Woofer Stack (Lower Left Flank) ─────────────────────── */
export function StageSubWoofer3D({
  position = [-4.4, -2.1, -1.5],
  rotation = [-0.15, 0.45, 0.1],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const cone1Ref = useRef<THREE.Mesh>(null);
  const cone2Ref = useRef<THREE.Mesh>(null);
  const audioDataRef = useRef<AudioSignal>({
    isPlaying: false, rms: 0, bass: 0, mid: 0, high: 0, channels: {}
  });

  useEffect(() => {
    return audioBus.subscribe((data) => {
      audioDataRef.current = data;
    });
  }, []);

  useFrame(() => {
    const bass = audioDataRef.current.bass || 0;
    const isPlaying = audioDataRef.current.isPlaying;

    if (isPlaying) {
      const disp = 1 + bass * 0.35;
      if (cone1Ref.current) cone1Ref.current.scale.set(disp, disp, disp);
      if (cone2Ref.current) cone2Ref.current.scale.set(disp, disp, disp);
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position} rotation={rotation} scale={0.75}>
        {/* Subwoofer Wooden Cabinet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 2.2, 1.2]} />
          <meshStandardMaterial color="#111116" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Front Baffle Recess */}
        <mesh position={[0, 0, 0.61]}>
          <boxGeometry args={[1.35, 2.05, 0.05]} />
          <meshStandardMaterial color="#08080C" roughness={0.8} />
        </mesh>

        {/* Top 15" Woofer Cone */}
        <mesh ref={cone1Ref} position={[0, 0.5, 0.64]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.52, 0.18, 24]} />
          <meshStandardMaterial color="#1E1E26" emissive="#FF2A55" emissiveIntensity={0.25} roughness={0.3} />
        </mesh>

        {/* Bottom 15" Woofer Cone */}
        <mesh ref={cone2Ref} position={[0, -0.5, 0.64]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.52, 0.18, 24]} />
          <meshStandardMaterial color="#1E1E26" emissive="#FFB800" emissiveIntensity={0.25} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── 4. 3D Studio Condenser Microphone (Lower Right Flank) ──────────────── */
export function StudioMic3D({
  position = [4.4, -1.8, -1.4],
  rotation = [-0.25, -0.45, 0.15],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const micRef = useRef<THREE.Group>(null);
  const capsuleMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const audioDataRef = useRef<AudioSignal>({
    isPlaying: false, rms: 0, bass: 0, mid: 0, high: 0, channels: {}
  });

  useEffect(() => {
    return audioBus.subscribe((data) => {
      audioDataRef.current = data;
    });
  }, []);

  useFrame(({ clock }) => {
    if (!micRef.current) return;
    const t = clock.getElapsedTime();
    const voc = audioDataRef.current.channels?.vocals || 0;
    const isPlaying = audioDataRef.current.isPlaying;

    micRef.current.rotation.y = rotation[1] + Math.sin(t * 0.8) * 0.15;
    if (capsuleMatRef.current) {
      capsuleMatRef.current.emissiveIntensity = isPlaying ? 0.3 + voc * 1.8 : 0.3;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={micRef} position={position} rotation={rotation} scale={0.85}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.9, 24]} />
          <meshStandardMaterial color="#1A1A1E" metalness={0.85} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.7, 24]} />
          <meshStandardMaterial
            ref={capsuleMatRef}
            color="#E2DFD6"
            emissive="#D946EF"
            emissiveIntensity={0.3}
            metalness={0.95}
            roughness={0.1}
            wireframe={true}
          />
        </mesh>

        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#E2DFD6" metalness={0.95} roughness={0.1} wireframe={true} />
        </mesh>

        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.03, 16, 32]} />
          <meshStandardMaterial color="#FF2A55" emissive="#8A0B20" emissiveIntensity={0.6} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── 5. 3D Floating Synthesizer Keybed (Upper Left Flank) ────────────────── */
export function SynthKeybed3D({
  position = [-3.8, 2.2, -2.2],
  rotation = [0.45, 0.4, -0.2],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const audioDataRef = useRef<AudioSignal>({
    isPlaying: false, rms: 0, bass: 0, mid: 0, high: 0, channels: {}
  });

  useEffect(() => {
    return audioBus.subscribe((data) => {
      audioDataRef.current = data;
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const midEnergy = audioDataRef.current.mid || 0;
    const isPlaying = audioDataRef.current.isPlaying;

    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.7) * 0.1;
    groupRef.current.rotation.y = rotation[1] + Math.cos(t * 0.5) * 0.12;

    if (isPlaying) {
      const pulse = 1 + midEnergy * 0.1;
      groupRef.current.scale.set(0.65 * pulse, 0.65 * pulse, 0.65 * pulse);
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} position={position} rotation={rotation} scale={0.65}>
        {/* Synth Chassis */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 0.35, 1.2]} />
          <meshStandardMaterial color="#16161D" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 14 White Keys */}
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={i} position={[-1.3 + i * 0.2, 0.18, 0.2]}>
            <boxGeometry args={[0.18, 0.08, 0.7]} />
            <meshStandardMaterial color="#F2F0EA" roughness={0.1} />
          </mesh>
        ))}

        {/* 10 Black Keys */}
        {[0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i) => (
          <mesh key={i} position={[-1.2 + i * 0.2, 0.26, -0.05]}>
            <boxGeometry args={[0.12, 0.12, 0.45]} />
            <meshStandardMaterial color="#0A0A0E" roughness={0.2} metalness={0.8} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
