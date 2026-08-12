// Cenário do Jardim Suspiro: flores murchas → desabrochando, borboletas

import Borboletas from "@/components/verade/effects/Borboletas";
import Neblina from "@/components/verade/effects/Neblina";

interface CenarioJardimProps {
  recompensaAtivada?: boolean;
  cor?: string;
  glow?: string;
  reducedMotion?: boolean;
}

export default function CenarioJardim({
  recompensaAtivada = false,
  cor = "#7b1fa2",
  glow = "#ba68c8",
  reducedMotion = false,
}: CenarioJardimProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #120a1a 0%, #1e1028 55%, #2a1538 100%)" }}
      />

      <Neblina cor={cor} intensidade="media" />
      <Borboletas corInicial="#555" corFinal={glow} quantidade={reducedMotion ? 6 : 16} transformado={recompensaAtivada} />

      {/* arbustos/flores no fundo */}
      <div className="absolute bottom-0 left-0 w-full flex items-end justify-center gap-2 px-4" style={{ height: "32%" }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const vivo = recompensaAtivada && i % 3 !== 0;
          return (
            <div key={i} className="flex flex-col items-center" style={{ width: `${4 + (i % 3)}%` }}>
              {/* flor */}
              <div
                className="rounded-full transition-all duration-1000"
                style={{
                  width: `${10 + (i % 8)}px`,
                  height: `${10 + (i % 8)}px`,
                  background: vivo ? glow : "#4a3a4a",
                  boxShadow: vivo ? `0 0 14px 4px ${glow}` : "none",
                  transform: vivo ? "scale(1.3)" : "scale(1)",
                  marginBottom: "6px",
                }}
              />
              {/* caule/folhas */}
              <div
                className="rounded-t-full"
                style={{
                  width: "6px",
                  height: `${30 + (i % 20)}px`,
                  background: vivo ? "#4a7c59" : "#3a3a3a",
                  transition: "background 1s ease",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
