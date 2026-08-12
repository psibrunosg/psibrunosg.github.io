// Papéis flutuando — Capítulo 6 (Torre da Pessy)

interface PapeisFlutuandoProps {
  quantidade?: number;
}

export default function PapeisFlutuando({ quantidade = 18 }: PapeisFlutuandoProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: quantidade }).map((_, i) => {
        const left = `${(i / quantidade) * 100}%`;
        const delay = `${(i % 8) * 0.6}s`;
        const dur = `${5 + (i % 5)}s`;
        const rot = `${(i % 2 === 0 ? 1 : -1) * (10 + (i % 10))}deg`;
        return (
          <span
            key={i}
            className="verade-paper absolute rounded-sm border border-white/20"
            style={{
              left,
              top: "-12%",
              width: `${14 + (i % 10)}px`,
              height: `${18 + (i % 12)}px`,
              background: "rgba(255,255,255,0.12)",
              transform: `rotate(${rot})`,
              animation: `verade-fall ${dur} linear ${delay} infinite`,
              opacity: 0.6,
            }}
          />
        );
      })}
    </div>
  );
}
