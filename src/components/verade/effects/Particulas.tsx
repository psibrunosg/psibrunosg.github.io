// Partículas azuis flutuando — Capítulo 2 (Praça Vazia / Morajo)

interface ParticulasProps {
  cor?: string;
  quantidade?: number;
  ativo?: boolean;
}

export default function Particulas({ cor = "#3949ab", quantidade = 24, ativo = true }: ParticulasProps) {
  if (!ativo) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: quantidade }).map((_, i) => {
        const left = `${(i / quantidade) * 100}%`;
        const delay = `${(i % 7) * 0.4}s`;
        const dur = `${3 + (i % 4)}s`;
        const size = `${2 + (i % 3)}px`;
        return (
          <span
            key={i}
            className="verade-particle absolute rounded-full"
            style={{
              left,
              bottom: "-10%",
              width: size,
              height: size,
              background: cor,
              boxShadow: `0 0 8px 2px ${cor}`,
              animation: `verade-rise ${dur} ease-in-out ${delay} infinite`,
              opacity: 0.6,
            }}
          />
        );
      })}
    </div>
  );
}
