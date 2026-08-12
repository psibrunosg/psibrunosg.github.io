// Godofredo, o peixinho dourado — Capítulo 5 (Floresta do Silêncio / Linn)

interface GodofredoProps {
  brilhante?: boolean;
}

export default function Godofredo({ brilhante = false }: GodofredoProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="verade-godofredo absolute"
        style={{
          top: "55%",
          left: "-20%",
          width: "140%",
          height: "80px",
          animation: "verade-swim 14s linear infinite",
        }}
        viewBox="0 0 120 40"
        fill="none"
      >
        <g style={{ filter: brilhante ? "drop-shadow(0 0 12px #fff176)" : "drop-shadow(0 0 4px #d4a94f)" }}>
          <ellipse cx="60" cy="20" rx="22" ry="12" fill={brilhante ? "#fff176" : "#d4a94f"} opacity={0.95} />
          <circle cx="72" cy="16" r="3" fill="#171d2b" />
          <path d="M38 20 L22 8 L22 32 Z" fill={brilhante ? "#fff176" : "#d4a94f"} />
          <path d="M78 16 L92 6 L86 20 Z" fill={brilhante ? "#fff59d" : "#b08d3a"} />
          <path d="M78 24 L92 34 L86 20 Z" fill={brilhante ? "#fff59d" : "#b08d3a"} />
        </g>
      </svg>
    </div>
  );
}
