"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface AudioMetadata {
  name: string;
  size: string;
  duration: number; // in seconds
  sampleRate: number;
  channels: number;
  peakDb: number;
  durationValid: boolean;
  peaks: number[];
}

export default function DragDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [audioMeta, setAudioMeta] = useState<AudioMetadata | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0); // 0 to 1

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef(0);
  const pauseOffsetRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Decode audio buffer and extract waveform peaks
  const processAudioFile = async (file: File) => {
    setIsDecoding(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferRef.current = decodedBuffer;

      // Extract peaks for waveform canvas (100 bins)
      const channelData = decodedBuffer.getChannelData(0);
      const numBins = 120;
      const blockSize = Math.floor(channelData.length / numBins);
      const peaks: number[] = [];
      let maxSample = 0;

      for (let i = 0; i < numBins; i++) {
        let max = 0;
        const start = i * blockSize;
        for (let j = 0; j < blockSize; j += 10) {
          const val = Math.abs(channelData[start + j] || 0);
          if (val > max) max = val;
          if (val > maxSample) maxSample = val;
        }
        peaks.push(max);
      }

      const peakDb = maxSample > 0 ? 20 * Math.log10(maxSample) : -60;
      const durationSec = decodedBuffer.duration;

      setAudioMeta({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        duration: durationSec,
        sampleRate: decodedBuffer.sampleRate,
        channels: decodedBuffer.numberOfChannels,
        peakDb: parseFloat(peakDb.toFixed(1)),
        durationValid: durationSec <= 300, // 5 min max
        peaks,
      });
    } catch (err) {
      console.error("Audio Decode Error:", err);
    } finally {
      setIsDecoding(false);
    }
  };

  // Draw Waveform on Canvas
  useEffect(() => {
    if (!canvasRef.current || !audioMeta) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const peaks = audioMeta.peaks;
    const barWidth = width / peaks.length;

    peaks.forEach((peak, i) => {
      const x = i * barWidth;
      const barHeight = Math.max(4, peak * height * 0.85);
      const y = (height - barHeight) / 2;
      const progressRatio = i / peaks.length;

      // Played vs Unplayed coloration
      if (progressRatio <= playProgress) {
        ctx.fillStyle = "#E61438";
        ctx.shadowColor = "#E61438";
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.shadowBlur = 0;
      }

      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
    });

    // Draw Playhead Line
    const playheadX = playProgress * width;
    ctx.strokeStyle = "#0F1115";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
  }, [audioMeta, playProgress]);

  // Audio Playback Controls
  const togglePlayAudio = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;
    const ctx = audioContextRef.current;

    if (isPlaying) {
      // Pause
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch {}
      }
      pauseOffsetRef.current += ctx.currentTime - startTimeRef.current;
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      // Play
      if (ctx.state === "suspended") ctx.resume();
      const source = ctx.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(ctx.destination);

      const offset = pauseOffsetRef.current % audioBufferRef.current.duration;
      source.start(0, offset);
      startTimeRef.current = ctx.currentTime - offset;
      audioSourceRef.current = source;
      setIsPlaying(true);

      source.onended = () => {
        setIsPlaying(false);
        setPlayProgress(0);
        pauseOffsetRef.current = 0;
      };

      const trackProgress = () => {
        if (!audioBufferRef.current) return;
        const current = ctx.currentTime - startTimeRef.current;
        const progress = Math.min(1, current / audioBufferRef.current.duration);
        setPlayProgress(progress);
        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(trackProgress);
        } else {
          setIsPlaying(false);
          setPlayProgress(0);
          pauseOffsetRef.current = 0;
        }
      };
      animFrameRef.current = requestAnimationFrame(trackProgress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !audioBufferRef.current || !audioContextRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setPlayProgress(ratio);
    pauseOffsetRef.current = ratio * audioBufferRef.current.duration;

    if (isPlaying) {
      if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch {}
      }
      const ctx = audioContextRef.current;
      const source = ctx.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(ctx.destination);
      source.start(0, pauseOffsetRef.current);
      startTimeRef.current = ctx.currentTime - pauseOffsetRef.current;
      audioSourceRef.current = source;
    }
  };

  // Generate Synthetic Audition Demo for Instant Testing
  const generateSampleAudition = () => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    audioContextRef.current = ctx;

    const duration = 222; // 3:42
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, sampleRate * 10, sampleRate); // 10s audio preview
    const dataL = buffer.getChannelData(0);
    const dataR = buffer.getChannelData(1);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const kick = Math.sin(2 * Math.PI * 55 * t) * Math.exp(-3 * (t % 0.5));
      const riff = Math.sin(2 * Math.PI * 220 * t) * 0.4;
      const noise = (Math.random() * 2 - 1) * 0.15;
      dataL[i] = (kick + riff + noise) * 0.7;
      dataR[i] = (kick + riff - noise) * 0.7;
    }

    audioBufferRef.current = buffer;
    const peaks: number[] = [];
    for (let i = 0; i < 120; i++) {
      peaks.push(0.3 + Math.sin(i * 0.15) * 0.35 + Math.random() * 0.25);
    }

    setAudioMeta({
      name: "Asur_Grand_Finale_Audition_Demo.wav",
      size: "38.4 MB",
      duration: duration,
      sampleRate: 48000,
      channels: 2,
      peakDb: -0.8,
      durationValid: true,
      peaks,
    });
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
      const audioFile = droppedFiles.find(f => f.type.startsWith("audio/") || f.name.endsWith(".mp3") || f.name.endsWith(".wav"));
      if (audioFile) processAudioFile(audioFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
      const audioFile = selected.find(f => f.type.startsWith("audio/") || f.name.endsWith(".mp3") || f.name.endsWith(".wav"));
      if (audioFile) processAudioFile(audioFile);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <label className="label-caps" style={{ fontSize: "0.65rem", color: "var(--bone)" }}>
          Audition Master Track & Tech Rider (MP3, WAV, PDF)
        </label>
        {!audioMeta && (
          <button
            type="button"
            onClick={generateSampleAudition}
            style={{
              background: "rgba(212,160,56,0.15)",
              border: "1px solid rgba(212,160,56,0.4)",
              borderRadius: "4px",
              padding: "3px 8px",
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              color: "var(--gold)",
              cursor: "pointer",
            }}
          >
            ⚡ Load Demo Audition Track
          </button>
        )}
      </div>

      {/* Main Drag Drop Target Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${isDragging ? "var(--red)" : "rgba(0,0,0,0.18)"}`,
          background: isDragging
            ? "rgba(230,20,56,0.06)"
            : "#FFFFFF",
          borderRadius: "8px",
          padding: audioMeta ? "1.5rem" : "2.5rem 1.5rem",
          textAlign: "center",
          transition: "all 0.25s ease",
          cursor: "pointer",
          position: "relative",
          boxShadow: isDragging ? "0 0 30px rgba(230,20,56,0.25)" : "0 4px 18px rgba(0,0,0,0.04)",
        }}
        onClick={() => {
          if (!audioMeta) document.getElementById("file-upload")?.click();
        }}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".mp3,.wav,.pdf,.flac,.ogg"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />

        {isDecoding ? (
          <div style={{ padding: "1.5rem" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                border: "3px solid rgba(0,0,0,0.15)",
                borderTopColor: "var(--red)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 1rem",
              }}
            />
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--bone)", margin: 0 }}>
              Analyzing PCM Waveform & Dynamic Range...
            </p>
          </div>
        ) : !audioMeta ? (
          <div style={{ pointerEvents: "none" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem", color: isDragging ? "var(--red)" : "var(--gold)" }}>
              🎙️
            </div>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", color: "var(--bone)", margin: "0 0 0.3rem" }}>
              {isDragging ? "Drop your multitrack / demo now" : "Drag & Drop your audition master track"}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", margin: 0 }}>
              Supports WAV, MP3, FLAC (Max 5:00 min duration) • Real-time in-browser waveform analysis
            </p>
          </div>
        ) : (
          /* ─── Decoded Audio Waveform & Player Console ─── */
          <div style={{ textAlign: "left", cursor: "default" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--gold)",
                    background: "rgba(184,134,11,0.12)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  DECODED AUDIO MASTER
                </span>
                <h4 style={{ margin: "0.3rem 0 0", color: "var(--bone)", fontSize: "0.95rem", fontFamily: "var(--font-heading)" }}>
                  {audioMeta.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAudioMeta(null);
                  setIsPlaying(false);
                }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,0,0,0.15)",
                  color: "var(--muted)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                }}
              >
                ✕ Replace Track
              </button>
            </div>

            {/* Waveform Canvas */}
            <div
              style={{
                background: "#F4F4F6",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "6px",
                padding: "8px",
                position: "relative",
              }}
            >
              <canvas
                ref={canvasRef}
                width={600}
                height={90}
                onClick={handleSeek}
                style={{
                  width: "100%",
                  height: "90px",
                  display: "block",
                  cursor: "crosshair",
                }}
              />
            </div>

            {/* Transport Bar & Scrubber */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.8rem",
                padding: "0.5rem 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  style={{
                    background: isPlaying ? "var(--red)" : "#0F1115",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 14px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: isPlaying ? "0 0 12px rgba(230,20,56,0.5)" : "none",
                  }}
                >
                  {isPlaying ? "❚❚ PAUSE" : "▶ AUDITION"}
                </button>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--bone)" }}>
                  {formatTime(audioMeta.duration * playProgress)} / {formatTime(audioMeta.duration)}
                </span>
              </div>

              {/* Automated Jury Rule Check Badges */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontFamily: "var(--font-mono)",
                    padding: "3px 6px",
                    borderRadius: "3px",
                    background: audioMeta.durationValid ? "rgba(34,197,94,0.12)" : "rgba(230,20,56,0.12)",
                    color: audioMeta.durationValid ? "#16A34A" : "#DC2626",
                    border: `1px solid ${audioMeta.durationValid ? "rgba(34,197,94,0.3)" : "rgba(230,20,56,0.3)"}`,
                    fontWeight: 700,
                  }}
                >
                  {audioMeta.durationValid ? "✓ DURATION VERIFIED (<5:00m)" : "⚠️ OVER 5:00m LIMIT"}
                </span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontFamily: "var(--font-mono)",
                    padding: "3px 6px",
                    borderRadius: "3px",
                    background: "rgba(0,0,0,0.05)",
                    color: "var(--bone)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    fontWeight: 600,
                  }}
                >
                  {audioMeta.sampleRate / 1000}kHz • {audioMeta.channels === 2 ? "Stereo" : "Mono"} • Peak {audioMeta.peakDb} dBFS
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
