interface WaveformDividerProps {
  inverted?: boolean;
  className?: string;
}

const BARS = [3, 6, 9, 14, 20, 28, 36, 44, 52, 60, 68, 76, 80, 76, 68, 60, 52, 44, 36, 28, 20, 14, 9, 6, 3];

export default function WaveformDivider({ inverted = false, className = "" }: WaveformDividerProps) {
  const totalBars = BARS.length;
  const svgWidth = 1200;
  const svgHeight = 60;
  const barWidth = svgWidth / totalBars;

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        transform: inverted ? "scaleY(-1)" : "none",
        lineHeight: 0,
      }}
      className={className}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "40px", display: "block" }}
        aria-hidden="true"
      >
        {/* Red center line */}
        <line
          x1="0"
          y1={svgHeight / 2}
          x2={svgWidth}
          y2={svgHeight / 2}
          stroke="var(--red)"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Animated bars */}
        {BARS.map((height, i) => {
          const x = i * barWidth + barWidth / 2;
          const halfH = (height / 100) * svgHeight * 0.9;
          const delay = (i / totalBars) * 1.5;
          return (
            <g key={i}>
              <rect
                x={x - 1.5}
                y={svgHeight / 2 - halfH}
                width={3}
                height={halfH * 2}
                fill="var(--red)"
                opacity="0.9"
                style={{
                  transformOrigin: `${x}px ${svgHeight / 2}px`,
                  animation: `waveform-pulse ${0.8 + (i % 5) * 0.2}s ease-in-out ${delay}s infinite alternate`,
                }}
              />
            </g>
          );
        })}

        {/* Decorative lines flanking waveform */}
        <line x1="0" y1={svgHeight / 2} x2={svgWidth * 0.15} y2={svgHeight / 2}
          stroke="var(--red)" strokeWidth="1" opacity="0.6" />
        <line x1={svgWidth * 0.85} y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2}
          stroke="var(--red)" strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  );
}
