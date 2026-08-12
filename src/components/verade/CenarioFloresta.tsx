// Cenário da Floresta do Silêncio: árvores, luar, Godofredo nadando

import Godofredo from "@/components/verade/effects/Godofredo";
import Neblina from "@/components/verade/effects/Neblina";

interface CenarioFlorestaProps {
  recompensaAtivada?: boolean;
  cor?: string;
  glow?: string;
  reducedMotion?: boolean;
}

export default function CenarioFloresta({
  recompensaAtivada = false,
  cor = "#2e7d32",
  glow = "#66bb6a",
  reducedMotion = false,
}: CenarioFlorestaProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #050a0a 0%, #0a1812 50%, #0f2016 100%)" }}
      />

      {/* luar */}
      <div
        className="absolute rounded-full"
        style={{
          top: "6%",
          left: "10%",
          width: "70px",
          height: "70px",
          background: "radial-gradient(circle at 30% 30%, #e8f5e9 0%, #a5d6a7 50%, transparent 70%)",
          boxShadow: `0 0 60px 20px ${glow}33`,
          opacity: 0.8,
        }}
      />

      <Neblina cor={cor} intensidade="leve" />

      {/* árvores ao fundo */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "50%", opacity: 0.5 }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 200"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 90},200 L${i * 90 + 20},60 L${i * 90 + 40},200 Z`}
            fill="#0b1a12"
          />
        ))}
      </svg>

      {/* árvores próximas */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "40%", opacity: 0.85 }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 200"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 130 + 30},200 L${i * 130 + 70},20 L${i * 130 + 110},200 Z`}
            fill="#08140e"
          />
        ))}
      </svg>

      {/* banco */}
      <div
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 rounded-lg"
        style={{
          width: "140px",
          height: "18px",
          background: "linear-gradient(180deg, #3a2e22 0%, #241a12 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      />
      <div
        className="absolute bottom-[14%] left-[calc(50%-50px)] rounded-sm"
        style={{ width: "8px", height: "22px", background: "#1a120d" }}
      />
      <div
        className="absolute bottom-[14%] left-[calc(50%+42px)] rounded-sm"
        style={{ width: "8px", height: "22px", background: "#1a120d" }}
      />

      <Godofredo brilhante={recompensaAtivada} />

      {/* fog fireflies quando recompensa ativa */}
      {recompensaAtivada &&
        Array.from({ length: reducedMotion ? 6 : 16 }).map((_, i) => (
          <span
            key={i}
            className="verade-firefly absolute rounded-full"
            style={{
              top: `${20 + (i * 11) % 60}%`,
              left: `${(i * 17) % 100}%`,
              width: "3px",
              height: "3px",
              background: glow,
              boxShadow: `0 0 10px 3px ${glow}`,
              animation: reducedMotion ? "none" : `verade-firefly ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
    </div>
  );
}
