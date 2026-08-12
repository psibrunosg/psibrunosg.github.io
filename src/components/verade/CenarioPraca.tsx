// Cenário da Praça Vazia: praça escura, fonte seca → jorrando

import Particulas from "@/components/verade/effects/Particulas";

interface CenarioPracaProps {
  recompensaAtivada?: boolean;
  cor?: string;
  glow?: string;
  reducedMotion?: boolean;
}

export default function CenarioPraca({
  recompensaAtivada = false,
  glow = "#3949ab",
  reducedMotion = false,
}: CenarioPracaProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0a0a15 0%, #12122a 60%, #181838 100%)" }}
      />

      {/* chão da praça */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: "22%",
          background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
          boxShadow: "inset 0 10px 40px rgba(0,0,0,0.5)",
        }}
      />

      {/* postes */}
      {[-35, 35].map((offset, i) => (
        <div
          key={i}
          className="absolute bottom-[22%]"
          style={{
            left: `calc(50% + ${offset}%)`,
            transform: "translateX(-50%)",
            width: "4px",
            height: "35%",
            background: "#2a2a3a",
          }}
        >
          <div
            className="absolute -top-3 -left-3 rounded-full"
            style={{
              width: "28px",
              height: "28px",
              background: recompensaAtivada ? glow : "#3a3a4a",
              boxShadow: recompensaAtivada ? `0 0 24px 8px ${glow}` : "0 0 8px 2px rgba(255,255,255,0.1)",
              transition: "all 1s ease",
            }}
          />
        </div>
      ))}

      {/* fonte */}
      <div
        className="absolute bottom-[22%] left-1/2 -translate-x-1/2"
        style={{ width: "180px", height: "120px" }}
      >
        {/* base */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg"
          style={{
            width: "140px",
            height: "24px",
            background: "linear-gradient(180deg, #2a2a40 0%, #1a1a2a 100%)",
          }}
        />
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded"
          style={{
            width: "80px",
            height: "40px",
            background: "linear-gradient(180deg, #353550 0%, #202030 100%)",
          }}
        />
        <div
          className="absolute bottom-11 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "30px",
            height: "30px",
            background: "#404060",
          }}
        />

        {/* água jorrando */}
        {recompensaAtivada && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: "6px",
                  height: `${20 + (i % 4) * 12}px`,
                  background: `linear-gradient(180deg, ${glow} 0%, transparent 100%)`,
                  animation: reducedMotion ? "none" : `verade-fountain 1.2s ease-in-out ${i * 0.08}s infinite alternate`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Particulas cor={glow} quantidade={reducedMotion ? 10 : 28} ativo={recompensaAtivada} />
    </div>
  );
}
