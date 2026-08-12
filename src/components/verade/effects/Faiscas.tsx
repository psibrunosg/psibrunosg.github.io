// Faíscas vermelhas pulsantes — Capítulo 4 (Caverna Tramanhas / Azedo)

interface FaiscasProps {
  cor?: string;
  quantidade?: number;
  ativo?: boolean;
}

export default function Faiscas({ cor = "#ef5350", quantidade = 20, ativo = true }: FaiscasProps) {
  if (!ativo) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: quantidade }).map((_, i) => {
        const left = `${10 + (i * 17) % 80}%`;
        const top = `${20 + (i * 13) % 60}%`;
        const delay = `${(i % 6) * 0.25}s`;
        const dur = `${1.2 + (i % 3) * 0.4}s`;
        return (
          <span
            key={i}
            className="verade-spark absolute rounded-full"
            style={{
              left,
              top,
              width: "3px",
              height: "3px",
              background: cor,
              boxShadow: `0 0 10px 3px ${cor}`,
              animation: `verade-spark ${dur} ease-in-out ${delay} infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
