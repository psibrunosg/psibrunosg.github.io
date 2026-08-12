// Cenário da Torre da Pessy: torre de livros, lupas, papéis flutuando

import PapeisFlutuando from "@/components/verade/effects/PapeisFlutuando";

interface CenarioTorreProps {
  recompensaAtivada?: boolean;
  cor?: string;
  glow?: string;
  reducedMotion?: boolean;
}

export default function CenarioTorre({
  recompensaAtivada = false,
  glow = "#ffb74d",
  reducedMotion = false,
}: CenarioTorreProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0f0a08 0%, #1a120c 50%, #241a10 100%)" }}
      />

      <PapeisFlutuando quantidade={reducedMotion ? 8 : 20} />

      {/* torre de livros */}
      <div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{ width: "220px" }}
      >
        {[
          { w: 120, h: 18, c: "#3e2723" },
          { w: 140, h: 20, c: "#4e342e" },
          { w: 110, h: 16, c: "#5d4037" },
          { w: 150, h: 22, c: "#6d4c41" },
          { w: 100, h: 16, c: "#795548" },
          { w: 130, h: 18, c: "#8d6e63" },
          { w: 90, h: 14, c: "#a1887f" },
        ].map((livro, i) => (
          <div
            key={i}
            className="rounded-sm border border-white/10"
            style={{
              width: livro.w,
              height: livro.h,
              background: livro.c,
              marginBottom: "2px",
              boxShadow: recompensaAtivada ? `0 0 12px 2px ${glow}` : "none",
              transition: "box-shadow 1s ease",
            }}
          />
        ))}
      </div>

      {/* lupas flutuantes */}
      {[
        { top: "18%", left: "20%", s: 60 },
        { top: "30%", left: "72%", s: 80 },
        { top: "55%", left: "12%", s: 50 },
      ].map((l, i) => (
        <svg
          key={i}
          className="absolute"
          style={{
            top: l.top,
            left: l.left,
            width: l.s,
            height: l.s,
            animation: reducedMotion ? "none" : `verade-float ${4 + i}s ease-in-out ${i * 0.5}s infinite`,
          }}
          viewBox="0 0 60 60"
        >
          <circle cx="26" cy="26" r="18" fill="none" stroke={glow} strokeWidth="2" opacity="0.6" />
          <line x1="38" y1="38" x2="54" y2="54" stroke={glow} strokeWidth="4" strokeLinecap="round" />
        </svg>
      ))}

      {/* esfera dourada subindo quando recompensa ativa */}
      {recompensaAtivada && (
        <div
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "24px",
            height: "24px",
            background: glow,
            boxShadow: `0 0 40px 12px ${glow}`,
            animation: reducedMotion ? "none" : "verade-rise-orb 4s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}
