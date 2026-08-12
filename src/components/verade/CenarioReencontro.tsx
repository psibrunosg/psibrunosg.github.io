// Cenário do Reencontro: Verade de dia, praça restaurada

import EsferasLuz from "@/components/verade/effects/EsferasLuz";

interface CenarioReencontroProps {
  recompensaAtivada?: boolean;
  reducedMotion?: boolean;
}

export default function CenarioReencontro({
  recompensaAtivada = false,
  reducedMotion = false,
}: CenarioReencontroProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #4a90e2 0%, #87ceeb 45%, #c8e6c9 100%)" }}
      />

      {/* sol */}
      <div
        className="absolute rounded-full"
        style={{
          top: "8%",
          right: "15%",
          width: "90px",
          height: "90px",
          background: "radial-gradient(circle at 30% 30%, #fff9c4 0%, #fff176 50%, #fbc02d 100%)",
          boxShadow: "0 0 60px 20px rgba(255,241,118,0.45)",
        }}
      />

      {/* nuvens */}
      {[
        { top: "12%", left: "10%", s: 100 },
        { top: "20%", left: "55%", s: 140 },
        { top: "10%", left: "75%", s: 90 },
      ].map((n, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/40 blur-md"
          style={{
            top: n.top,
            left: n.left,
            width: n.s,
            height: n.s * 0.5,
            animation: reducedMotion ? "none" : `verade-cloud ${8 + i * 2}s linear ${i}s infinite alternate`,
          }}
        />
      ))}

      {/* montanhas ao fundo */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "35%", opacity: 0.7 }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 200"
      >
        <path d="M0,200 L0,100 Q200,40 400,90 T800,70 T1200,100 L1200,200 Z" fill="#2e7d32" />
      </svg>

      {/* chão da praça */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: "20%",
          background: "linear-gradient(180deg, #66bb6a 0%, #388e3c 100%)",
        }}
      />

      {/* fonte jorrando */}
      <div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2"
        style={{ width: "180px", height: "120px" }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg"
          style={{
            width: "140px",
            height: "24px",
            background: "linear-gradient(180deg, #78909c 0%, #546e7a 100%)",
          }}
        />
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded"
          style={{
            width: "80px",
            height: "40px",
            background: "linear-gradient(180deg, #90a4ae 0%, #607d8b 100%)",
          }}
        />
        <div
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1"
          style={{ opacity: recompensaAtivada ? 1 : 0.3, transition: "opacity 1s ease" }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: "6px",
                height: `${20 + (i % 4) * 12}px`,
                background: "linear-gradient(180deg, #4fc3f7 0%, transparent 100%)",
                animation: reducedMotion ? "none" : `verade-fountain 1.2s ease-in-out ${i * 0.08}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      <EsferasLuz ativo={recompensaAtivada} />
    </div>
  );
}
