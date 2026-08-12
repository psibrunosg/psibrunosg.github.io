// Cenário da Chegada: céu estrelado, montanhas em camadas, bondinho descendo

import Estrelas from "@/components/verade/effects/Estrelas";

interface CenarioChegadaProps {
  progresso?: number; // 0 a 1, controle de scroll
  reducedMotion?: boolean;
}

export default function CenarioChegada({ progresso = 0, reducedMotion = false }: CenarioChegadaProps) {
  const bondinhoY = reducedMotion ? 10 : 5 + progresso * 55;
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* céu gradiente */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 55%, #2d1b4e 100%)",
        }}
      />
      <Estrelas quantidade={reducedMotion ? 20 : 90} />

      {/* lua */}
      <div
        className="absolute rounded-full"
        style={{
          top: "8%",
          right: "12%",
          width: "80px",
          height: "80px",
          background: "radial-gradient(circle at 30% 30%, #fffce8 0%, #e8e0c8 40%, #a89f8d 100%)",
          boxShadow: "0 0 40px 10px rgba(255,252,232,0.25)",
          opacity: 0.9,
        }}
      />

      {/* montanhas distantes */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "38%", opacity: 0.6 }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 200"
      >
        <path d="M0,200 L0,120 Q150,60 300,110 T600,90 T900,120 T1200,80 L1200,200 Z" fill="#14142a" />
      </svg>

      {/* montanhas próximas */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "26%", opacity: 0.85 }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 200"
      >
        <path d="M0,200 L0,150 Q200,80 400,140 T800,100 T1200,150 L1200,200 Z" fill="#0f0f1f" />
      </svg>

      {/* cidade com luzes */}
      <div className="absolute bottom-0 left-0 w-full flex items-end justify-center gap-1 px-4" style={{ height: "18%" }}>
        {Array.from({ length: 24 }).map((_, i) => {
          const h = 20 + (i % 5) * 14;
          const acesa = progresso > 0.3 || (i % 3 === 0);
          return (
            <div
              key={i}
              className="rounded-t-sm"
              style={{
                width: `${3 + (i % 3)}%`,
                height: `${h}%`,
                background: acesa ? "#1e1e3a" : "#12121f",
                boxShadow: acesa ? "inset 0 0 0 1px rgba(255,255,255,0.05)" : "none",
              }}
            >
              {acesa && (
                <div
                  className="mx-auto mt-2 rounded-full"
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "#fff176",
                    opacity: 0.7,
                    boxShadow: "0 0 8px 2px rgba(255,241,118,0.5)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* bondinho */}
      <svg
        className="absolute"
        style={{
          top: `${bondinhoY}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "70px",
          filter: "drop-shadow(0 0 12px rgba(255,241,118,0.35))",
        }}
        viewBox="0 0 120 70"
      >
        <line x1="0" y1="5" x2="120" y2="5" stroke="#d4a94f" strokeWidth="2" />
        <line x1="20" y1="5" x2="20" y2="25" stroke="#8a7a55" strokeWidth="2" />
        <line x1="100" y1="5" x2="100" y2="25" stroke="#8a7a55" strokeWidth="2" />
        <rect x="15" y="25" width="90" height="38" rx="8" fill="#2a2630" stroke="#d4a94f" strokeWidth="2" />
        <rect x="25" y="32" width="22" height="18" rx="3" fill="#fff176" opacity="0.7" />
        <rect x="55" y="32" width="22" height="18" rx="3" fill="#fff176" opacity="0.7" />
        <circle cx="35" cy="68" r="4" fill="#1a1a2e" />
        <circle cx="85" cy="68" r="4" fill="#1a1a2e" />
      </svg>
    </div>
  );
}
