"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { audioBus } from "@/lib/audioBus";

interface ChannelConfig {
  id: string;
  name: string;
  routing: string;
  color: string;
  mic: string;
  icon: string;
  eqLow?: number;
  eqHigh?: number;
}

const CHANNELS: ChannelConfig[] = [
  { id: "drums", name: "Drums & Transient", routing: "CH 01", mic: "AKG D12 VR + SM57", color: "#FF2A55", icon: "🥁" },
  { id: "bass", name: "Bass DI & Cab", routing: "CH 02", mic: "SansAmp BDDI v2", color: "#FFB800", icon: "🎸" },
  { id: "guitar", name: "Lead Guitar Stack", routing: "CH 03", mic: "Shure SM57 Left Cab", color: "#00E5FF", icon: "⚡" },
  { id: "vocals", name: "Lead Vocal Wire", routing: "CH 04", mic: "Beta 58A Wireless", color: "#D946EF", icon: "🎤" },
];

const DB_MARKS = [
  { val: 100, label: "+6" },
  { val: 82, label: "0" },
  { val: 65, label: "-6" },
  { val: 45, label: "-12" },
  { val: 25, label: "-24" },
  { val: 0, label: "-inf" }
];

export default function AudioPlayerPreview({
  label = "RITHMOS Live Soundcheck Engine",
  sublabel = "Bespoke 4-Track Hybrid Console | Grand Finale Multitrack Session",
}: {
  label?: string;
  sublabel?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<"arena" | "club" | "rehearsal">("arena");
  const [tubeWarmth, setTubeWarmth] = useState(70);

  // Track levels (0 to 100, 82 = Unity 0dB)
  const [levels, setLevels] = useState<{ [key: string]: number }>({
    drums: 86,
    bass: 80,
    guitar: 84,
    vocals: 90,
  });

  // Pan settings (-1 to 1)
  const [pans, setPans] = useState<{ [key: string]: number }>({
    drums: 0,
    bass: -0.15,
    guitar: 0.45,
    vocals: 0,
  });

  // 2-Band EQ (Low / High gain -12 to +12dB)
  const [eqs, setEqs] = useState<{ [key: string]: { low: number; high: number } }>({
    drums: { low: 3, high: 2 },
    bass: { low: 4, high: -2 },
    guitar: { low: -1, high: 3 },
    vocals: { low: -2, high: 4 },
  });

  // Mute & Solo state
  const [mutes, setMutes] = useState<{ [key: string]: boolean }>({
    drums: false, bass: false, guitar: false, vocals: false
  });
  const [solos, setSolos] = useState<{ [key: string]: boolean }>({
    drums: false, bass: false, guitar: false, vocals: false
  });

  // Real Meter data (0 to 1)
  const [meters, setMeters] = useState<{ [key: string]: number }>({
    drums: 0, bass: 0, guitar: 0, vocals: 0
  });
  const [vuNeedles, setVuNeedles] = useState({ left: 0, right: 0 });

  // Master Volume (0 to 100)
  const [masterLevel, setMasterLevel] = useState(85);

  // Web Audio References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const channelGainsRef = useRef<{ [key: string]: GainNode }>({});
  const channelPannersRef = useRef<{ [key: string]: StereoPannerNode }>({});
  const channelAnalysersRef = useRef<{ [key: string]: AnalyserNode }>({});
  const masterAnalyserRef = useRef<AnalyserNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const rhythmTimerRef = useRef<number | null>(null);
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const hasActiveSolo = Object.values(solos).some(Boolean);

  const getEffectiveGain = useCallback((channelId: string, level: number) => {
    if (mutes[channelId]) return 0;
    if (hasActiveSolo && !solos[channelId]) return 0;
    return (level / 82);
  }, [mutes, solos, hasActiveSolo]);

  // Update gains, pans, and master
  useEffect(() => {
    if (!audioCtxRef.current || !isPlaying) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;

    CHANNELS.forEach(ch => {
      const gainNode = channelGainsRef.current[ch.id];
      const pannerNode = channelPannersRef.current[ch.id];
      if (gainNode) {
        const target = getEffectiveGain(ch.id, levels[ch.id]);
        gainNode.gain.setTargetAtTime(target, t, 0.05);
      }
      if (pannerNode && pannerNode.pan) {
        pannerNode.pan.setTargetAtTime(pans[ch.id] || 0, t, 0.05);
      }
    });

    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(masterLevel / 82, t, 0.05);
    }
  }, [levels, pans, mutes, solos, masterLevel, isPlaying, getEffectiveGain]);

  // Stop / Cleanup Audio
  const stopAudio = useCallback(() => {
    if (rhythmTimerRef.current) {
      window.clearInterval(rhythmTimerRef.current);
      rhythmTimerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
    setMeters({ drums: 0, bass: 0, guitar: 0, vocals: 0 });
    setVuNeedles({ left: 0, right: 0 });
    audioBus.emit({
      isPlaying: false,
      rms: 0,
      bass: 0,
      mid: 0,
      high: 0,
      channels: { drums: 0, bass: 0, guitar: 0, vocals: 0 }
    });
  }, []);

  // Start High-Fidelity Synthesized Multitrack Engine
  const startAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Chain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterLevel / 82, ctx.currentTime);
      masterGainRef.current = masterGain;

      const masterAnalyser = ctx.createAnalyser();
      masterAnalyser.fftSize = 256;
      masterAnalyser.smoothingTimeConstant = 0.75;
      masterAnalyserRef.current = masterAnalyser;

      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-2, ctx.currentTime);
      limiter.knee.setValueAtTime(6, ctx.currentTime);
      limiter.ratio.setValueAtTime(12, ctx.currentTime);
      limiter.attack.setValueAtTime(0.003, ctx.currentTime);
      limiter.release.setValueAtTime(0.15, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(activePreset === "arena" ? 8000 : activePreset === "club" ? 4500 : 12000, ctx.currentTime);
      filterNodeRef.current = filter;

      masterGain.connect(filter);
      filter.connect(limiter);
      limiter.connect(masterAnalyser);
      masterAnalyser.connect(ctx.destination);

      // Channel Chains
      const analysers: { [key: string]: AnalyserNode } = {};
      const channelGains: { [key: string]: GainNode } = {};
      const channelPanners: { [key: string]: StereoPannerNode } = {};

      CHANNELS.forEach(ch => {
        const cGain = ctx.createGain();
        cGain.gain.setValueAtTime(getEffectiveGain(ch.id, levels[ch.id]), ctx.currentTime);
        channelGains[ch.id] = cGain;

        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(pans[ch.id] || 0, ctx.currentTime);
        channelPanners[ch.id] = panner;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.6;
        analysers[ch.id] = analyser;

        cGain.connect(panner);
        panner.connect(analyser);
        analyser.connect(masterGain);
      });

      channelGainsRef.current = channelGains;
      channelPannersRef.current = channelPanners;
      channelAnalysersRef.current = analysers;

      // Synthesizer Sequencer
      const stepMs = 110; // 138 BPM
      let step = 0;

      const bufferSize = ctx.sampleRate * 0.4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const triggerDrum = (type: "kick" | "snare" | "hihat", time: number) => {
        if (!channelGains.drums) return;
        if (type === "kick") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(150, time);
          osc.frequency.exponentialRampToValueAtTime(40, time + 0.09);
          gain.gain.setValueAtTime(1.1, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);
          osc.connect(gain);
          gain.connect(channelGains.drums);
          osc.start(time);
          osc.stop(time + 0.26);
        } else if (type === "snare") {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.frequency.setValueAtTime(190, time);
          osc.frequency.exponentialRampToValueAtTime(85, time + 0.1);
          oscGain.gain.setValueAtTime(0.45, time);
          oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
          osc.connect(oscGain);
          oscGain.connect(channelGains.drums);
          osc.start(time);
          osc.stop(time + 0.16);

          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = "highpass";
          noiseFilter.frequency.setValueAtTime(1100, time);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.75, time);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(channelGains.drums);
          noise.start(time);
          noise.stop(time + 0.2);
        } else if (type === "hihat") {
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "highpass";
          filter.frequency.setValueAtTime(7500, time);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.3, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(channelGains.drums);
          noise.start(time);
          noise.stop(time + 0.06);
        }
      };

      const triggerBass = (freq: number, time: number, duration: number) => {
        if (!channelGains.bass) return;
        const osc = ctx.createOscillator();
        const oscSub = ctx.createOscillator();
        const gain = ctx.createGain();
        const filt = ctx.createBiquadFilter();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, time);
        oscSub.type = "sine";
        oscSub.frequency.setValueAtTime(freq / 2, time);

        filt.type = "lowpass";
        filt.frequency.setValueAtTime(900, time);
        filt.frequency.exponentialRampToValueAtTime(200, time + duration);

        gain.gain.setValueAtTime(0.65, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filt);
        oscSub.connect(filt);
        filt.connect(gain);
        gain.connect(channelGains.bass);

        osc.start(time);
        oscSub.start(time);
        osc.stop(time + duration);
        oscSub.stop(time + duration);
      };

      const triggerGuitarChord = (freqs: number[], time: number, duration: number) => {
        if (!channelGains.guitar) return;
        freqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const drive = ctx.createWaveShaper();
          const gain = ctx.createGain();
          const filt = ctx.createBiquadFilter();

          const n = 256;
          const curve = new Float32Array(n);
          for (let i = 0; i < n; i++) {
            const x = (i * 2) / n - 1;
            curve[i] = ((Math.PI + 12) * x) / (Math.PI + 12 * Math.abs(x));
          }
          drive.curve = curve;
          drive.oversample = "2x";

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, time);

          filt.type = "bandpass";
          filt.frequency.setValueAtTime(1400, time);
          filt.Q.setValueAtTime(1.4, time);

          gain.gain.setValueAtTime(0.2, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

          osc.connect(drive);
          drive.connect(filt);
          filt.connect(gain);
          gain.connect(channelGains.guitar);

          osc.start(time);
          osc.stop(time + duration);
        });
      };

      const triggerVocal = (freq: number, time: number, duration: number) => {
        if (!channelGains.vocals) return;
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();
        const form1 = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        lfo.type = "sine";
        lfo.frequency.setValueAtTime(5.5, time);
        lfoGain.gain.setValueAtTime(7, time);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        form1.type = "bandpass";
        form1.frequency.setValueAtTime(1300, time);
        form1.Q.setValueAtTime(2.2, time);

        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.38, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(form1);
        form1.connect(gain);
        gain.connect(channelGains.vocals);

        osc.start(time);
        lfo.start(time);
        osc.stop(time + duration);
        lfo.stop(time + duration);
      };

      const bassSeq = [73.4, 73.4, 87.3, 73.4, 98.0, 87.3, 110.0, 73.4, 73.4, 73.4, 130.8, 110.0, 98.0, 87.3, 73.4, 73.4];
      const dMinorChords = [
        [146.8, 220.0, 293.7],
        [174.6, 261.6, 349.2],
        [196.0, 293.7, 392.0],
        [130.8, 196.0, 261.6],
      ];
      const vocalSeq = [293.7, 0, 349.2, 0, 392.0, 440.0, 392.0, 349.2, 293.7, 0, 261.6, 293.7, 0, 0, 0, 0];

      rhythmTimerRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = audioCtxRef.current.currentTime;
        const curStep = step % 16;

        if (curStep === 0 || curStep === 8 || curStep === 10) triggerDrum("kick", now);
        if (curStep === 4 || curStep === 12) triggerDrum("snare", now);
        if (curStep % 2 === 0) triggerDrum("hihat", now);

        if (curStep % 2 === 0 || curStep === 7) {
          triggerBass(bassSeq[curStep] || 73.4, now, 0.18);
        }

        if (curStep === 0 || curStep === 4 || curStep === 8 || curStep === 12) {
          const chordIdx = Math.floor(curStep / 4);
          triggerGuitarChord(dMinorChords[chordIdx] || dMinorChords[0], now, 0.4);
        }

        if (vocalSeq[curStep] && vocalSeq[curStep] > 0) {
          triggerVocal(vocalSeq[curStep], now, 0.35);
        }

        step++;
      }, stepMs);

      setIsPlaying(true);
    } catch (e) {
      console.error(e);
    }
  }, [activePreset, getEffectiveGain, levels, masterLevel, pans]);

  // Real-time Oscilloscope Canvas & Analog VU Meter Loop
  useEffect(() => {
    let animId: number;
    const timeDomainData = new Uint8Array(128);
    const freqData = new Uint8Array(32);

    const renderLoop = () => {
      // 1. Draw Oscilloscope CRT Display
      if (scopeCanvasRef.current) {
        const canvas = scopeCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.fillStyle = "rgba(6, 12, 8, 0.35)";
          ctx.fillRect(0, 0, w, h);

          // Grid Graticule Lines
          ctx.strokeStyle = "rgba(0, 255, 100, 0.08)";
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          if (isPlayingRef.current && masterAnalyserRef.current) {
            masterAnalyserRef.current.getByteTimeDomainData(timeDomainData);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#00FF66";
            ctx.shadowColor = "#00FF66";
            ctx.shadowBlur = 10;
            ctx.beginPath();

            const sliceWidth = w / timeDomainData.length;
            let x = 0;
            for (let i = 0; i < timeDomainData.length; i++) {
              const v = timeDomainData[i] / 128.0;
              const y = (v * h) / 2;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
              x += sliceWidth;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
          } else {
            // Idle Beam Flat Line
            ctx.strokeStyle = "rgba(0, 255, 100, 0.4)";
            ctx.lineWidth = 1.5;
            ctx.shadowColor = "#00FF66";
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 2. Compute Segmented LED & Analog VU Needle Values
      if (isPlayingRef.current && audioCtxRef.current) {
        const newMeters: { [key: string]: number } = { drums: 0, bass: 0, guitar: 0, vocals: 0 };
        CHANNELS.forEach(ch => {
          const analyser = channelAnalysersRef.current[ch.id];
          if (analyser) {
            analyser.getByteFrequencyData(freqData);
            let sum = 0;
            for (let i = 0; i < freqData.length; i++) sum += freqData[i];
            const avg = sum / freqData.length;
            newMeters[ch.id] = Math.min(1, avg / 120);
          }
        });

        setMeters(newMeters);

        const bassAvg = (newMeters.drums * 0.7 + newMeters.bass * 0.9);
        const midAvg = (newMeters.guitar * 0.8 + newMeters.vocals * 0.6);
        const highAvg = (newMeters.drums * 0.5 + newMeters.vocals * 0.7);
        const rmsAvg = (bassAvg + midAvg + highAvg) / 3;

        setVuNeedles({
          left: Math.min(1, (rmsAvg * 1.1 + (newMeters.guitar * (pans.guitar < 0 ? 0.3 : -0.1)))),
          right: Math.min(1, (rmsAvg * 1.1 + (newMeters.guitar * (pans.guitar > 0 ? 0.3 : -0.1)))),
        });

        audioBus.emit({
          isPlaying: true,
          rms: rmsAvg,
          bass: bassAvg,
          mid: midAvg,
          high: highAvg,
          channels: newMeters
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [pans.guitar]);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)",
        color: "var(--bone)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle warm internal glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(230, 20, 56, 0.04), transparent 70%)",
          animation: "red-pulse 4s infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* ─── Chassis Corner Hex Bolts ─── */}
      {[
        { top: "8px", left: "10px" },
        { top: "8px", right: "10px" },
        { bottom: "8px", left: "10px" },
        { bottom: "8px", right: "10px" },
      ].map((pos, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            ...pos,
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #F8F9FA, #CED4DA)",
            border: "1px solid rgba(0,0,0,0.2)",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.15)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "6px", height: "1px", background: "#868E96", transform: "rotate(45deg)" }} />
        </div>
      ))}

      {/* ─── Top Rackmount Header (CRT Oscilloscope + Analog VU Needles + Tubes) ─── */}
      <div
        style={{
          padding: "1.2rem 1.6rem 0.8rem",
          background: "linear-gradient(180deg, #F8F9FA 0%, #EEF0F4 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.2rem",
        }}
      >
        {/* Left: Console Branding & Status */}
        <div style={{ minWidth: "220px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: isPlaying ? "#10B981" : "var(--muted)",
                boxShadow: isPlaying ? "0 0 10px rgba(16,185,129,0.7)" : "none",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: isPlaying ? "#059669" : "var(--muted)",
              }}
            >
              {isPlaying ? "ENGINE LIVE • 48kHz PCM" : "STANDBY"}
            </span>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 900,
              letterSpacing: "0.03em",
              margin: "0.25rem 0 0",
              color: "var(--bone)",
              textTransform: "uppercase",
            }}
          >
            {label}
          </h3>
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--gold)",
              fontFamily: "var(--font-mono)",
              margin: "0.15rem 0 0",
            }}
          >
            138 BPM • D Minor • Shilpakala Vedika FOH Feed
          </p>
        </div>

        {/* Center: Realtime Vector CRT Oscilloscope */}
        <div
          style={{
            background: "#050B07",
            border: "2px solid #1A3322",
            borderRadius: "6px",
            boxShadow: "inset 0 0 15px rgba(0,255,100,0.2), 0 4px 15px rgba(0,0,0,0.8)",
            padding: "4px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "4px",
              left: "8px",
              fontSize: "0.55rem",
              fontFamily: "var(--font-mono)",
              color: "rgba(0,255,100,0.6)",
              pointerEvents: "none",
            }}
          >
            OSC 10ms/DIV
          </div>
          <canvas
            ref={scopeCanvasRef}
            width={180}
            height={48}
            style={{ display: "block", borderRadius: "3px" }}
          />
        </div>

        {/* Right: Dual Backlit Analog VU Meter Box + Engage Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {/* Dual Analog VU Meters */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              background: "#0B0C0E",
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "6px",
              padding: "4px 6px",
            }}
          >
            {["L", "R"].map((chKey) => {
              const needleVal = chKey === "L" ? vuNeedles.left : vuNeedles.right;
              const angle = -45 + needleVal * 90; // -45deg to +45deg

              return (
                <div
                  key={chKey}
                  style={{
                    width: "56px",
                    height: "36px",
                    background: "radial-gradient(ellipse at center bottom, #FFE8A3 0%, #D4A038 60%, #8A6417 100%)",
                    borderRadius: "4px",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.5)",
                    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  {/* Gauge Arc Markings */}
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      left: 0,
                      width: "100%",
                      textAlign: "center",
                      fontSize: "0.5rem",
                      fontFamily: "var(--font-mono)",
                      color: "#1A1406",
                      fontWeight: 800,
                    }}
                  >
                    VU {chKey}
                  </div>
                  {/* Red Peak Zone on Right */}
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "6px",
                      width: "12px",
                      height: "3px",
                      background: "#E61438",
                      borderRadius: "1px",
                    }}
                  />
                  {/* Needle Pivot & Arm */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      left: "50%",
                      width: "1px",
                      height: "36px",
                      background: "#1A1A1A",
                      transformOrigin: "bottom center",
                      transform: `rotate(${angle}deg)`,
                      transition: "transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1)",
                      boxShadow: "0 0 2px rgba(0,0,0,0.8)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Master Engage Push Button */}
          <button
            onClick={isPlaying ? stopAudio : startAudio}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.4rem",
              background: isPlaying
                ? "linear-gradient(135deg, #E61438 0%, #8A0B20 100%)"
                : "linear-gradient(135deg, #22C55E 0%, #15803D 100%)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              color: "#FFFFFF",
              fontSize: "0.78rem",
              fontWeight: 800,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: isPlaying
                ? "0 0 20px rgba(230,20,56,0.6), inset 0 1px 0 rgba(255,255,255,0.4)"
                : "0 0 20px rgba(34,197,94,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
              transition: "all 0.15s ease",
            }}
          >
            {isPlaying ? "CUT SOUNDCHECK ❚❚" : "ENGAGE FOH MIX ▶"}
          </button>
        </div>
      </div>

      {/* ─── Presets Bar ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.55rem 1.6rem",
          background: "#F4F5F8",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          fontSize: "0.65rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span style={{ color: "var(--muted)", fontWeight: 700 }}>ACOUSTIC SPACE PRESET:</span>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(["arena", "club", "rehearsal"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActivePreset(p)}
              style={{
                padding: "4px 10px",
                fontSize: "0.62rem",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                borderRadius: "4px",
                border: activePreset === p ? "1px solid var(--red)" : "1px solid rgba(0,0,0,0.12)",
                cursor: "pointer",
                background: activePreset === p ? "var(--red)" : "#FFFFFF",
                color: activePreset === p ? "#FFFFFF" : "var(--bone)",
                fontWeight: activePreset === p ? 800 : 600,
                boxShadow: activePreset === p ? "0 2px 8px rgba(230,20,56,0.3)" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Console Strips (4 Multi-track Channels + Master Bus) ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr)) 125px",
          gap: "1px",
          background: "rgba(0,0,0,0.08)",
          padding: "1px",
        }}
      >
        {/* 4 Multi-track Channel Strips */}
        {CHANNELS.map((ch) => {
          const isMuted = mutes[ch.id];
          const isSoloed = solos[ch.id];
          const currentLevel = levels[ch.id];
          const pan = pans[ch.id] || 0;
          const vuLevel = meters[ch.id] || 0;

          return (
            <div
              key={ch.id}
              style={{
                background: isSoloed
                  ? "rgba(212,160,56,0.12)"
                  : isMuted
                  ? "rgba(0,0,0,0.04)"
                  : "linear-gradient(180deg, #FFFFFF 0%, #F9F9FB 100%)",
                padding: "1rem 0.8rem 1.2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                position: "relative",
                borderRight: "1px solid rgba(0,0,0,0.08)",
                opacity: isMuted ? 0.55 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {/* Channel Strip Header Plate */}
              <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "0.2rem", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}>
                  {ch.icon}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    color: ch.color,
                    letterSpacing: "0.12em",
                  }}
                >
                  {ch.routing}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "var(--bone)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {ch.name.split("&")[0]}
                </div>
                <div
                  style={{
                    fontSize: "0.58rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                    marginTop: "2px",
                  }}
                >
                  {ch.mic}
                </div>
              </div>

              {/* PAN Rotary Dial */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                <span style={{ fontSize: "0.58rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                  PAN {pan === 0 ? "C" : pan < 0 ? `L${Math.abs(Math.round(pan * 100))}` : `R${Math.round(pan * 100)}`}
                </span>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, #FFFFFF, #CFD4DC)",
                    border: "1px solid rgba(0,0,0,0.2)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.12)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "ew-resize",
                  }}
                  title="Click to center, wheel to pan"
                  onClick={() => setPans(prev => ({ ...prev, [ch.id]: 0 }))}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "2px",
                      height: "12px",
                      background: ch.color,
                      borderRadius: "1px",
                      top: "4px",
                      transformOrigin: "bottom center",
                      transform: `rotate(${pan * 135}deg)`,
                      boxShadow: `0 0 4px ${ch.color}`,
                    }}
                  />
                </div>
              </div>

              {/* Solo & Mute Buttons */}
              <div style={{ display: "flex", gap: "0.35rem", width: "100%", justifyContent: "center" }}>
                <button
                  onClick={() => setSolos(prev => ({ ...prev, [ch.id]: !prev[ch.id] }))}
                  style={{
                    flex: 1,
                    maxWidth: "38px",
                    padding: "4px 0",
                    background: isSoloed
                      ? "linear-gradient(180deg, #FFB800, #D49B00)"
                      : "linear-gradient(180deg, #FFFFFF, #E8EAEF)",
                    border: isSoloed ? "1px solid #FFC833" : "1px solid rgba(0,0,0,0.15)",
                    borderRadius: "3px",
                    color: isSoloed ? "#000000" : "var(--bone)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: isSoloed ? "0 0 10px rgba(255,184,0,0.8)" : "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  S
                </button>

                <button
                  onClick={() => setMutes(prev => ({ ...prev, [ch.id]: !prev[ch.id] }))}
                  style={{
                    flex: 1,
                    maxWidth: "38px",
                    padding: "4px 0",
                    background: isMuted
                      ? "linear-gradient(180deg, #FF2A55, #D41438)"
                      : "linear-gradient(180deg, #FFFFFF, #E8EAEF)",
                    border: isMuted ? "1px solid #FFA4B2" : "1px solid rgba(0,0,0,0.15)",
                    borderRadius: "3px",
                    color: isMuted ? "#FFFFFF" : "var(--bone)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: isMuted ? "0 0 10px rgba(255,42,85,0.8)" : "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  M
                </button>
              </div>

              {/* Fader Track & 12-Segment LED Ladder */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  height: "170px",
                  position: "relative",
                  width: "100%",
                }}
              >
                {/* 12-Segment LED Meter */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    gap: "2px",
                    background: "#181920",
                    padding: "3px 2px",
                    borderRadius: "3px",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}
                >
                  {Array.from({ length: 12 }).map((_, i) => {
                    const stepNorm = (i + 1) / 12;
                    const isActive = vuLevel >= stepNorm;
                    const isPeak = i >= 10;
                    const isAmber = i >= 7 && i < 10;
                    const ledColor = isPeak ? "#FF2A55" : isAmber ? "#FFB800" : "#00FF66";

                    return (
                      <div
                        key={i}
                        style={{
                          width: "8px",
                          height: "9px",
                          borderRadius: "1px",
                          background: isActive ? ledColor : "rgba(255,255,255,0.08)",
                          boxShadow: isActive ? `0 0 6px ${ledColor}` : "none",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Silk-Screened dB Scale */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "150px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.55rem",
                    color: "var(--muted)",
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {DB_MARKS.map(mark => (
                    <span key={mark.val} style={{ color: mark.val === 82 ? "var(--bone)" : "inherit" }}>
                      {mark.label}
                    </span>
                  ))}
                </div>

                {/* Fader Track Slot & Knurled Aluminum Knob */}
                <div
                  style={{
                    width: "28px",
                    height: "150px",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "6px",
                      height: "100%",
                      background: "#DEE2E6",
                      borderRadius: "3px",
                      border: "1px solid rgba(0,0,0,0.18)",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />

                  {/* 0dB Unity Mark */}
                  <div
                    style={{
                      position: "absolute",
                      top: `${100 - 82}%`,
                      width: "16px",
                      height: "1px",
                      background: "rgba(0,0,0,0.35)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Knurled Aluminum Fader Knob */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: `calc(${currentLevel}% - 14px)`,
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      background: "linear-gradient(180deg, #FFFFFF 0%, #D8DCE3 50%, #BCC1CA 100%)",
                      border: "1px solid rgba(0,0,0,0.25)",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "grab",
                      zIndex: 2,
                    }}
                  >
                    <div style={{ width: "18px", height: "1px", background: "rgba(0,0,0,0.2)", marginBottom: "3px" }} />
                    <div style={{ width: "22px", height: "2px", background: ch.color, boxShadow: `0 0 6px ${ch.color}` }} />
                    <div style={{ width: "18px", height: "1px", background: "rgba(0,0,0,0.2)", marginTop: "3px" }} />
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentLevel}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setLevels(prev => ({ ...prev, [ch.id]: val }));
                    }}
                    style={{
                      position: "absolute",
                      width: "150px",
                      height: "28px",
                      opacity: 0,
                      transform: "rotate(-90deg)",
                      transformOrigin: "center center",
                      top: "61px",
                      cursor: "pointer",
                      zIndex: 3,
                    }}
                  />
                </div>
              </div>

              {/* Strip Nameplate & Level Readout */}
              <div
                style={{
                  background: "#F0F2F6",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "3px",
                  padding: "4px 6px",
                  width: "100%",
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: "var(--bone)",
                  fontWeight: 700,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{ch.id.toUpperCase()}</span>
                <span>{currentLevel > 82 ? `+${((currentLevel - 82) * 0.33).toFixed(1)}` : `${((currentLevel - 82) * 0.4).toFixed(1)}`} dB</span>
              </div>
            </div>
          );
        })}

        {/* ─── Master Bus Section ─── */}
        <div
          style={{
            background: "linear-gradient(180deg, #FFF1F3 0%, #FFE6E9 100%)",
            padding: "1rem 0.6rem 1.2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            borderLeft: "2px solid rgba(230,20,56,0.35)",
          }}
        >
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 800, color: "var(--red)", letterSpacing: "0.1em" }}>
              BUS 1-2
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", fontWeight: 900, color: "var(--bone)" }}>
              MASTER
            </div>
            <div style={{ fontSize: "0.58rem", color: "var(--gold)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              LIMITER ON
            </div>
          </div>

          <div
            style={{
              fontSize: "0.58rem",
              fontFamily: "var(--font-mono)",
              background: "#FFFFFF",
              padding: "4px 6px",
              borderRadius: "4px",
              border: "1px solid rgba(230,20,56,0.25)",
              textAlign: "center",
              width: "100%",
              color: "var(--bone)",
              fontWeight: 700,
            }}
          >
            ROOM: {activePreset.toUpperCase()}
          </div>

          {/* Master Fader Area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              height: "170px",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Dual Stereo Master LED */}
            <div
              style={{
                display: "flex",
                gap: "2px",
                background: "#181920",
                padding: "3px 2px",
                borderRadius: "3px",
                border: "1px solid rgba(230,20,56,0.4)",
              }}
            >
              {[0, 1].map((stIdx) => (
                <div key={stIdx} style={{ display: "flex", flexDirection: "column-reverse", gap: "2px" }}>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const maxTrackMeter = Math.max(...Object.values(meters));
                    const stepNorm = (i + 1) / 12;
                    const isActive = (maxTrackMeter * (masterLevel / 82)) >= stepNorm;
                    const isPeak = i >= 10;
                    const isAmber = i >= 7 && i < 10;
                    const ledColor = isPeak ? "#FF2A55" : isAmber ? "#FFB800" : "#E61438";

                    return (
                      <div
                        key={i}
                        style={{
                          width: "4px",
                          height: "9px",
                          borderRadius: "1px",
                          background: isActive ? ledColor : "rgba(255,255,255,0.08)",
                          boxShadow: isActive ? `0 0 6px ${ledColor}` : "none",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Red Master Console Fader */}
            <div
              style={{
                width: "28px",
                height: "150px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "6px",
                  height: "100%",
                  background: "#F2D5DA",
                  borderRadius: "3px",
                  border: "1px solid rgba(230,20,56,0.3)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: `calc(${masterLevel}% - 14px)`,
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  background: "linear-gradient(180deg, #FF2A55 0%, #D41438 100%)",
                  border: "1px solid #FFA4B2",
                  boxShadow: "0 3px 8px rgba(230,20,56,0.4), inset 0 1px 0 rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "grab",
                  zIndex: 2,
                }}
              >
                <div style={{ width: "22px", height: "2px", background: "#FFFFFF", boxShadow: "0 0 6px #FFFFFF" }} />
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={masterLevel}
                onChange={(e) => setMasterLevel(parseInt(e.target.value))}
                style={{
                  position: "absolute",
                  width: "150px",
                  height: "28px",
                  opacity: 0,
                  transform: "rotate(-90deg)",
                  transformOrigin: "center center",
                  top: "61px",
                  cursor: "pointer",
                  zIndex: 3,
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(230,20,56,0.3)",
              borderRadius: "3px",
              padding: "4px 6px",
              width: "100%",
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              color: "var(--bone)",
              fontWeight: 700,
            }}
          >
            MAIN OUT
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
