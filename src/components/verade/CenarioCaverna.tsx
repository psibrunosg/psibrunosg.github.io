// Cenário da Caverna Tramanhas: pedras escuras, cristais vermelhos → transparentes

import Faiscas from "@/components/verade/effects/Faiscas";

interface CenarioCavernaProps {
  recompensaAtivada?: boolean;
  cor?: string;
  glow?: string;
  reducedMotion?: boolean;
}

export default function CenarioCaverna({
  recompensaAtivada = false,
  cor = "#b71c1c",
  glow = "#ef5350",
  reducedMotion = false,
}: CenarioCavernaProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0a080a 0%, #1a1012 50%, #241316 100%)" }}
      />

      {/* parede de pedra com cristais */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: "55%" }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const limpo = recompensaAtivada && i % 2 === 0;
          const left = `${(i / 18) * 100}%`;
          const h = 80 + (i % 40);
          return (
            <div
              key={i}
              className="absolute bottom-0 flex flex-col items-center justify-end transition-all duration-1000"
              style={{ left, width: `${100 / 18}%`, height: `${h}%` }}
            >
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: "70%",
                  background: "linear-gradient(180deg, #2a1a1a 0%, #150c0c 100%)",
                  clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)",
                }}
              />
              <div
                className="rounded-full transition-all duration-1000"
                style={{
                  width: "10px",
                  height: "24px",
                  marginTop: "-8px",
                  background: limpo ? "rgba(255,255,255,0.35)" : glow,
                  boxShadow: limpo ? "0 0 12px 3px rgba(255,255,255,0.25)" : `0 0 18px 5px ${glow}`,
                  opacity: limpo ? 0.5 : 0.9,
                  animation: reducedMotion ? "none" : `verade-pulse-crystal ${1.5 + (i % 3) * 0.3}s ease-in-out infinite`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* tramanha (estrutura torta) */}
      <svg
        className="absolute transition-all duration-1000"
        style={{
          top: "15%",
          right: "8%",
          width: "160px",
          height: "160px",
          opacity: recompensaAtivada ? 0.15 : 0.6,
          transform: recompensaAtivada ? "rotate(12deg) scale(0.85)" : "rotate(0deg) scale(1)",
        }}
        viewBox="0 0 100 100"
      >
        <path d="M20,20 L80,30 L70,80 L30,70 Z" fill="none" stroke={glow} strokeWidth="3" />
        <path d="M35,35 L65,40 L60,65 L40,60 Z" fill="none" stroke={cor} strokeWidth="2" />
        <circle cx="50" cy="50" r="6" fill={glow} />
      </svg>

      <Faiscas cor={glow} quantidade={reducedMotion ? 8 : 22} ativo={!recompensaAtivada} />
    </div>
  );
}
